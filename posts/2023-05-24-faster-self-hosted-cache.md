---
title: Fixing the cache latency for self-hosted GitHub Actions
description: The cache for GitHub Actions can speed up CI/CD pipelines. But what about when it slows you down?
tags:
- cicd
- githubactions
- cache
- latency
- yarn
author_img: alex
image: /images/2023-05-faster-cache/background.png
date: "2023-05-24"
---

In some of our builds for actuated we cache things like the Linux Kernel, so we don't needlessly rebuild it when we update packages in our base images. It can shave minutes off every build meaning our servers can be used more efficiently. Most customers we've seen so far only make light to modest use of GitHub's hosted cache, so haven't noticed much of a latency problem.

But you don't have to spend too long on the [issuer tracker for GitHub Actions](https://github.com/actions/cache/issues?q=is%3Aissue+cache+slow+) to find people complaining about the cache being slow or locking up completely for self-hosted runners.

Go, Rust, Python and other languages don't tend to make heavy use of caches, and Docker has some of its own mechanisms like building cached steps into published images aka *[inline caching](https://docs.docker.com/build/cache/backends/inline/)*. But for the Node.js ecosystem, the `node_modules` folder and yarn cache can become huge and take a long time to download. That's one place where you may start to see tension between the speed of self-hosted runners and the latency of the cache. If your repository is a monorepo or has lots of large artifacts, you may get a speed boost by caching that too.

So why is GitHub's cache so fast for hosted runners, and (sometimes) so slow self-hosted runners?

Simply put - GitHub runs VMs and the accompanying cache on the same network, so they can talk over a high speed backbone connection. But when you run a self-hosted runner, then any download or upload operations are taking place over the public Internet.

Something else that can slow builds down is having to download large base images from the Docker Hub. We've already [covered how to solve that for actuated in the docs](https://docs.actuated.dev/tasks/registry-mirror/).

## Speeding up in the real world

We recently worked with Roderik, the CTO of [SettleMint](https://settlemint.com) to migrate their CI from a self-hosted Kubernetes solution Actions Runtime Controller (ARC) to actuated. He told me that they originally moved from GitHub's hosted runners to ARC to save money, increase speed and to lower the latency of their builds. Unfortunately, running container builds within Kubernetes provided very poor isolation, and side effects were being left over between builds, even with a pool of ephemeral containers. They also wanted to reduce the amount of effort required to maintain a Kubernetes cluster and control-plane for CI.

Roderik explained that he'd been able to get times down by using [pnpm](https://pnpm.io) instead of yarn, and said every Node project should try it out to see the speed increases. He believes the main improvement is due to efficient downloading and caching. pnpm is a drop-in replacement for npm and yarn, and is compatible with both.

> In some cases, we found that downloading dependencies from the Internet was faster than using GitHub's remote cache. The speed for a hosted runner was often over 100MBs/sec, but for a self-hosted runner it was closer to 20MBs/sec.

That's when we started to look into how we could run a cache directly on the same network as our self-hosted runners, or even on the machine that was scheduling the Firecracker VMs.

> "With the local cache that Alex helped us set up, the cache is almost instantaneous. It doesn't even have time to show a progress bar."

Long story short, SettleMint have successfully migrated their CI for x86 and Arm to actuated for the whole developer team:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Super happy with my new self hosted GHA runners powered by <a href="https://twitter.com/selfactuated?ref_src=twsrc%5Etfw">@selfactuated</a>, native speeds on both AMD and ARM bare metal monster machines. Our CI now goes brrrr… <a href="https://t.co/quZ4qfcLmu">pic.twitter.com/quZ4qfcLmu</a></p>&mdash; roderik.eth (@r0derik) <a href="https://twitter.com/r0derik/status/1661109934346346510?ref_src=twsrc%5Etfw">May 23, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This post is about speed improvements for caching, but if you're finding that QEMU is too slow to build your Arm containers on hosted runners, you may benefit from switching to actuated with bare-metal Arm servers.

See also:

* [How to split up multi-arch Docker builds to run natively](https://actuated.dev/blog/how-to-run-multi-arch-builds-natively)
* [How to make GitHub Actions 22x faster with bare-metal Arm](https://actuated.dev/blog/native-arm64-for-github-actions)

## Set up a self-hosted cache for GitHub Actions

In order to set up a self-hosted cache for GitHub Actions, we switched out the official [actions/cache@v3](https://github.com/actions/cache) action for [tespkg/actions-cache@v1](https://github.com/tespkg/actions-cache) created by Target Energy Solutions, a UK-based company, which can target S3 instead of the proprietary GitHub cache.

We then had to chose between Seaweedfs and Minio for the self-hosted S3 server. Of course, there's also nothing stopping you from actually using AWS S3, or Google Cloud Storage, or another hosted service.

Then, the question was - should we run the S3 service directly on the server that was running Firecracker VMs, for ultimate near-loopback speed, or on a machine provisioned in the same region, just like GitHub does with Azure?

Either would be a fine option. If you decide to host a public S3 cache, make sure that authentication and TLS are both enabled. You may also want to set up an IP whitelist just to deter any bots that may scan for public endpoints.

### Set up Seaweedfs

The [Seaweedfs](https://github.com/seaweedfs/seaweedfs) README describes the project as: 

> "a fast distributed storage system for blobs, objects, files, and data lake, for billions of files! Blob store has O(1) disk seek, cloud tiering. Filer supports Cloud Drive, cross-DC active-active replication, Kubernetes, POSIX FUSE mount, S3 API, S3 Gateway, Hadoop, WebDAV, encryption, Erasure Coding."

We liked it so much that we'd already added it to the arkade marketplace, arkade is a faster, developer-focused alternative to brew.

```bash
arkade get seaweedfs
sudo mv ~/.arkade/bin/seaweedfs /usr/local/bin
```

Define a secret key and access key to be used from the CI jobs in the `/etc/seaweedfs/s3.conf` file:

```
{
  "identities": [
    {
      "name": "actuated",
      "credentials": [
        {
          "accessKey": "s3cr3t",
          "secretKey": "s3cr3t"
        }
      ],
      "actions": [
        "Admin",
        "Read",
        "List",
        "Tagging",
        "Write"
      ]
    }
  ]
}
```

Create `seaweedfs.service`:

```
[Unit]
Description=SeaweedFS
After=network.target

[Service]
User=root
ExecStart=/usr/local/bin/seaweedfs server -ip=192.168.128.1 -volume.max=0 -volume.fileSizeLimitMB=2048 -dir=/home/runner-cache -s3 -s3.config=/etc/seaweedfs/s3.conf
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

We have set `-volume.max=0 -volume.fileSizeLimitMB=2048` to minimize the amount of space used and to allow large zip files of up to 2GB, but you can change this to suit your needs. See `seaweedfs server --help` for more options.

Install it and check that it started:

```
sudo cp ./seaweedfs.service /etc/systemd/system/seaweedfs.service
sudo systemctl enable seaweedfs

sudo journalctl -u seaweedfs -f
```

## Try it out

You'll need to decide what you want to cache and whether you want to use a hosted, or self-hosted S3 service - either directly on the actuated server or on a separate machine in the same region.

Roderik explained that the pnpm cache was important for node_modules, but that actually caching the git checkout saved a lot of time too. So he added both into his builds.

Here's an example:

```yaml
    - name: "Set current date as env variable"
      shell: bash
      run: |
        echo "CHECKOUT_DATE=$(date +'%V-%Y')" >> $GITHUB_ENV
      id: date
    - uses: tespkg/actions-cache@v1
      with:
        endpoint: "192.168.128.1"
        port: 8333
        insecure: true
        accessKey: "s3cr3t"
        secretKey: "s3cr3t"
        bucket: actuated-runners
        region: local
        use-fallback: true
        path: ./.git
        key: ${{ runner.os }}-checkout-${{ env.CHECKOUT_DATE }}
        restore-keys: |
          ${{ runner.os }}-checkout-
```

* `use-fallback` - option means that if seaweedfs is not installed on the host, or is inaccessible, the action will fall back to using the GitHub cache.
* `key` - as per GitHub's action - created when saving a cache and the key used to search for a cache
* `restore-keys` - as per GitHub's action - if no cache hit occurs for key, these restore keys are used sequentially in the order provided to find and restore a cache.
* `bucket` - the name of the bucket to use in seaweedfs
* `accessKey` and `secretKey` - the credentials to use to access the bucket - we'd recommend using an organisation-level secret for this
* `endpoint` - the IP address `192.168.128.1` refers to the host machine where the Firecracker VM is running

See also: [Official GitHub Actions Cache action](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

You may also want to create a self-signed certificate for the S3 service and then set `insecure: false` to ensure that the connection is encrypted. If you're running these builds within private repositories, tampering is unlikely.

Roderik explained that the cache key uses a week-year format, rather than a SHA. Why? Because a SHA would change on every build, meaning that a save and load would be performed on every build, using up more space and slowing things down. In this example, There's only ever 52 cache entries per year.

> You define a key which is unique if the cache needs to be updated. Then you define a restore key that matches part or all of the key.
> Part means it takes the last one that matches, then updates at the end of the run, in the post part, it then uses the key to upload the zip file if the key is different from the one stored.

In one instance, a cached checkout went from 2m40s to 11s. That kind of time saving adds up quickly if you have a lot of builds.

Roderik's pipeline has multiple steps, and may need to run multiple times, so we're looking at 55s instead of 13 minutes for 5 jobs or runs.

![Example pipeline](/images/2023-05-faster-cache/SettleMint.png)
> One of the team's pipelines

Here's how to enable a cache for `pnpm`:

```yaml
    - name: Install PNPM
      uses: pnpm/action-setup@v2
      with:
        run_install: |
          - args: [--global, node-gyp]

    - name: Get pnpm store directory
      id: pnpm-cache
      shell: bash
      run: |
        echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

    - uses: tespkg/actions-cache@v1
      with:
        endpoint: "192.168.128.1"
        port: 8333
        insecure: true
        accessKey: "s3cr3t"
        secretKey: "s3cr3t"
        bucket: actuated-runners
        region: local
        use-fallback: true
        path:
          ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          ~/.cache
          .cache
        key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
        restore-keys: |
          ${{ runner.os }}-pnpm-store-

    - name: Install dependencies
      shell: bash
      run: |
        pnpm install --frozen-lockfile --prefer-offline
      env:
        HUSKY: '0'
        NODE_ENV: development
```

Picking a good key and restore key can help optimize when the cache is read from and written to:

> "You need to determine a good key and restore key. For pnpm, we use the hash of the lock file in the key, but leave it out of the restore key. So if I update the lock file, it starts from the last cache, updates it, and stores the new cache with the new hash"

If you'd like a good starting-point for GitHub Actions Caching, Han Verstraete from our team wrote up a good primer for the actuated docs:

[Example: GitHub Actions cache](https://docs.actuated.dev/examples/github-actions-cache/)

## Conclusion

We were able to dramatically speed up caching for GitHub Actions by using a self-hosted S3 service. We used Seaweedfs directly on the server running Firecracker with a fallback to GitHub's cache if the S3 service was unavailable.

[![Brr](https://pbs.twimg.com/media/Fw4PQEfWwAIl-6u?format=jpg&name=medium)](https://twitter.com/alexellisuk/status/1661282581617229827/)
> An [Ampere](https://amperecomputing.com/en/) Altra Arm server running parallel VMs using Firecracker. The CPU is going brr. [Find a server with our guide](https://docs.actuated.dev/provision-server/)

We also tend to recommend that all customers enable a mirror of the Docker Hub to counter restrictive rate-limits. The other reason is to avoid any penalties that you'd see from downloading large base images - or from downloading small to medium sized images when running in high concurrency.

You can find out how to configure a container mirror for the Docker Hub using actuated here: [Set up a registry mirror](https://docs.actuated.dev/tasks/registry-mirror/). When testing builds for the [Discourse](https://github.com/discourse/discourse) team, there was a 2.5GB container image used for UI testing with various browsers preinstalled within it. We found that we could shave off a few minutes off the build time by using the local mirror. Imagine 10x of those builds running at once, needlessly downloading 250GB of data.

What if you're not an actuated customer? Can you still benefit from a faster cache? You could try out a hosted service like AWS S3 or Google Cloud Storage, provisioned in a region closer to your runners. The speed probably won't quite be as good, but it should still be a lot faster than reaching over the Internet to GitHub's cache.

If you'd like to try out actuated for your team, [reach out to us to find out more](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform).

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Book 20 mins with me if you think your team could benefit from the below for GitHub Actions:<br><br>🚀 Insights into CI usage across your organisation<br>🚀 Faster x86 builds<br>🚀 Native Arm builds that can actually finish<br>🚀 Fixed-costs &amp; less management<a href="https://t.co/iTiZsH9pgv">https://t.co/iTiZsH9pgv</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1656300308325179393?ref_src=twsrc%5Etfw">May 10, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


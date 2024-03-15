---
title: Testing the impact of a local cache for building Discourse
description: We compare the impact of switching Discourse's GitHub Actions from self-hosted runners and a hosted cache, to a local cache with S3.
tags:
  - s3
  - githubactions
  - cache
  - latency
author_img: welteki
image: /images/2024-02-local-caching-for-github-actions/background.png
date: "2024-02-23"
---

We heard from the [Discourse](https://github.com/discourse/discourse) project last year because they were looking to speed up their builds. After trying out a couple of solutions that automated self-hosted runners, they found out that whilst faster CPUs were nice, reliability was a problem and the cache hosted on GitHub's network became the new bottleneck. We ran some tests to compare the hosted cache with hosted runners, to self-hosted with a local cache running with S3. This post will cover what we found.

<img src="/images/2024-02-local-caching-for-github-actions/discourse-readme-logo.png" width="200" alt="Discourse logo">

> Discourse is the online home for your community. We offer a 100% open source community platform to those who want complete control over how and where their site is run.

## Set up a local cache

Hosted runners are placed close to the cache which means the latency is very low. Self-hosted runners can also make good use of this cache but the added latency can negate the advantage of switching to these faster runners. Running a local S3 cache with [Minio](https://github.com/minio/minio) or [Seaweedfs](https://github.com/seaweedfs/seaweedfs) on the self hosted runner or in the same region/network can solve this problem.

For this test we ran the cache on the runner host. [Instructions](https://docs.actuated.dev/tasks/local-github-cache/) to set up a local S3 cache with Seaweedfs can be found in our docs.

The Discourse repo is already using the `actions/cache`in their tests workflow which makes it easy to switch out the official [actions/cache](https://github.com/actions/cache) with [tespkg/actions-cache](https://github.com/tespkg/actions-cache).

The S3 cache is not directly compatible with the official [actions/cache](https://github.com/actions/cache) and some changes to the workflows are required to start using the cache.

The `tespkg/actions-cache` supports the same properties as the actions cache and only requires some additional parameters to configure the S3 connection.

```diff
 - name: Bundler cache
-  uses: actions/cache@v3
+  uses: tespkg/actions-cache@v1
   with:
+    endpoint: "192.168.128.1"
+    port: 8333
+    insecure: true
+    accessKey: ${{ secrets.ACTIONS_CACHE_ACCESS_KEY }}
+    secretKey: ${{ secrets.ACTIONS_CACHE_SECRET_KEY }}
+    bucket: actuated-runners
+    region: local
+    use-fallback: false

     path: vendor/bundle
     key: ${{ runner.os }}-${{ matrix.ruby }}-gem-${{ hashFiles('**/Gemfile.lock') }}-cachev2
```

The endpoint could also be a HTTPS URL to a S3 server hosted within the same network as the self-hosted runners.

If you are relying on the built-in cache support that is included in some actions like [setup-node](https://github.com/actions/setup-node#caching-global-packages-data) and [setup-go](https://github.com/actions/setup-go) you will need to add an additional caching step to your workflow as they are not directly compatible with the self-hosted S3 cache.

## The impact of switching to a local cache

The [Tests workflow](https://github.com/discourse/discourse/actions/workflows/tests.yml) from the [Discourse repository](https://github.com/discourse/discourse) was used to test the impact of switching to a local cache. We ran the workflow on a self-hosted Actuated runner, both with the S3 local cache and with the GitHub cache.

Next we looked at the time required to restore the caches in our two environments and compared it with the times we saw on GitHub hosted runners:

|                                     | Bundler cache<br>(±273MB) | Yarn cache<br>(±433MB) | Plugins gems cache<br>(±51MB) | App state cache<br>(±1MB) |
| ----------------------------------- | ------------------------- | ---------------------- | ----------------------------- | ------------------------- |
| **Actuated with local cache**       | 5s                        | 11s                    | 1s                            | 0s                        |
| **Actuated with hosted cache**      | 13s                       | 19s                    | 3s                            | 2s                        |
| **Runner & cache hosted on GitHub** | 6s                        | 11s                    | 3s                            | 2s                        |

While the GitHub runner and the self-hosted runner with a local cache perform very similarly, cache restores on the self-hosted runner that uses the GitHub cache take a bit longer.

If we take a look at the yarn cache, which is the biggest cache, we can see that switching to the local S3 cache saved 8s for the cache size in this test vs using GitHub's cache from a self-hosted runner. This is a 42% improvement.

Depending on your workflow and the cache size this can add up quickly. If a pipeline has multiple steps or when you are running matrix builds a cache step may need to run multiple times. In the case of the Discourse repo this cache step runs nine times which adds up to 1m12s that can be saved per workflow run.

When Discourse approached us, we found that they had around a dozen jobs running for each pull request, all with varying sizes of caches. At busy times of the day, their global team could have 10 or more of those pull requests running, so these savings could add up to a significant amount.

**What if you also cached git checkout**

If your repository is a monorepo or has lots of large artifacts, you may get a speed boost caching the `git checkout` step too. Depending on where your runners are hosted, pulling from GitHub can take some time vs. restoring the same files from a local cache.

We demonstrated what impact that had for Settlemint's CTO in [this case study](/blog/faster-self-hosted-cache). They saw a cached checkout using a GitHub's hosted cache from from 2m40s to 11s.

**How we improved testpkg's custom action**

During our testing we noticed that every cache restore took a minimum of 10 seconds regardless of the cache size. It turned out to be an issue with timeouts in the `tespkg/actions-cache` action when listing objects in S3. We reported it and sent them [a pull request with a fix](https://github.com/tespkg/actions-cache/pull/44).

With the fix in place restoring small caches from the local cache dropped from 10s to sub 1s.

## The impact of switching to faster runners

The Discourse repo uses the larger GitHub hosted runners to run tests. The jobs we are going to compare are part of the [Tests workflow](https://github.com/discourse/discourse/actions/workflows/tests.yml). They are using runners with 8 CPUs and 32GB of ram so we replaced the `runs-on` label with an actuated label `actuated-8cpu-24gb` to run the jobs on similar sized microVMs.

All jobs ran on the same [Hetzner AX102](https://www.hetzner.com/dedicated-rootserver/ax102/) bare metal host.

This table compares the time it took to run each job on the hosted runner and on our Actuated runner.

| Job                  | GitHub hosted runner | Actuated runner | Speedup |
| -------------------- | -------------------- | --------------- | ------- |
| **core annotations** | 3m23s                | 1m22s           | 59%     |
| **core backend**     | 7m11s                | 6m0s            | 16%     |
| **plugins backend**  | 7m42s                | 5m54s           | 23%     |
| **plugins frontend** | 5m28s                | 4m3s            | 26%     |
| **themes frontend**  | 4m20s                | 2m46s           | 36%     |
| **chat system**      | 9m37s                | 6m33s           | 32%     |
| **core system**      | 7m12s                | 5m24s           | 25%     |
| **plugin system**    | 5m32s                | 3m56s           | 29%     |
| **themes system**    | 4m32s                | 2m41            | 41%     |

The first thing we notice is that all jobs completed faster on the Actuated runner. On average we see an improvement of around 1m40s seconds for each individual job.

## Conclusion

While switching to faster self-hosted runners is the most obvious way to speed up your builds, the cache hosted on GitHub's network can become a new bottleneck if you use caching in your actions. After switching to a local S3 cache we saw a very significant improvement in the cache latency. Depending on how heavily the cache is used in your workflow and the size of your cache artifacts, switching to a local S3 cache might even have a bigger impact on build times.

Both Seaweedfs and Minio were tested in our setup and they performed in a very similar way. Both have different open source licenses, so we'd recommend reading those before picking one or the other. Of course you could also use AWS S3, Google Cloud Storage, or another S3 compatible hosted service.

In addition to the reduced latency, switching to a self hosted cache has a couple of other benefits.

- No limit on the cache size. The GitHub cache has a size limit of 10GB before the oldest cache entries start to get pruned.
- No egress costs for pushing data to the cache from self-hosted runners.

GitHub's caching action does not yet support using a custom S3 server, so we had to make some minor adjustments to the Discourse's workflow files. For this reason, if you use something like setup-go or setup-node, you won't be able to just set `cache: true`. Instead you'll need an independent caching step with the `testpkg/actions-cache` action.

If you'd like to reach out to us and see if we can advise you on how to optmise your builds, you can [set up a call with us here.](https://actuated.dev/pricing).

If you want to learn more about caching for GitHub Actions checkout some of our other blog posts:

You may also like:

- [Make your builds run faster with Caching for GitHub Actions](https://actuated.dev/blog/caching-in-github-actions)
- [Fixing the cache latency for self-hosted GitHub Actions](https://actuated.dev/blog/faster-self-hosted-cache)
- [Is GitHub's self-hosted runner safe for open source?](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions)

---
title: How to split up multi-arch Docker builds to run natively
description: QEMU is a convenient way to publish containers for multiple architectures, but it can be incredibly slow. Native is much faster.
author: Alex Ellis
tags:
- baremetal
- githubactions
- multiarch
- arm
author_img: alex
image: /images/2023-split-native/background.jpg
date: "2023-03-24"
---

In two previous articles, we covered huge improvements in performance for the Parca project and VPP (Network Service Mesh) simply by switching to actuated with Arm64 runners instead of using QEMU and hosted runners.

In the [first case](http://actuated.dev/blog/native-arm64-for-github-actions), using QEMU took over 33 minutes, and bare-metal Arm showed a 22x improvement at only 1 minute 26 seconds. For Network Service Mesh, [VPP](http://actuated.dev/blog/case-study-bring-your-own-bare-metal-to-actions) couldn't even complete a build in 6 hours using QEMU - and I got it down to 9 minutes flat using a bare-metal [Ampere Altra server](https://amperecomputing.com/processors/ampere-altra).

## What are we going to see and why is it better?

In this article, I'll show you how to run multi-arch builds natively on bare-metal hardware using GitHub Actions and actuated.

[Actuated](https://actuated.dev/) is a SaaS service that we built so that you can Bring Your Own compute to GitHub Actions, and have every build run in an immutable, single-use VM.

[![Comparison of the two builds](https://pbs.twimg.com/media/Fr_CcVJWIAEY1gL?format=png&name=medium)](https://twitter.com/alexellisuk/status/1639232258887372801?s=20)
> Comparison of splitting out to run in parallel on native hardware and QEMU.

Not every build will see such a dramatic increase as the ones I mentioned in the introduction. Here, with the inlets-operator, we gained 4 minutes on each commit. But I often speak to users who are running past 30 minutes to over an hour because of QEMU.

Three things got us a speed bump here:

* We ran on bare-metal, native hardware - not the standard hosted runner from GitHub
* We split up the work and ran in parallel - rather than waiting for two builds to run in serial
* Finally, we did away with QEMU and ran the Arm build directly on an Arm server

Only last week an engineer at Calyptia (the team behind [fluent-bit](https://fluentbit.io/)) reached out for help after telling me they had to disable and stop publishing open source images for Arm, it was simply timing out at the 6 hour mark.

So how does this thing work, and is QEMU actually "OK"?

## QEMU can be slow, but it's actually "OK"

So if the timings are so bad, why does anyone use QEMU?

Well it's free - as in beer, there's no cost at all to use it. And many builds can complete in a reasonable amount of time using QEMU, even if it's not as fast as native.

That's why we wrote up how we build 80+ multi-arch images for various products like OpenFaaS and Inlets:

[The efficient way to publish multi-arch containers from GitHub Actions](https://actuated.dev/blog/multi-arch-docker-github-actions)

Here's what the build looks like with QEMU:

```yaml
name: split-operator

on:
  push:
    branches: [ master, qemu ]

jobs:

  publish_qemu:
    concurrency: 
      group: ${{ github.ref }}-qemu
      cancel-in-progress: true
    permissions:
      packages: write

    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
        with:
          repository: inlets/inlets-operator
          path: "./"

      - name: Get Repo Owner
        id: get_repo_owner
        run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" > $GITHUB_ENV

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to container Registry
        uses: docker/login-action@v2
        with:
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
          registry: ghcr.io

      - name: Release build
        id: release_build
        uses: docker/build-push-action@v3
        with:
          outputs: "type=registry,push=true"
          platforms: linux/amd64,linux/arm64
          file: ./Dockerfile
          context: .
          build-args: |
            Version=dev
            GitCommit=${{ github.sha }}
          tags: |
            ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-qemu
```

This is the kind of build that is failing or causing serious delays for projects like Parca, VPP and Fluent Bit.

Let's look at the alternative.

## Building on native hardware

Whilst QEMU emulates the architecture you need within a build, it's not the same as running on the real hardware. This is why we see such a big difference in performance.

The downside is that we have to write a bit more CI configuration and run two builds instead of one, but there is some good news - we can now run them in parallel.

In parallel we:

1. We publish the x86_64 image - `ghcr.io/owner/repo:sha-amd64`
2. We publish the ARM image - `ghcr.io/owner/repo:sha-arm64`

Then:

3. We create a manifest with its own name - `ghcr.io/owner/repo:sha`
4. We annotate the manifest with the images we built earlier
5. We push the manifest

In this way, anyone can pull the image with the name `ghcr.io/owner/repo:sha` and it will map to either of the two images for Arm64 or Amd64.

![Parallel execution](/images/2023-split-native/parallel.jpg)
> The two builds on the left ran on two separate bare-metal hosts, and the manifest was published using one of GitHub's hosted runners.

Here's a sample for the inlets-operator, a Go binary which connects to the Kubernetes API.

First up, we have the x86 build:

```yaml
name: split-operator

on:
  push:
    branches: [ master ]

jobs:

  publish_x86:
    concurrency: 
      group: ${{ github.ref }}-x86
      cancel-in-progress: true
    permissions:
      packages: write

    runs-on: actuated
    steps:
      - uses: actions/checkout@master
        with:
          repository: inlets/inlets-operator
          path: "./"

      - name: Setup mirror
        uses: self-actuated/hub-mirror@master

      - name: Get Repo Owner
        id: get_repo_owner
        run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" > $GITHUB_ENV

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to container Registry
        uses: docker/login-action@v2
        with:
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
          registry: ghcr.io

      - name: Release build
        id: release_build
        uses: docker/build-push-action@v3
        with:
          outputs: "type=registry,push=true"
          platforms: linux/amd64
          file: ./Dockerfile
          context: .
          build-args: |
            Version=dev
            GitCommit=${{ github.sha }}
          tags: |
            ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-amd64
```

Then we have the arm64 build which is almost identical, but we specify a different value for `platforms` and the `runs-on` field.

```yaml

  publish_aarch64:
    concurrency: 
      group: ${{ github.ref }}-aarch64
      cancel-in-progress: true
    permissions:
      packages: write

    runs-on: actuated-aarch64
    steps:
      - uses: actions/checkout@master
        with:
          repository: inlets/inlets-operator
          path: "./"

      - name: Setup mirror
        uses: self-actuated/hub-mirror@master

      - name: Get Repo Owner
        id: get_repo_owner
        run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" > $GITHUB_ENV

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to container Registry
        uses: docker/login-action@v2
        with:
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
          registry: ghcr.io

      - name: Release build
        id: release_build
        uses: docker/build-push-action@v3
        with:
          outputs: "type=registry,push=true"
          platforms: linux/arm64
          file: ./Dockerfile
          context: .
          build-args: |
            Version=dev
            GitCommit=${{ github.sha }}
          tags: |
            ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-aarch64
```

Finally, we need to create the manifest. GitHub Actions has a `needs` variable that we can set to control the execution order:

```yaml
  publish_manifest:
    runs-on: ubuntu-latest
    needs: [publish_x86, publish_aarch64]
    steps:

    - name: Get Repo Owner
      id: get_repo_owner
      run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" > $GITHUB_ENV

    - name: Login to container Registry
      uses: docker/login-action@v2
      with:
        username: ${{ github.repository_owner }}
        password: ${{ secrets.GITHUB_TOKEN }}
        registry: ghcr.io

    - name: Create manifest
      run: |
        docker manifest create ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }} \
          --amend ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-amd64 \
          --amend ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-aarch64
        docker manifest annotate --arch amd64 --os linux ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }} ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-amd64
        docker manifest annotate --arch arm64 --os linux ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }} ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}-aarch64
        docker manifest inspect ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}

        docker manifest push ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}
```

One thing I really dislike about this final stage is how much repetition we get. Fortunately, it's relatively simple to hide this complexity behind a custom GitHub Action.

Note that this is just an example at the moment, but I could make a custom composite action in Bash in about 30 minutes, including testing. So it's not a lot of work and it would make our whole workflow a lot less repetitive.

```yaml
   uses: self-actuated/compile-manifest@master
    with:
      image: ghcr.io/${{ env.REPO_OWNER }}/inlets-operator
      sha: ${{ github.sha }}
      platforms: amd64,arm64
```

## Wrapping up

Yesterday we took a new customer on for actuated who wanted to improve the speed of Arm builds, but on the call we both knew they would need to leave QEMU behind. I put this write-up together to show what would be involved, and I hope it's useful to you.

Where can you run these builds?

Couldn't you just add a low-cost Arm VM from AWS, Oracle Cloud, Azure or Google Cloud?

The answer unfortunately is no.

The self-hosted runner is not suitable for open source / public repositories, the GitHub documentation has a stark warning about this.

The Kubernetes controller that's available has the same issues, because it re-uses the Pods by default, and runs in a dangerous Docker In Docker Mode as a privileged container or by mounting the Docker Socket. I'm not sure which is worse, but both mean that code in CI can take over the host, potentially even the whole cluster.

Hosted runners solve this by creating a fresh VM per job, and destroying it immediately. That's the same approach that we took with actuated, but you get to bring your own metal along, so that you keep costs from growing out of control. Actuated also supports Arm, out of the box.

Want to know more about the security of self-hosted runners? [Read more in our FAQ](https://docs.actuated.dev/faq/).

Want to talk to us about your CI/CD needs? We're happy to help.

* [Contact us about a PoC](https://docs.actuated.dev/register/#sign-up-for-the-pilot)


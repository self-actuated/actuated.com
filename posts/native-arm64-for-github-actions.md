---
title: How to make GitHub Actions 22x faster with bare-metal ARM
description: GitHub doesn't provide hosted ARM runners, so how can you use native ARM runners safely & securely?
author: Alex Ellis
tags:
- cicd
- githubactions
- arm
- arm64
- multiarch
author_img: alex
image: /images/2023-native-arm64-for-oss/in-progress-dashboard.png
date: "2023-01-17"
---

GitHub Actions is a modern, fast and efficient way to build and test software, with free runners available. We use the free runners for various open source projects and are generally very pleased with them, after all, who can argue with good enough and free? But one of the main caveats is that GitHub's hosted runners don't yet support the ARM architecture.

So many people turn to software-based emulation using [QEMU](https://www.qemu.org/). QEMU is tricky to set up, and requires specific code and tricks if you want to use software in a standard way, without modifying it. But QEMU is great when it runs with hardware acceleration. Unfortunately, the hosted runners on GitHub do not have KVM available, so builds tend to be incredibly slow, and I mean so slow that it's going to distract you and your team from your work.

This was even more evident when [Frederic Branczyk](https://twitter.com/fredbrancz) tweeted about his experience with QEMU on [GitHub Actions](https://github.com/features/actions) for his open source observability project named [Parca](https://github.com/parca-dev/parca).

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Does anyone have a <a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@github</a> actions self-hosted runner manifest for me to throw at a <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> cluster? I&#39;m tired of waiting for emulated arm64 CI runs taking ages.</p>&mdash; Frederic 🧊 Branczyk @brancz@hachyderm.io (@fredbrancz) <a href="https://twitter.com/fredbrancz/status/1582779459379204096?ref_src=twsrc%5Etfw">October 19, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I checked out his build and expected "ages" to mean 3 minutes, in fact, it meant 33.5 minutes. I know because I forked his project and ran a test build.

After migrating it to actuated and one of our build agents, the time dropped to 1 minute and 26 seconds, a 22x improvement for zero effort.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This morning <a href="https://twitter.com/fredbrancz?ref_src=twsrc%5Etfw">@fredbrancz</a> said that his ARM64 build was taking 33 minutes using QEMU in a GitHub Action and a hosted runner.<br><br>I ran it on <a href="https://twitter.com/selfactuated?ref_src=twsrc%5Etfw">@selfactuated</a> using an ARM64 machine and a microVM.<br><br>That took the time down to 1m 26s!! About a 22x speed increase. <a href="https://t.co/zwF3j08vEV">https://t.co/zwF3j08vEV</a> <a href="https://t.co/ps21An7B9B">pic.twitter.com/ps21An7B9B</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1583089248084729856?ref_src=twsrc%5Etfw">October 20, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

You can see the results here:

[![Results from the test, side-by-side](https://pbs.twimg.com/media/FfhC5z1XkAAoYjn?format=jpg&name=large)](https://twitter.com/alexellisuk/status/1583089248084729856/photo/1)

As a general rule, the download speed is going to be roughly the same with a hosted runner, it may even be slightly faster due to the connection speed of Azure's network.

But the compilation times speak for themselves - in the Parca build, `go test` was being run with QEMU. Moving it to run on the ARM64 host directly, resulted in the marked increase in speed. In fact, the team had introduced lots of complicated code to try and set up a Docker container to use QEMU, all that could be stripped out, replacing it with a very standard looking test step:

```yaml
  - name: Run the go tests
    run: go test ./...
```

## Can't I just install the self-hosted runner on an ARM VM?

There are relatively cheap ARM VMs available from Oracle OCI, Google and Azure based upon the Ampere Altra CPU. AWS have their own ARM VMs available in the Graviton line.

So why shouldn't you just go ahead and install the runner and add them to your repos?

The moment you do that you run into three issues:

* You now have to maintain the software packages installed on that machine
* If you use KinD or Docker, you're going to run into conflicts between builds
* There is poor scheduling, by default only running on build at a time there

Chasing your tail with package updates, faulty builds due to caching and conflicts is not fun, you may feel like you're saving money, but you are paying with your time and if you have a team, you're paying with their time too.

Most importantly, GitHub say that it cannot be used safely with a public repository. There's no security isolation, and state can be left over from one build to the next, including harmful code left intentionally by bad actors, or accidentally from malware.

## So how do we get to a safer, more efficient ARM runner?

The answer is to get us as close as possible to a hosted runner, but with the benefits of a self-hosted runner.

That's where actuated comes in.

We run a SaaS that manages bare-metal for you, and talks to GitHub upon your behalf to schedule jobs efficiently.

* No need to maintain software, we do that for you with an automated OS image
* We use microVMs to isolate builds from each other
* Every build is immutable and uses a clean environment
* We can schedule multiple builds at once without side-effects

microVMs on ARM require a bare-metal server, and we have tested all the options available to us. Note that the ARM VMs discussed above do not currently support KVM or nested virtualisation. 

* a1.metal on AWS - 16 cores / 32GB RAM - 300 USD / mo
* c3.large.arm64 from [Equinix Metal](https://metal.equinix.com/product/servers/c3-large-arm64/) with 80 Cores and 256GB RAM - 2.5 USD / hr
* [RX-Line](https://www.hetzner.com/dedicated-rootserver/matrix-rx) from [Hetzner](https://hetzner.com) with 128GB / 256GB RAM, NVMe & 80 cores for approx 200-250 EUR / mo.
* [Mac Mini M1](https://amzn.to/3WiSDE7) - 8 cores / 16GB RAM - tested with Asahi Linux - one-time payment of ~ 1500 USD

I even tried Frederic's Parca job [on my 8GB Raspberry Pi with a USB NVMe](https://twitter.com/alexellisuk/status/1585228202087415808?s=20&t=kW-cfn44pQTzUsRiMw32kQ). Why even bother, do I hear you say? Well for a one-time payment of 80 USD, it was 26m30s quicker than a hosted runner with QEMU!

[Learn how to connect an NVMe over USB-C to your Raspberry Pi 4](https://alexellisuk.medium.com/upgrade-your-raspberry-pi-4-with-a-nvme-boot-drive-d9ab4e8aa3c2)

## What does an ARM job look like?

Since I first started trying to build code for ARM in 2015, I noticed a group of people who had a passion for this efficient CPU and platform. They would show up on GitHub issue trackers, ready to send patches, get access to hardware and test out new features on ARM chips. It was a tough time, and we should all be grateful for their efforts which go largely unrecognised.

> If you're looking to make your [software compatible with ARM](https://twitter.com/alexellisuk), feel free to reach out to me via Twitter.

In 2020 when Apple released their M1 chip, ARM went mainstream, and projects that had been putting off ARM support like KinD and Minikube, finally had that extra push to get it done.

I've had several calls with teams who use Docker on their M1/M2 Macs exclusively, meaning they build only ARM binaries and use only ARM images from the Docker Hub. Some of them even ship to project using ARM images, but I think we're still a little behind the curve there.

That means Kubernetes - KinD/Minikube/K3s and Docker - including Buildkit, compose etc, all work out of the box.

I'm going to use the arkade CLI to download KinD and kubectl, however you can absolutely find the download links and do all this manually. I don't recommend it!

```yaml
name: e2e-kind-test

on: push
jobs:
  start-kind:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: get arkade
        uses: alexellis/setup-arkade@v1
      - name: get kubectl and kubectl
        uses: alexellis/arkade-get@master
        with:
          kubectl: latest
          kind: latest
      - name: Create a KinD cluster
        run: |
          mkdir -p $HOME/.kube/
          kind create cluster --wait 300s
      - name: Wait until CoreDNS is ready
        run: |
          kubectl rollout status deploy/coredns -n kube-system --timeout=300s
      - name: Explore nodes
        run: kubectl get nodes -o wide
      - name: Explore pods
        run: kubectl get pod -A -o wide
```

That's our `x86_64` build, or Intel/AMD build that will run on a hosted runner, but will be kind of slow.

Let's convert it to run on an actuated ARM64 runner:

```diff
jobs:
  start-kind:
-    runs-on: ubuntu-latest
+    runs-on: actuated-aarch64
```

That's it, we've changed the runner type and we're ready to go.

![In progress build on the dashboard](/images/2023-native-arm64-for-oss/in-progress-dashboard.png)

> An in progress build on the dashboard

Behind the scenes, actuated, the SaaS schedules the build on a bare-metal ARM64 server, the boot up takes less than 1 second, and then the standard GitHub Actions Runner talks securely to GitHub to run the build. The build is isolated from other builds, and the runner is destroyed after the build is complete.

![Setting up an ARM KinD cluster took about 49s](/images/2023-native-arm64-for-oss/arm-kind.png)
> Setting up an ARM KinD cluster took about 49s

Setting up an ARM KinD cluster took about 49s, then it's over to you to test your ARM images, or binaries.

If I were setting up CI and needed to test software on both ARM and x86_64, then I'd probably create two separate builds, one for each architecture, with a `runs-on` label of `actuated` and `actuated-aarch64` respectively.

Do you need to test multiple versions of Kubernetes? Let's face it, it changes so often, that who doesn't need to do that. You can use the `matrix` feature to test multiple versions of Kubernetes on ARM and x86_64.

I show 5x clusters being launched in parallel in the video below:

[Demo - Actuated - secure, isolated CI for containers and Kubernetes](https://www.youtube.com/watch?v=2o28iUC-J1w)

What about Docker?

Docker comes pre-installed in the actuated OS images, so you can simply use `docker build`, without any need to install extra tools like Buildx, or to have to worry about multi-arch Dockerfiles. Although these are always good to have, and are [available out of the box in OpenFaaS](https://github.com/openfaas/golang-http-template/blob/master/template/golang-middleware/Dockerfile), if you're curious what a multi-arch Dockerfile looks like.

## Wrapping up

Building on bare-metal ARM hosts is more secure because side effects cannot be left over between builds, even if malware is installed by a bad actor. It's more efficient because you can run multiple builds at once, and you can use the latest software with our automated Operating System image. Enabling actuated on a build is as simple as changing the runner type.

And as you've seen from the example with the OSS Parca project, moving to a native ARM server can improve speed by 22x, shaving off a massive 34 minutes per build.

Who wouldn't want that?

Parca isn't a one-off, I was also told by [Connor Hicks from Suborbital](https://twitter.com/cohix) that they have an ARM build that takes a good 45 minutes due to using QEMU.

Just a couple of days ago [Ed Warnicke, Distinguished Engineer at Cisco](https://twitter.com/edwarnicke?lang=en) reached out to us to pilot actuated. Why?

Ed, who had [Network Service Mesh](https://networkservicemesh.io/) in mind said:

> I'd kill for proper ARM support. I'd love to be able to build our many containers for ARM natively, and run our KIND based testing on ARM natively.
> We want to build for ARM - ARM builds is what brought us to actuated

So if that sounds like where you are, reach out to us and we'll get you set up.

* [Register to pilot actuated with us](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform)

Additional links:

* [Actuated docs](https://docs.actuated.dev/)
* [FAQ & comparison to other solutions](https://docs.actuated.dev/faq)
* [Follow actuated on Twitter](https://twitter.com/selfactuated)


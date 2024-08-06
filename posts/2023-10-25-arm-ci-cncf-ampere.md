---
title: Announcing managed Arm CI for CNCF projects
description: "Ampere Computing and The Cloud Native Computing Foundation are sponsoring a pilot of actuated's managed Arm CI for CNCF projects."
tags:
- cloudnative
- arm
- opensource
author_img: alex
image: /images/2023-10-cncf/background.png
date: "2023-10-25"
---

In this post, we'll cover why [Ampere Computing](https://amperecomputing.com/) and [The Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) are sponsoring a pilot of actuated for open source projects, how you can get involved.

We'll also give you a quick one year recap on actuated, if you haven't checked in with us for a while.

## Managed Arm CI for CNCF projects

At KubeCon EU, I spoke to [Chris Aniszczyk](https://www.linkedin.com/in/caniszczyk/), CTO at the [Cloud Native Computing Foundation (CNCF)](https://cncf.io), and told him about some of the results we'd been seeing with actuated customers, including Fluent Bit, which is a CNCF project. Chris told me that many teams were either putting off Arm support all together, were suffering with the slow builds that come from using QEMU, or were managing their own infrastructure which was underutilized.

[Equinix](https://deploy.equinix.com/) provides a generous amount of credits to the CNCF under [CNCF Community Infrastructure Lab (CIL)](https://github.com/cncf/cluster), including access to powerful Ampere Q80 Arm servers ([c3.large.arm64](https://deploy.equinix.com/product/servers/c3-large-arm64/)), that may at times be required by Equinix customers for their own Arm workloads.

You can find out more about [Ampere's Altra platform here](https://amperecomputing.com/products/processors), which is being branded as a "Cloud Native" CPU, due to its low power consumption, high core count, and ubiquitous availability across Google Cloud, Oracle Cloud Platform, Azure, Equinix Metal, Hetzner Cloud, and Alibaba Cloud.

As you can imagine, over time, different projects have deployed 1-3 of their own runner servers, each with 256GB of RAM and 80 Cores, which remain idle most of the time, and are not available to other projects or Equinix customers when they may need them suddenly. So, if actuated can reduce this number, whilst also improving the experience for maintainers, then that's a win-win.

Around the same time as speaking to Chris, Ampere reached out and asked how they could help secure actuated for a number of CNCF projects.

Together, Ampere and the CNCF are now sponsoring an initial 1-year pilot of managed Arm CI provided by actuated, for CNCF projects, with the view to expand it, if the pilot is a success.

[Ed Vielmetti](https://www.linkedin.com/in/edwardvielmetti/), Developer Partner Manager at Equinix said:

> I'm really happy to see this all come together. If all goes according to plan, we'll have better runner isolation, faster builds, and a smaller overall machine footprint.

[Dave Neary](https://www.linkedin.com/in/dneary/), Director of Developer Relations at Ampere Computing added:

> Actuated offers a faster, more secure way for projects to run 64-bit Arm builds, and will also more efficiently use the Ampere Altra-based servers being used by the projects.
> 
> We're happy to support CNCF projects running their CI on Ampere Computing's Cloud Native Processors, hosted by Equinix.

## One year recap on actuated

In case you are hearing about actuated for the first time, I wanted to give you a quick one year recap.

Just over 12 months ago, we [announced the work we'd been doing with actuated](/blog/blazing-fast-ci-with-microvms) to improve self-hosted runner security and management. We were pleasantly surprised with the amount of people that responded who'd had a common experience with slow builds, running out of RAM, limited disk space, and a lack of an easy and secure way to run self-hosted runners.

Fast forward to today, and we have run over 140,000 individual Firecracker VMs for customers on their own hardware. Rather than the fully managed service that GitHub offers, we believe that you should be able to bring your own hardware, and pay a flat-rate fee for the service, rather than being charged per-minute.

The CNCF project brings about 64-bit Arm support, but we see a good mix of `x86_64` and Arm builds from customers, with both closed and open-source repositories being used.

The main benefits are having access to bigger, faster and more specialist hardware.

* For `x86_64` builds, we see about a 3x speed-up vs. using GitHub's hosted runners, in addition to being able to add more RAM and disk space to builds.
* For Arm64, we see builds which take several hours or which fail to complete within a 6 hour window using QEMU, go down to 3-5 minutes.

Vendors and consumers are becoming increasingly aware of the importance of the supply chain, GitHub's self-hosted runner is [not recommended for open source repos](/blog/is-the-self-hosted-runner-safe-github-actions). Why? Due to the way side-effects can be left over between builds. Actuated uses a fresh, immutable, Firecracker VM for every build which boots up in less than 1 second and is destroyed after the build completes, which removes this risk.

If you're wanting to know more about why we think microVMs are the only tool that makes sense for secure CI, then I'd recommend my talk from Cloud Native Rejekts earlier in the year: [Face off: VMs vs. Containers vs Firecracker](https://www.youtube.com/watch?v=pTQ_jVYhAoc).

## What are maintainers saying?

[Ellie Huxtable](https://www.linkedin.com/in/ellmh) is the maintainer of [Atuin](https://atuin.sh/), a popular open-source tool to sync, search and backup shell history. Her Rust build for the CLI took 90 minutes with QEMU, but was reduced to just 3 minutes with actuated, and a native Arm server.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Thanks to <a href="https://twitter.com/selfactuated?ref_src=twsrc%5Etfw">@selfactuated</a>, Atuin now has very speedy ARM docker builds in our GitHub actions! Thank you <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> 🙏<br><br>Docker builds on QEMU: nearly 90 mins<br>Docker builds on ARM with Actuated: ~3 mins</p>&mdash; Ellie Huxtable (@ellie_huxtable) <a href="https://twitter.com/ellie_huxtable/status/1715261549172936776?ref_src=twsrc%5Etfw">October 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

For Fluent Bit, one of their Arm builds was taking over 6 hours, which meant it always failed with a timed-out on a hosted runner. [Patrick Stephens](https://www.linkedin.com/in/patrickjkstephens/?originalSubdomain=uk), Tech Lead of Infrastructure at Calyptia reached out to work with us. We got the time down to 5 minutes by changing `runs-on: ubuntu-latest` to `runs-on: actuated-arm64-4cpu-16gb`, and if you need more or less RAM/CPU, you can tune those numbers as you wish.

Patrick shares about the experience on the Calyptia blog, including the benefits to their `x86_64` builds for the commercial Calyptia product: [Scaling ARM builds with Actuated](https://calyptia.com/blog/scaling-builds-with-actuated).

A number of CNCF maintainers and community leaders such as [Davanum Srinivas (Dims)](https://www.linkedin.com/in/davanum/), Principal Engineer at AWS have come forward with project suggestions, and we're starting to work through them, with the first two being Fluent Bit and etcd.

[Fluent Bit](https://fluentbit.io/) describes itself as:

> ..a super fast, lightweight, and highly scalable logging and metrics processor and forwarder. It is the preferred choice for cloud and containerized environments.

[etcd](https://etcd.io) is a core component of almost every Kubernetes installation and is responsible for storing the state of the cluster.

> A distributed, reliable key-value store for the most critical data of a distributed system

In the case of etcd, there were [two servers being maintained by five individual maintainers](https://github.com/etcd-io/etcd/pull/16801/files#diff-b8f5f4d0db4fb959d72d74463e2fd2637feb69f6b9e1dce61ad47ee031806dbd), all of that work goes away by adopting actuated.

We even sent etcd [a minimal Pull Request](https://github.com/etcd-io/etcd/pull/16801) to make the process smoother.

[James Blair, Specialist Solution Architect at Red Hat](https://github.com/jmhbnz), commented:

> I believe managed on demand arm64 CI hosts will definitely be a big win for the project. Keen to trial this.

Another maintainer also commented that they will [no longer need to worry about "leaky containers"](https://github.com/etcd-io/etcd/pull/16801#issuecomment-1774024719).

[![One of the first nightly jobs running within an isolated Firecracker VM](/images/2023-10-cncf/etcd-nightly.png)](https://github.com/etcd-io/etcd/actions/runs/6635037153)
> One of the first nightly workflows running within 4x separate isolated Firecracker VMs, one per job

Prior to adopting actuated, the two servers were only configured to run one job at a time, afterwards, the jobs are scheduled by the control-plane, according to the amount of available RAM and CPU in the target servers.

## How do we get access?

If you are working on a CNCF project and would like access, [please contact us via this form](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform). If your project gets selected for the pilot, there are a couple of things you may need to do.

1. If you are already using the GitHub Actions runner hosted on Equinix, then change the `runs-on: self-hosted` label to: `runs-on: actuated-arm64-8cpu-16gb`. Then after you've seen a build or two pass, delete the old runner.
2. If you are using QEMU, the best next step is to "split" the build into two jobs which can run on `x86_64` and `arm64` natively, that's what Ellie did and it only took her a few minutes.

The label for `runs-on:` allows for dynamic configuration of vCPU and GBs of RAM, just edit the label to match your needs, for etcd, the team asked for 8vCPU and 32GB of RAM, so they used `runs-on: actuated-arm64-8cpu-32gb`.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I had to split the docker build so that the ARM half would build on ARM, and x86 on x86, and then a step to combine the two - overall this works out to be a very significant improvement<a href="https://t.co/69cIxjYRcW">https://t.co/69cIxjYRcW</a></p>&mdash; Ellie Huxtable (@ellie_huxtable) <a href="https://twitter.com/ellie_huxtable/status/1715266936592904446?ref_src=twsrc%5Etfw">October 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

We have full instructions for 2, in the following tutorial: [How to split up multi-arch Docker builds to run natively](/blog/how-to-run-multi-arch-builds-natively).

**Is there access for AMD64?**

This program is limited to CNCF projects and Arm CI only. That said, most actuated customers run AMD64 builds with us.

GitHub already provides access to AMD64 runners for free for open source projects, that should cover most OSS project's needs.

So why would you want dedicated AMD64 support from actuated? Firstly, our recommended provider makes builds up to 3x quicker, secondly, you can run on private repos if required, without accuring a large bill.

**What are all the combinations of CPU and RAM?**

We get this question very often, but have tried to be as clear as possible in this blog post and [in the docs](https://docs.actuated.com/examples/custom-vm-size/). There are no set combinations. You can come up with what you need.

That helps us make best use of the hardware, you can even have just a couple of cores, and max out to 256GB of RAM, if that's what your build needs.

**What if the sponsored program is full?**

The program has been very popular and there is a limit to the budget and number of projects that Ampere and the CNCF agreed to pay for. If you contact us and we tell you the limit has been reached, then your employer could sponsor the subscription, and we'll give you a special discount - you could get started immediately. Or you'll need to contact [Chris Aniszczyk](https://www.linkedin.com/in/caniszczyk/) and tell him why it would be of value to the OSS project you represent to have native Arm CI. If you get in touch with us, we can introduce you to him via email if needed.

## Learn more about actuated

We're initially offering access to managed Arm CI for CNCF projects, but if you're working for a company that is experiencing friction with CI, please reach out to us to talk [using this form](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform).

Ampere who are co-sponsoring our service with the CNCF have their own announcement here: [Ampere Computing and CNCF Supporting Arm Native CI for CNCF Projects](https://amperecomputing.com/blogs/ampere-computing-and-cncf-supporting-arm-native-ci-for-ncf-projects).

* Read one of our [recent blog posts](https://actuated.com/blog)
* Learn more about [actuated in the docs](https://docs.actuated.com)
* [Read what our customers are saying about our service](https://actuated.com)

> Did you know? [Actuated for GitLab CI is now in technical preview, watch a demo here](/blog/secure-microvm-ci-gitlab).

---
title: Announcing managed Arm CI for CNCF projects (draft post)
description: "Ampere Computing and The Cloud Native Computing Foundation are sponsoring a pilot of actuated's managed Arm CI for CNCF projects."
tags:
- cloudnative
- arm
- opensource
author_img: alex
image: /images/2023-10-cncf/background.png
date: "2023-10-24"
---

> This is a draft blog post, it has not been published yet.

In this post, I'll explain the benefits of using native Arm servers for CI, why [Ampere Computing](https://amperecomputing.com/) and [The Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) are sponsoring a pilot of actuated for open source projects, and how you can get involved.

## One year recap on actuated

Over a year ago, we [announced actuated](https://actuated.dev/blog/blazing-fast-ci-with-microvms) and we were pleasantly surprised with the amount of people that responded who'd had a common experience with slow builds, running out of RAM, limited disk space, and a lack of an easy and secure way to run self-hosted runners.

Fast forward today, and we have already run around 140k Firecracker VMs for customers. We see a mix of 64-Arm servers and fast bare-metal `x86_64` servers for CI, with both closed and open-source repositories being used.

The main benefits are having access to bigger, faster and more specialist hardware.

* For `x86_64` builds, we see about a 3x speed-up vs. using GitHub's hosted runners, in addition to being able to add more RAM and disk space to builds.
* For Arm64, we see builds which take several hours or which fail to complete within a 6 hour window using QEMU, go down to 3-5 minutes.

Vendors and consumers are becoming increasingly aware of the importance of the supply chain, [GitHub's self-hosted runner is not recommended for open source rpos](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions). Why? Due to the way side-effects can be left over between builds. Actuated uses a fresh, immutable, Firecracker VM for every build which boots up in less than 1 second and is destroyed after the build completes, which removes this risk.

[Ellie Huxtable](https://www.linkedin.com/in/ellmh) is the maintainer of [Atuin](https://atuin.sh/), a popular open-source tool to sync, search and backup shell history. Her Rust build for the CLI took 90 minutes with QEMU, but was reduced to just 3 minutes with actuated, and a native Arm server.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Thanks to <a href="https://twitter.com/selfactuated?ref_src=twsrc%5Etfw">@selfactuated</a>, Atuin now has very speedy ARM docker builds in our GitHub actions! Thank you <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> 🙏<br><br>Docker builds on QEMU: nearly 90 mins<br>Docker builds on ARM with Actuated: ~3 mins</p>&mdash; Ellie Huxtable (@ellie_huxtable) <a href="https://twitter.com/ellie_huxtable/status/1715261549172936776?ref_src=twsrc%5Etfw">October 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

For Fluent Bit, one of their Arm builds was taking over 6 hours, which meant it always failed with a timed-out on a hosted runner. [Patrick Stephens](https://www.linkedin.com/in/patrickjkstephens/?originalSubdomain=uk), Tech Lead of Infrastructure at Calyptia reached out to work with us. We got the time down to 5 minutes by changing `runs-on: ubuntu-latest` to `runs-on: actuated-arm64`.

Patrick shares about the experience on the Calyptia blog, including the benefits to their `x86_64` builds for the commercial Calyptia product: [Scaling ARM builds with Actuated](https://calyptia.com/blog/scaling-builds-with-actuated).

## Announcing managed Arm CI for CNCF projects

At KubeCon EU, I spoke to [Chris Aniszczyk](https://www.linkedin.com/in/caniszczyk/), CTO at the CNCF, and told him about some of the results we'd been seeing with customers and for Fluent Bit, which is a CNCF project. Chris told me that many teams were either putting off Arm support all together, were suffering with the slow builds that come from using QEMU, or were managing their own infrastructure which was underutilized.

[Equinix](https://deploy.equinix.com/) provides a generous amount of credits to the CNCF under [CNCF Community Infrastructure Lab (CIL)](https://github.com/cncf/cluster), including access to powerful Ampere Q80 Arm servers ([c3.large.arm64](https://deploy.equinix.com/product/servers/c3-large-arm64/)), that may at times be required by Equinix customers for their own Arm workloads.

As you can imagine, over time, different projects have deployed 1-3 of their own runner servers, each with 256GB of RAM and 80 Cores, which remain idle most of the time, and are not available to other projects or Equinix customers when they may need them suddenly. So, if actuated can reduce this number, whilst also improving the experience for maintainers, then that's a win-win.

Around the same time as speaking to Chris, Ampere reached out and asked how they could help secure actuated for a number of CNCF projects.

Together, Ampere and the CNCF are now sponsoring an initial 1-year pilot of managed Arm CI provided by actuated, for CNCF projects, with the view to expand it, if the pilot is a success.

[Ed Vielmetti](https://www.linkedin.com/in/edwardvielmetti/), Developer Partner Manager at Equinix said:

> I'm really happy to see this all come together. If all goes according to plan, we'll have better runner isolation, faster builds, and a smaller overall machine footprint.

[Dave Neary](https://www.linkedin.com/in/dneary/), Director of Developer Relations at Ampere Computing added:

> It's a faster, more secure way to run Arm builds, and will also more efficiently use the servers that Equinix is making available to the CNCF as part of its open source program credits.

## What are maintainers saying?

A number of maintainers and community leaders have come forward with project suggestions, and we're starting to work through them, with the first two being Fluent Bit and etcd.

[Fluent Bit](https://fluentbit.io/):

> "Fluent Bit is a super fast, lightweight, and highly scalable logging and metrics processor and forwarder. It is the preferred choice for cloud and containerized environments."

[etcd](https://etcd.io) is a core component of almost every Kubernetes installation and is responsible for storing the state of the cluster.

> "A distributed, reliable key-value store for the most critical data of a distributed system"

In the case of etcd, there were [two servers being maintained by five individual maintainers](https://github.com/etcd-io/etcd/pull/16801/files#diff-b8f5f4d0db4fb959d72d74463e2fd2637feb69f6b9e1dce61ad47ee031806dbd), all of that work goes away by adopting actuated.

We even sent etcd [a minimal Pull Request](https://github.com/etcd-io/etcd/pull/16801) to make the process smoother.

[James Blair, Specialist Solution Architect at Red Hat](https://github.com/jmhbnz), commented:

> I believe managed on demand arm64 CI hosts will definitely be a big win for the project. Keen to trial this.

Another maintainer also commented that they will [no longer need to worry about "leaky containers"](https://github.com/etcd-io/etcd/pull/16801#issuecomment-1774024719).

## How do we get access?

If you are working on a CNCF project and would like access, [please contact us via this form](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform). If your project gets selected for the pilot, there are a couple of things you may need to do.

1. If you are already using the GitHub Actions runner hosted on Equinix, then change the `runs-on: self-hosted` label to: `runs-on: actuated-arm64-8cpu-16gb`. Then after you've seen a build or two pass, delete the old runner.
2. If you are using QEMU, the best next step is to "split" the build into two jobs which can run on `x86_64` and `arm64` natively, that's what Ellie did and it only took her a few minutes.

The label for `runs-on:` allows for dynamic configuration of vCPU and GBs of RAM, just edit the label to match your needs, for etcd, the team asked for 8vCPU and 32GB of RAM, so they used `runs-on: actuated-arm64-8cpu-32gb`.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I had to split the docker build so that the ARM half would build on ARM, and x86 on x86, and then a step to combine the two - overall this works out to be a very significant improvement<a href="https://t.co/69cIxjYRcW">https://t.co/69cIxjYRcW</a></p>&mdash; Ellie Huxtable (@ellie_huxtable) <a href="https://twitter.com/ellie_huxtable/status/1715266936592904446?ref_src=twsrc%5Etfw">October 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

We have full instructions for 2, in the following tutorial: [How to split up multi-arch Docker builds to run natively](https://actuated.dev/blog/how-to-run-multi-arch-builds-natively).

## Learn more about actuated

We're initially offering access to managed Arm CI for CNCF projects, but if you're working for a company that is experiencing friction with CI, [please reach out to us to talk](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform).

* Read one of our [recent blog posts](https://actuated.dev/blog)
* Learn more about [actuated in the docs](https://docs.actuated.dev)
* [Read what our customers are saying about our service](https://actuated.dev)

> Did you know? [Actuated for GitLab CI is now in technical preview, watch a demo here](https://actuated.dev/blog/secure-microvm-ci-gitlab).

---
title: We're now actuated.com
description: We take a look back to our launch in November 2022, what we've learned since and what's next for actuated.com.
tags:
- announcement
- review
- microvms
author_img: alex
image: /images/2024-08-dotcom/background.png
date: "2024-08-06"
---

Over two years ago we registered the actuated.dev domain with the intention to fix various issues with self-hosted CI runners for GitHub Actions using microVMs.

It's been a long journey and microVMs are not for the feint of heart, and we've spent a significant amount of time building a scheduler, agent, Kernel, root-filesystem, dashboard and reporting to make it work well for CI workloads. microVMs remain a poorly documented and hard to use technology, so whilst basic things can be made [to work in a short period of time](/blog/actuated-for-gitlab), the most important workings have to be understood only through trial & error and experience.

I'll set out what we wanted to address in November 2022, the direction customer feedback has taken us, and what we're planning next.

## What we set out to address

Looking back, we've addressed [all the original concerns](/blog/blazing-fast-ci-with-microvms), and covered new areas too:

* Every build job runs in an isolated microVM

Why is this important? Unlike the standard self-hosted runner available from GitHub, an isolated microVM means that there can never be side effects left over between builds. One of the first problems we ran into with self-hosted runners prior to creating actuated, was side effects build up in surprising ways and causing flaky builds, and frustrating errors.

* Docker without the security concerns

When a self-hosted runner executes inside a container, then makes use of Docker, it usually involves mounting a socket from the host, running as a privileged container, or running as root. In each case, it's trivial to escape the container and gain full administrative access to the host. So if you're running Actions Runtime Controller (ARC) or GitLab CI's Kubernetes operator and make use of Docker in any way, beware. Not only can a supply chain attack steal credentials, exfiltrate data & code, run cryptominers, but it can also escape the container and gain full control of the host and possibly the Kubernetes cluster and wider network.

Some teams believe that having a "separate Kubernetes cluster for CI" solves these problems. It does not, it makes it harder to recognise when the CI system has been compromised, and since these will often run in the same cloud account, may make it possible to escalate privileges to the wider network.

* VMs without the boot-up time

Actuated microVMs are finely tuned, so that even with a fully isolated Docker daemon running, the system is ready within 1s and connecting to GitHub's control-plane. If you've ever used an autoscaling group on AWS ECS, you're probably more used to a 3-5 minute boot-up for a new VM.

* Feels like managed, but is still self-hosted

With actuated, we operate a managed control-plane, which means you don't have to think about GitHub Apps, bot accounts, rate-limits, what to do when GitHub has an outage. The control-plane receives notifications from your GitHub repositories, but has no access to the code or secrets. Only the GitHub runner software itself can checkout code and run jobs using GitHub's fine-grained security mechanisms, the same ones used for managed runners.

So what do you have to manage? You'll need to rent or provision a server with KVM (nested, or hardware) and then follow our guide to install the actuated agent, or install our SSH key and we'll use an automated process to do it for you. After that, you can manage your runners and build-queue via the [dashboard](https://docs.actuated.com/dashboard/) and we'll monitor your servers via our central Grafana dashboard.

* Automated - Over The Air (OTA) updates

Our own CI system builds both the actuated agent, and the root filesystem used for CI builds for GitHub Actions and GitLab CI on an automated basis. These are pushed out over the network to agents, so you never have to worry about updating the self-hosted runner, or the software within the VM image.

See also: [Scaling ARM builds with Actuated](https://calyptia.com/blog/scaling-builds-with-actuated)

## Predictable flat-rate pricing, with new burst pricing

The [pricing for actuated](/pricing) was designed to be predictable and reasonable. If you run 100 builds or 1 million builds, you'll get charged the same amount, with concurrency being limited to whatever you decided fits your needs.

For teams with a large amount of minutes, or larger runners than the "standard" tier of GitHub Actions, this can result in a 2-6x cost reduction.

Even with flat-rate pricing, and a stable concurrency level of say 5 or 10 concurrent builds, there will be times where you need to cut a release, and want many jobs to run at once.

For those times, we listened to your feedback and introduced burst pricing. You can opt-in to add extra concurrent builds to your account, which are only used if there are queued jobs for a set period of time. 

Pay only when needed: Let's say you hit your limit often, but are happy with some queueing. You can add an extra burst of 20 builds, but a queue time of 10 minutes. Then your extra concurrency will not get used until there have been jobs waiting for 10 minutes.

Clear the queue as quickly as possible: You could have a base limit of 20 builds, but a burst of up to 100 builds. You'll only get charged for what you go over on a particular day, and only if you go over your base limit. If you stay within 20 concurrent builds, you'll pay nothing extra.

See also: [Burst billing and capacity for GitHub Actions](/blog/burst-billing-capacity)

## Server pricing & white-glove service

Today, most of our customers use pay per minute bare-metal hosted by a cloud provider. But our first pilot customer was a mid-sized start-up who loved to run their own servers, maintain their own infrastructure. They bought Dell servers from eBay, packaged them with new hardware, then had a team of 5 engineers on standby to refurbish and manage them. 

Over time, we started to meet teams who wanted to outsource the server installation, maintenance, and monitoring to someone else. This makes actuated feel even more like managed runners, whilst keeping the benefits of self-hosted infrastructure. We're able to offer this as part of your subscription, because [once we've run the installation of the agent](https://docs.actuated.com/install-agent/), there is rarely a reason to log into the host again. In the rare event of a catastrophic failure, we can have the server OS image flashed and the agent reinstalled within a few minutes.

> For our compute intensive application, with testing taking 30-45 minutes, every second counts. Actuated has helped us keep our development speed up by making sure we ran on fast bare-metal servers and by helping us find bottle necks in the testing process. We were able to drop our testing time by 50% whilst saving 3-6x per month versus similar hosted GitHub Actions minutes.
> 
> Justin Gray, CTO at Toolpath

One of the downsides to using a technology like [Firecracker](https://firecracker-microvm.github.io/) is that it requires [KVM](https://linux-kvm.org/page/Main_Page) or nested virtualisation to be available on the server. If you're using AWS already, you'll be disappointed to learn that their bare-metal hardware is not only overpriced, but it isn't suited to CI workload which require a fast processor and storage.

[We put together a list of servers that we recommend](https://docs.actuated.com/provision-server/) and the rough costing for them, but to make it simple, you cannot beat Hetzner. Most of our customers rent bare-metal from them and we've been very pleased with the value for money and sheer performance.

* Docs: [Provision a server](https://docs.actuated.com/provision-server/)

## Content & education

There are several unresolved problems with using self-hosted runners, not to mention the security issues. We've been working on a series of blog posts to help educate teams on how to get the most out of their self-hosted runners.

* Running a local cache to reduce latency [Testing the impact of a local cache for building Discourse](/blog/local-caching-for-github-actions)
* Keeping costs down, and servers utilised with our metering tool [Right sizing VMs for GitHub Actions](/blog/right-sizing-vms-github-actions)
* Safely launch VMs and different OSes - [How to run KVM guests in your GitHub Actions](/blog/kvm-in-github-actions)
* GitHub pays Docker.com for unlimited Docker Hub pull keys, here's how to solve the problem for self-hosted runners: [Set up a registry mirror](https://docs.actuated.com/tasks/registry-mirror/)

Along with the [VM usage metering tool](/blog/right-sizing-vms-github-actions), I mentioned earlier, which you can use on both managed and self-hosted runners, we created a free open source tool called [self-actuated/actions-usage](https://github.com/self-actuated/actions-usage). You can use it to generate a report of your personal account's usage, or your organisation's usage over a period of time, you can even run it on a schedule as a GitHub Action. Customers have reports backed by a database, which can run queried on varying time periods and filter by repository, user, or organisation: [actuated dashboard](https://docs.actuated.com/dashboard/)

## Artificial Intelligence (AI), Machine Learning (ML) and GPUs

We started to see customer interest in AI and ML workloads for GitHub Actions and GitLab CI, but found that Firecracker could not support PCI devices such as GPUs. After spending time on R&D, we added support for [cloud-hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor) which has slightly different goals than Firecracker. Rather than focusing purely on serverless workloads, it adds support for PCI devices and is even able to run other Operating Systems than Linux.

* [Accelerate GitHub Actions with dedicated GPUs](https://actuated.com/blog/gpus-for-github-actions)
* [Run AI models with ollama in CI with GitHub Actions](https://actuated.com/blog/ollama-in-github-actions)

## Sponsored CI minutes for the Cloud Native Computing Foundation (CNCF)

The [CNCF and Ampere Computing](https://actuated.com/blog/cncf-arm-march-update) joined together to sponsor CI minutes for top-tier open source projects such as containerd, runc, Open Telemetry, CRI-O, ArgoCD, Falco, eBPF and various others. In May this year we'd already run over 1.5 million CI minutes for these projects, and we're proud to be able to support the open source community in this way.

* [On Running Millions of Arm CI Minutes for the CNCF](https://actuated.com/blog/millions-of-cncf-minutes)
* [Is the GitHub Actions self-hosted runner safe for Open Source?](https://actuated.com/blog/is-the-self-hosted-runner-safe-github-actions)

> Ampere is delighted to partner with Actuated and the CNCF on their ambitions of improving the state of Aarch64 software. The combination of Actuated's tools and methods for managed CI and Ampere's cloud native processors for fast and secure builds makes for a tremendous advantage to accelerate the availability of cloud native software for the Aarch64 ecosystem.
> 
> Pete Baker, VP Customer & Developer Engineering

## What's next?

If you can relate to anything we've covered here on costs, performance, security, or something else, [please feel free to reach out to talk to us](https://actuated.com/pricing). We can tell you in a short period of time whether actuated would be a good fit for your team, and what results other teams like yours may have seen already. Plans run month to month, so it's relatively low risk to try actuated out on a couple of repositories to see how you like it.

Are you a GitLab CI user?

We have just published new updates for actuated for self-hosted GitLab and are [looking for pilot customers](https://actuated.com/blog/actuated-for-gitlab). Many of the same security and management issues exist whether you're using GitHub Actions or GitLab CI, so we're excited to bring the same level of security and performance to GitLab CI.

Additional resources:

* [Actuated FAQ](https://docs.actuated.com/faq/)
* [Actuated roadmap](https://docs.actuated.com/roadmap/)
* [Lessons learned managing GitHub Actions and Firecracker](/blog/managing-github-actions)

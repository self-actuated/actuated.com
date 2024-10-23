---
title: On Running Millions of Arm CI Minutes for the CNCF
description: We've now run over 1.5 million minutes of CI time for various CNCF projects on Ampere hardware. Here's what we've learned.
tags:
- cncf
- enablement
- arm
rollup: true
author_img: alex
image: /images/2024-05-cncf-millions/background.png
date: "2024-05-30"
---

In this post I'll cover:

* Who's the program to bring actuated to the CNCF
* A new video interview with our team, the CNCF, Ampere and Equinix Metal
* What options teams had for Arm both and then after the program
* The high level numbers, and how that's split over the top 9 projects
* What's next for the program

### What's Actuated?

> Actuated is the only solution that gives a managed experience for self-hosted runners, on your own hardware through immutable microVMs.

The immutability is key to both security and reliability. Each build is run in its own ephemeral and immutable microVM, meaning side effects cannot be left behind by prior builds. In addition, our team manages reliability for your servers and the integration with GitHub, for minimal disruption during GitHub outages.

## Why did the CNCF want Actuated for its projects? 

We've been working with [Ampere](https://amperecomputing.com/) and [Equinix Metal](https://deploy.equinix.com/) to provide CI via GitHub Actions for Cloud Native Computing (CNCF) projects. Ampere manufacture Arm-based CPUs with a focus on efficiency and high core density. Equinix Metal provide access to the Ampere Altra in their datacenters around the world.

Last December, we met with [Chris Aniszczyck](https://www.linkedin.com/in/caniszczyk/) - CTO Linux Foundation/CNCF, [Ed Vielmetti](https://www.linkedin.com/in/edwardvielmetti/) - Open Source Manager Equinix, [Dave Neary](https://www.linkedin.com/in/dneary/) - Director of Developer Relations at Ampere and myself to discuss the program and what impact it was having so far.

Watch the recap on YouTube: [The Ampere Developer Impact: CNCF Pilot Discussion](https://www.youtube.com/watch?v=sv3jtSvW9gk)

Past articles on the blog include:

* October 2023 launch - [Announcing managed Arm CI for CNCF projects](/blog/arm-ci-cncf-ampere)
* March 2024 update - [The state of Arm CI for the CNCF](/blog/cncf-arm-march-update)

## Before and after the program

Before we started the program, CNCF projects could be divided into three buckets:

1. They were running Arm-based CI jobs on static servers that they managed

In this case, etcd for instance had a team of half a dozen maintainers who were responsible for setting up, maintaining, and upgrading statically provisioned CI servers for the project. This was a significant overhead for the project maintainers, and the servers were often underutilized. The risk of side-effects being left behind between builds also posed a serious supply chain risk since etcd is consumed in virtually every Kubernetes deployment.

2. They were running Arm-based CI using emulation (QEMU)

QEMU can be combined with Docker's buildx for a quick and convenient way to build container images for x86 and Arm architectures. In the best case, it's a small change and may add a few minutes of extra overhead. In the worst case, we saw that jobs that ran in ~ 5 minutes, took over 6 hours to complete using QEMU and hosted runners. A prime example was fluentd, read their case-study here: [Scaling ARM builds with Actuated](https://calyptia.com/blog/scaling-builds-with-actuated)

3. They had no Arm CI at all

In the third case, we saw projects like OpenTelemetry which had no support for Arm at all, but demand from their community to bring it up to on par with x86 builds. The need to self-manage insecure CI servers meant that Arm was a blocker for them.

### After the program

After the program was live, teams who had been maintaining their own servers got to remove lengthy documentation on server configuration and maintenance, and relied on our team to manage a pool of servers used for scheduling microVMs.

As demand grew, we saw OpenTelemetry and etcd starve the shared pool of resources through very high usage patterns. This is a classic and known problem called "Tragedy of the Commons" - when a shared resource is overused by a subset of users, it can lead to a degradation of service for all users. To combat the problem, we added code to provision self-destructing servers for a period of 24-48 hours as need arose, and prevented the higher usage projects from running on at least on of the permanent servers through scheduling rules. One other issue we saw with OpenTelemetry in particular was that the various Go proxies that offer up Go modules appeared to be rejecting requests when too many jobs were running concurrently. As a workaround, we added a private Go proxy for them into the private network space where the CNCF servers run, this also massively reduced the bandwidth costs for the shared infrastructure.

[Teams like fluent](https://calyptia.com/blog/scaling-builds-with-actuated) moved from flakey builds that couldn't finish in 6 hours, to builds that finished in 5-10 minutes. This meant they could expand on their suite of tests.

Where teams such as Cilium, Falco, or OpenTelemetry had no Arm CI support, we saw them quickly ramp up to running thousands of builds per month.

Here's a quote from [Federico Di Pierro](https://www.linkedin.com/in/fededp/), Senior Open Source Engineer @ Sysdig and maintainer of Falco:

> Falco really needed arm64 GitHub runners to elevate its support for the architecture and enlarge its userbase.
Actuated was the perfect solution for us because it was easy to leverage and relieved any burden for the maintainers. This way, we as maintainers, can focus on what really matters for the project, instead of fighting with maintaining and deploying self-hosted infrastructure.
> Now we are building, testing and releasing artifacts for arm64 leveraging Actuated for many of our projects, and it works flawlessly.
> Support from Alex's team is always on point, and new kernel features are coming through super quickly!

[Akihiro Suda](https://github.com/akihirosuda), Software Engineer at NTT Corp, and maintainer of several open source projects including: runc, containerd and lima had this to say:

> Huge thanks to Actuated for enabling us to run ARM64 tests without any mess.
> It is very important for the runc project to run the tests on ARM64, as runc depends on several architecture-dependent components such as seccomp and criu.
> It is also so nice that the Arm instance specification can be adjusted in a single line in the GitHub Actions workflow file.

[Wei Fu](https://github.com/fuweid), a maintainer for containerd said:

> The containerd project was able to test each pull request for the Linux arm64 platform with the support of Actuated. 
> It's a significant step for containerd to mark the Linux arm64 platform as a top-tier supported platform, similar to amd64, since containerd has been widely used in the Arm world.
> 
> Thanks to Actuated, we, the containerd community, were able to test container features (like mount-idmapping) on the new kernel without significant maintenance overhead for the test infrastructure. 
> With Actuated, we can focus on open-source deployment to cover more use case scenarios.

Maintainers have direct access to discuss issues and improvements with us via a private Slack community. One of the things we've done in addition to adding burst capacity to the pool, was [to provide a tool to help teams right-size VMs for jobs](/blog/right-sizing-vms-github-actions) and to add support for [eBPF technologies like BTF](/blog/custom-sizes-bpf-kvm) in the Kernel.

### Numbers at a glance

In our last update, 3 months ago, we'd run just under 400k build minutes for the CNCF. That number has now increased to 1.52M minutes, which is a ~ 300x increase in demand in a short period of time.

Here's a breakdown of the top 9 projects by total minutes run, bearing in mind that this only includes jobs that ran to completion, there are thousands of minutes which ran, but were cancelled mid-way or by automation.

Rank | Organisation   | Total mins   | Total Jobs | First job
-----|----------------|--------------|------------|-----------
1    | open-telemetry |       593726 |      40093 | 2024-02-15
2    | etcd-io        |       372080 |      21347 | 2023-10-24
3    | cri-o          |       163927 |      11131 | 2023-11-27
4    | falcosecurity  |       138469 |      13274 | 2023-12-06
5    | fluent         |        89856 |      10658 | 2023-06-07
6    | containerd     |        87007 |      11192 | 2023-12-02
7    | cilium         |        73406 |       6252 | 2023-10-31
8    | opencontainers |         3716 |        458 | 2023-12-15
9    | argoproj       |          187 |         12 | 2024-01-30
(all) | (Total)       |      1520464 |     116217 |

Most organisations build for several projects or repositories. In the case of etcd, the numbers also include the boltdb project, and for cilium, tetragon, and the Go bindings for ebpf are also included. Open Telemetry is mainly focused around the [collectors and SDKs](https://github.com/open-telemetry/opentelemetry-collector-contrib).

runc which is within the opencontainers organisation is technically an Open Container Initiative (OCI) project under the LinuxFoundation, rather than a CNCF project, but we gave them access since it is a key dependency for containerd and cri-o.

## What's next?

With the exception of Argo, all of the projects are now relatively heavy users of the platform, with demand growing month on month, as you can see from the uptick from 389k minutes in March to a record high of 1.52 million minutes by the end of May of the same year. In the case of Argo, if you're a contributor or have done previous open source enablement, perhaps you could help them expand their Arm support via a series of [Pull Requests to enable unit/e2e tests to run on Arm64](https://github.com/argoproj/argo-cd/issues/9012)?

We're continuing to improve the platform to support users during peak demand, outages on GitHub, and to provide a reliable way for CNCF projects to run their CI on real Arm hardware, at full speed.

For instance, last month we just released a new 6.1 Kernel for the Ampere Altra, which means projects like Cilium and Falco can make use of new eBPF features introduced in recent Kernel versions, and will bring support for newer Kernels as the Firecracker team make them available. The runc and container teams also benefit from the newer Kernel and have been able to enable further tests for (Checkpoint/Restore In Userspace) CRIU and User namespaces for containerd.

You can watch the interview I mentioned earlier with Chris, Ed, Dave and myself on YouTube:

<iframe width="560" height="315" src="https://www.youtube.com/embed/sv3jtSvW9gk?si=2PVUFCx_QUt65v5-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### We could help you too

Actuated can manage x86 and Arm64 servers for GitHub Actions and [self-managed GitLab CI](/blog/secure-microvm-ci-gitlab). If you'd like to speak to us about how we can speed up your jobs, reduce your maintenance efforts and lower your CI costs, [reach out via this page](https://actuated.com/pricing/).

---
title: Secure CI for GitLab with Firecracker microVMs
description: Learn how actuated for GitLab CI can help you secure your CI/CD pipelines with Firecracker.
tags:
- security
- gitlab
author_img: alex
date: "2023-06-16"
image: "/images/2023-06-gitlab-preview/background.png"
---

We started building actuated for GitHub Actions because we at OpenFaaS Ltd had a need for: unmetered CI minutes, faster & more powerful x86 machines, native Arm builds and low maintenance CI builds.

And most importantly, we needed it to be low-maintenance, and securely isolated. 

None of the solutions at the time could satisfy all of those requirements, and even today with GitHub adopting the community-based Kubernetes controller to run CI in Pods, there is still a lot lacking.

As we've gained more experience with customers who largely had the same needs as we did for GitHub Actions, we started to hear more and more from GitLab CI users. From large enterprise companies who are concerned about the security risks of running CI with privileged Docker containers, Docker socket binding (from the host!) or the flakey nature and slow speed of VFS with Docker In Docker (DIND).

> The [GitLab docs have a stark warning](https://docs.gitlab.com/runner/security/) about using both of these approaches. It was no surprise that when a consultant at Thoughtworks reached out to me, he listed off the pain points and concerns that we'd set out to solve for GitHub Actions.

So with growing interest from customers, we built a solution for GitLab CI - just like we did for GitHub Actions. We're excited to share it with you today in tech preview.

![actuated for GitLab CI](/images/2023-06-gitlab-preview/conceptual.png)

For every build that requires a runner, we will schedule and boot a complete system with Firecracker using Linux KVM for secure isolation. After the job is completed, the VM will be destroyed and removed from the GitLab instance.

If you'd like to use it or find out more, please apply here: [Sign-up for the Actuated pilot](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform)

## Secure CI with Firecracker microVMs

[Firecracker](https://github.com/firecracker-microvm/firecracker) is the open-source technology that provides isolation between tenants on certain AWS products like Lambda and Fargate. There's a growing number of cloud native solutions evolving around Firecracker, and we believe that it's the only way to run CI/CD securely.

Firecracker is a virtual machine monitor (VMM) that uses the Linux Kernel-based Virtual Machine (KVM) to create and manage microVMs. It's lightweight, fast, and most importantly, provides proper isolation, which anything based upon Docker cannot.

There are no horrible Kernel tricks or workarounds to be able to use user namespaces, no need to change your tooling from what developers love - Docker, to Kaninko or Buildah or similar.

You'll get `sudo`, plus a fresh Docker engine in every VM, booted up with systemd, so things like Kubernetes work out of the box, if you need them for end to end testing (as so many of us do these days).

You can learn the differences between VMs, containers and microVMs like Firecracker in my video from Cloud Native Rejekts at KubeCon Amsterdam:

<iframe width="560" height="315" src="https://www.youtube.com/embed/pTQ_jVYhAoc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Many people have also told me that they learned how to use Firecracker from my webinar last year with Richard Case: [A cracking time: Exploring Firecracker & MicroVMs](https://www.youtube.com/watch?v=CYCsa5e2vqg).

## Let's see it then

Here's a video demo of the tech preview we have available for customers today.

<iframe width="560" height="315" src="https://www.youtube.com/embed/PybSPduDT6s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

You'll see that when I create a commit in our self-hosted copy of GitLab Enterprise, within 1 second a microVM is booting up and running the CI job.

Shortly after that the VM is destroyed which means there are absolutely no side-effects or any chance of leakage between jobs.

Here's a later demo of three jobs within a single pipeline, all set to run in parallel.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here&#39;s 3x <a href="https://twitter.com/gitlab?ref_src=twsrc%5Etfw">@GitLab</a> CI jobs running in parallel within the same Pipeline demoed by <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> <br><br>All in their own ephemeral VM powered by Firecracker 🔥<a href="https://twitter.com/hashtag/cicd?src=hash&amp;ref_src=twsrc%5Etfw">#cicd</a> <a href="https://twitter.com/hashtag/secure?src=hash&amp;ref_src=twsrc%5Etfw">#secure</a> <a href="https://twitter.com/hashtag/isolation?src=hash&amp;ref_src=twsrc%5Etfw">#isolation</a> <a href="https://twitter.com/hashtag/microvm?src=hash&amp;ref_src=twsrc%5Etfw">#microvm</a> <a href="https://twitter.com/hashtag/baremetal?src=hash&amp;ref_src=twsrc%5Etfw">#baremetal</a> <a href="https://t.co/fe5HaxMsGB">pic.twitter.com/fe5HaxMsGB</a></p>&mdash; actuated (@selfactuated) <a href="https://twitter.com/selfactuated/status/1668575246952136704?ref_src=twsrc%5Etfw">June 13, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Everything's completed before I have a chance to even open the logs in the UI of GitLab.

## Wrapping up

With actuated for GitLab, we're bringing:

* 🚀 Faster x86 builds
* 🚀 Secure isolation with Firecracker microVMs
* 🚀 Native Arm builds that can actually finish
* 🚀 Fixed-costs & less management
* 🚀 Insights into CI usage across your organisation

Runners are registered and running a job in a dedicated VM within less than one second. Our scheduler can pack in jobs across a fleet of servers, [they just need to have KVM available](https://docs.actuated.dev/provision-server/).

If you think your automation for runners could be improved, or work with customers who need faster builds, better isolation or Arm support, get in touch with us.

* [Sign-up for the Actuated pilot](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform)
* [Browse the docs and FAQ for actuated for GitHub Actions](https://docs.actuated.dev/)
* [Read customer testimonials](https://actuated.dev/)

You can follow [@selfactuated](https://twitter.com/selfactuated) on Twitter, or find [me there too](https://twitter.com/alexellisuk) to keep an eye on what we're building.

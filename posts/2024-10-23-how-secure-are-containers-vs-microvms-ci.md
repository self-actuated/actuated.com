---
title: How secure are containers & Kubernetes vs. microVMs for self-hosted CI?
description: How secure are your self-hosted CI runners? We compare running CI jobs on VMs, containers, and Kubernetes versus one-shot, ephemeral microVMs.
tags:
- security
- containers
- gitlab
- kubernetes
- multiarch
author_img: alex
image: /images/2024-10-containers-vs-microvms/background.png
date: "2024-10-23"
---

> You've landed here because you're looking for a secure way to run self-hosted CI runners. Our solution isolates CI jobs in one-shot, ephemeral microVMs, but you might be wondering: Why microVMs? Why not just install a self-hosted runner on a VM or use Kubernetes?

These are valid questions. If you've never considered the security implications of these setups, take a moment to see why microVMs offer a secure alternative.

As of today, we've processed 4.4 million minutes of CI jobs for commercial and [open-source CNCF projects](/blog/millions-of-cncf-minutes), all running in securely isolated microVMs that boot in under a second and are destroyed immediately after the job completes. Some customers use a pool of servers that we manage as part of the subscription, and others have their own dedicated bare-metal hardware rented from [cloud providers like Hetzner or Equinix](https://docs.actuated.com/provision-server/).

This article will walk you through the risks of common self-hosted CI solutions and why microVMs are the safest choice.

* What does GitHub have to say about self-hosted runner security?
* The side effects of an uncontained self-hosted runner
* Kubernetes and Docker are secure and ephemeral right?
* So what's the alternative?
* Wrapping up & further resources

It's not the first time I've spoken on this topic, you'll find a recording from a conference talk I gave, and a link to the [original announcement](https://actuated.com/blog/blazing-fast-ci-with-microvms) over two years ago.

## What does GitHub have to say about self-hosted runner security?

According to [Self-hosted runner security](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security):

> We recommend that you only use self-hosted runners with private repositories. This is because forks of your public repository can potentially run dangerous code on your self-hosted runner machine by creating a pull request that executes the code in a workflow.

> This is not an issue with GitHub-hosted runners because each GitHub-hosted runner is always a clean isolated virtual machine, and it is destroyed at the end of the job execution.

> Untrusted workflows running on your self-hosted runner pose significant security risks for your machine and network environment, especially if your machine persists its environment between jobs. Some of the risks include:

* Malicious programs running on the machine.
* Escaping the machine's runner sandbox.
* Exposing access to the machine's network environment.
* Persisting unwanted or dangerous data on the machine.

## The side effects of an uncontained self-hosted runner

My earliest memory of the self-hosted runner went a little bit like this.

* OK that was easy, what is everyone complaining about?
* *Runs my first job* - oh that apt package is missing, let me install it..
* *Goes red again* - oh yeah, better add that too
* And that one
* 50 minutes into the build and something else is missing 🤦‍♂️

Just installing all the dependencies into your VM that are in the hosted runner, to get some semblance of parity is an arduous task and an ever moving target.

Next, you create a KinD cluster and it goes well for the first run.

The same job that passes on a hosted runner now fails because the KinD cluster is still in place from the previous run:

```
% kind create cluster --name e2e
ERROR: failed to create cluster: node(s) already exist for a cluster with the name "e2e"
```

So you create a random name for the KinD cluster. Genius! 👩‍🔬

But now your Docker library is full of orphaned KinD clusters and you run out of disk space.

I could go on, but I won't.

Not to mention, this self-hosted runner can only run on job at a time, so you're wasting a lot resources.

When it crashes, you have to duplicate all the work you did to get it running, on another machine.

And you have zero security, no form of isolation, and any job that runs, whether done with malice, or misguided good intent, or an accident can leave the environment compromised.

## Kubernetes and Docker are secure and ephemeral right?

Docker is great, Kubernetes is a solid platform, however neither are suited to running CI workloads.

You cannot build, then load an eBPF module into a Kernel using a self-hosted runner in a container.

You cannot safely:

* run Kubernetes itself in a Kubernetes Pod
* build a container image 
* run a container image you've built.

In order to do these things, you have to install Docker into your container/Pod, and start it up. Docker is a daemon that runs as root, and requires host-level privileges in order to do its work.

There are two ways Actions Runtime Controller and GitLab's Kubernetes Controller go about this:

1. Mounting a Docker Socket.

    Docker has to be running on the host for the container or Pod. You expose the socket via a bind-mount into the container.

    Any CI job that runs can take over the host, and worse, can probably make privileged calls into the Kubernetes cluster, and exfiltrate any secrets such as cloud access keys.

2. Running as a Privileged container

    When you run a Pod as a Privileged container, a separate Docker Daemon starts up. It does not share the daemon with the host, however it gives a false sense of security.

    Whilst you now have two docker daemons running, the one running within in your container has to use Virtual Filesystem (VFS) - a slow, and expensive emulated filesystem that is required to support Docker inside Docker.

    The Pod itself has a privileged runtime profile, which means: it has unrestricted access to the host's resources, including the ability to manipulate kernel modules, access devices, and interact with sensitive system-level functions. Running with these elevated privileges opens up significant security risks:

    * Host Compromise: Since the container has broad access to the underlying host, it could potentially manipulate the host’s configuration, modify system files, or install malicious software.
    * Kernel Exploits: If there are any vulnerabilities in the host kernel, a privileged container could exploit them to gain root access to the host.
    * Device Access: Privileged containers can interact with devices on the host, such as block devices, USB devices, or network interfaces. This can lead to unauthorized access or data leakage.
    * Increased Attack Surface: Privileged containers can perform actions that are generally prohibited in standard containers, such as changing sysctl parameters or configuring iptables rules, which expands the attack surface.

In short, Kubernetes and Docker are not secure for running CI workloads that require anything beyond basic user-space tasks. They lack the isolation and security needed for complex, multi-tenant CI environments.

## So what's the alternative?

GitHub emphasizes that their hosted runners run in ephemeral, isolated virtual machines. But when you're managing your own runners on VMs or in Kubernetes, the environment is anything but ephemeral. Jobs can persist malicious code, leak secrets, and compromise the entire system.

> GitHub-hosted runners execute code within ephemeral and clean isolated virtual machines, meaning there is no way to persistently compromise this environment, or otherwise gain access to more information than was placed in this environment during the bootstrap process.

> Self-hosted runners for GitHub do not have guarantees around running in ephemeral clean virtual machines, and can be persistently compromised by untrusted code in a workflow.

Some people will start to look for how to run Docker without a Privileged Pod, without a Docker Socket Mount, without root, but all these solutions tend to be half-baked, and still involve using root somewhere along the line. User namespaces have come up a number of times, but are not compatible with every kind of Kernel, and user workload.

There’s no simple workaround here. Tools like Kaniko, Buildah, and BuildKit do exist, but they introduce complexity and, at some point, often require root access or privileged operations—just not where you might expect it. Linux User namespaces were meant to address these issues, but they come with their own set of challenges, like compatibility with certain workloads and kernels, and they aren’t a universal solution.

Each of these tools focuses primarily on building containers, not running them in a secure way. When you need to run Kubernetes, K3s, or even Docker within a CI job, you're effectively back at square one. These tools try to patch up container isolation issues with band-aid fixes, but none of them offer the clean separation and security needed for running truly secure CI jobs.

On top of that, they frustrate the developer experience. Teams want to get things done with familiar tools — most notably, Docker - which they use in local development. By introducing these alternative tools, you add friction, slow down the workflow, and ultimately, you’re still left with a suboptimal security model.

Over two years ago, even as a staunch supporter of Kubernetes, [I finally realised](https://x.com/alexellisuk/status/1573599285362532353) that putting a square peg into a round hole was simply not working, and that there was a better way.

Docker containers and Kubernetes Pods can be great for running multi-tenant workload, but this all changes the moment that they need host level privileges. And frankly, anything but trivial CI jobs tend to need a full Operating System.

VMs have a bad rap for being bulky, presenting a large attack surface, expensive to license, difficult to automate, and in the cloud world, slow to boot up.

That's where microVMs come in. Unlike traditional VMs or containers, microVMs:

* Boot in under a second.
* Run from lightweight root filesystems.
* Provide true API-driven automation with minimal overhead.
* Strip out unnecessary devices and features, focusing only on what's needed to run a job securely.

With microVMs, we get the isolation and security benefits of VMs without the bloat. They don’t need UEFI or BIOS, and they limit the attack surface dramatically.

The two best known solutions are:
* [Firecracker](https://github.com/firecracker-microvm/firecracker) by the AWS team - focused on short-lived workloads
* [cloud-hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor) (a fork of Firecracker) with additional support for PCI devices, and long-lived workloads

In Summer 2022, I built a prototype to run self-hosted runners with GitHub Actions, and reiterated some of the issues we discussed today. By October, we'd launched a Pilot and ran tens of thousands of securely isolated jobs for our first customer in just a few days.

<blockquote class="twitter-tweet" data-conversation="none" data-theme="dark"><p lang="en" dir="ltr">Enter actuated 🤘<br><br>1) You set up a number of hosts with a bare OS and our agent binary<br>2) We run the control plane and start one-shot microVMs for every job<br>3) We managed the base VM image with all its tools<br>4) We schedule efficiently not to waste money or to exceed resources <a href="https://t.co/Xn2dz77vad">pic.twitter.com/Xn2dz77vad</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1573599294329954304?ref_src=twsrc%5Etfw">September 24, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I spoke at [Cloud Native Rejekts](https://cloud-native.rejekts.io/) just before KubeCon, to staunch Kubernetes users, and got a resounding round of applause. I think something clicked, people realised Kubernetes is a wonderful platform, but we need something different for CI.

<iframe width="560" height="315" src="https://www.youtube.com/embed/pTQ_jVYhAoc?si=Cb7tZZJa7wf3cDEr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

There are downsides however. Working with microVMs needs low-level Linux expertise, and I'm not talking about the kind of insights you get from Googling or a ChatGPT session. To make secure and proficient use of them requires a deep understanding of Kernel configurations, how to debug them when something is missing, what makes up a root filesystem, Linux networking, cgroups, and so much more. And that's before you've even started building a [UI dashboard](https://docs.actuated.com/dashboard/), API and integration with a CI system like GitHub or GitLab.

The community support for Firecracker is very limited, since the maintainers are more focused on how AWS uses the technology, than furthering external adoption. For that reason we've have to do a lot of independent R&D, and leant into my past experience with Linux systems engineering from OpenFaaS, and inlets.

If you'd like to get a flavour of what it's like to run a microVM, you can try out my quick start: [Grab your lab coat - we're building a microVM from a container](https://actuated.com/blog/firecracker-container-lab).

## Wrapping up & further resources

There are various reasons to consider self-hosted runners: cost optimisation, access to faster hardware, running on Arm hardware for multi-arch builds, and for the fastest possible access to private networks.

If you're considering using a self-hosted runner installed on a VM for an OSS project, just don't. The risks are obvious, and there is no up side. GitHub is very clear about the risks. You may get away with it for a limited time for a closed-source repository, but it is a lot of work keeping up, and coping with side-effects. Is this the secure environment that your customers would expect you to be using?

If you're considering using a Kubernetes-based solution, make sure that you only run tools that are safe like Python, Node, Go, without building or running any containers. You may be OK, if you have set up comprehensive network policies to prevent attacks to the internal network and any cloud metadata services. One of the first thing penetration testers look for is an unsecured cloud metadata endpoint, it can often be used to obtain access keys to your cloud account through IAM roles that are applied to the base host.

When you install GitLab through their helm chart, their warning is clear:

> You've installed GitLab Runner without the ability to use 'docker in docker'.
> The GitLab Runner chart (gitlab/gitlab-runner) is deployed without the `privileged` flag by default for security purposes. This can be changed by setting `gitlab-runner.runners.privileged` to `true`. Before doing so, please read the GitLab Runner chart's documentation on why we chose not to enable this by default. See https://docs.gitlab.com/runner/install/kubernetes.html#running-docker-in-docker-containers-with-gitlab-runners

If you need to run a container, or build one, you really only have two safe options: hosted runners or a solution like actuated.

Hosted runners have come on a long way since we started a couple of years ago, however they are still 2-3x more expensive than actuated at higher volumes. The Arm support is still limited, if you need access to large datasets of LLM models, a VPN is simply too slow, and running a microVM next to the data will be night and day quicker.

If you're interested in trying out actuated, or hearing more, you can get in touch with me and the team here: [Talk to us about Actuated](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform)

You can also find out more conceptual and technical details about actuated in the [Frequently Asked Questions (FAQ)](https://docs.actuated.com/faq/).

See also:

* [Secure your GitLab jobs with microVMs and Actuated](https://actuated.com/blog/actuated-for-gitlab)
* [Face off: VMs vs. Containers vs Firecracker](https://www.youtube.com/watch?v=pTQ_jVYhAoc&t=1s)
* [Understand your usage of GitHub Actions](https://actuated.com/blog/github-actions-usage-cli)
* [Accelerate GitHub Actions with dedicated GPUs](https://actuated.com/blog/gpus-for-github-actions)

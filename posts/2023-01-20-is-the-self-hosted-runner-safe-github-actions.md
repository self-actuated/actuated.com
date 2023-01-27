---
title: Is the GitHub Actions self-hosted runner safe for Open Source?
description: GitHub warns against using self-hosted Actions runners for public repositories - but why? And are there alternatives?
author: Alex Ellis
tags:
- security
- oss
author_img: alex
image: /images/2023-native-arm64-for-oss/in-progress-dashboard.png
date: "2023-01-20"
---

First of all, why would someone working on an open source project need a self-hosted runner?

Having contributed to dozens of open source projects, and gotten to know many different maintainers, the primary reason tends to be out of necessity. They face an 18 minute build time upon every commit or Pull Request revision, and want to make the best of what little time they can give over to Open Source.

Having faster builds also lowers friction for contributors, and since many contributors are unpaid and rely on their own internal drive and enthusiasm, a fast build time can be the difference between them fixing a broken test or waiting another few days.

To sum up, there are probably just a few main reasons:

1. Faster builds, higher concurrency, more disk space
2. Needing to build and test Arm binaries or containers on real hardware
3. Access to services on private networks

The first point is probably one most people can relate to. Simply by provisioning an AMD bare-metal host, or a high spec VM with NVMe, you can probably shave minutes off a build.

For the second case, some projects like [Flagger](https://github.com/fluxcd/flagger) from the CNCF felt their only option to support users deploying to AWS Graviton, was to seek sponsorship for a large Arm server and to install a self-hosted runner on it.

The third option is more nuanced, and specialist. This may or may not be something you can relate to, but it's worth mentioning. VPNs have very limited speed and there may be significant bandwidth costs to transfer data out of a region into GitHub's hosted runner environment. Self-hosted runners eliminate the cost and give full local link bandwidth, even as high as 10GbE. You just won't get anywhere near that with IPSec or Wireguard over the public Internet.

Just a couple of days ago [Ed Warnicke, Distinguished Engineer at Cisco](https://twitter.com/edwarnicke?lang=en) reached out to us to pilot actuated. Why?

Ed, who had [Network Service Mesh](https://networkservicemesh.io/) in mind said:

> I'd kill for proper Arm support. I'd love to be able to build our many containers for Arm natively, and run our KIND based testing on Arm natively.
> We want to build for Arm - Arm builds is what brought us to actuated

## But are self-hosted runners safe?

The GitHub team has a stark warning for those of us who are tempted to deploy a self-hosted runner and to connect it to a public repository.

> Untrusted workflows running on your self-hosted runner pose significant security risks for your machine and network environment, especially if your machine persists its environment between jobs. Some of the risks include:
> 
> * Malicious programs running on the machine.
> * Escaping the machine's runner sandbox.
> * Exposing access to the machine's network environment.
> * Persisting unwanted or dangerous data on the machine.

See also: [Self-hosted runner security](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#self-hosted-runner-security)

Now you may be thinking "I won't approve pull requests from bad actors", but quite often the workflow goes this way: the contributor gets approval, then you don't need to approve subsequent pull requests after that.

An additional risk is if that user's account is compromised, then the attacker can submit a pull request with malicious code or malware. There is no way in GitHub to enforce Multi-Factor Authentication (MFA) for pull requests, even if you have it enabled on your Open Source Organisation.

Here are a few points to consider:

* Side effects build up with every build, making it less stable over time
* You can't enforce MFA for pull requests - so malware can be installed directly on the host - whether intentionally or not
* The GitHub docs warn that users can take over your account
* Each runner requires maintenance and updates of the OS and all the required packages

The chances are that if you're running the Flagger or Network Service Mesh project, you are shipping code that enterprise companies will deploy in production with sensitive customer data.

If you are not worried, try explaining the above to them, to see how they may see the risk differently.

## Doesn't Kubernetes fix all of this?

[Kubernetes](https://kubernetes.io/) is a well known platform built for orchestrating containers. It's especially suited to running microservices, webpages and APIs, but has support for batch-style workloads like CI runners too.

You could make a container image and install the self-hosted runner binary within in, then deploy that as a Pod to a cluster. You could even scale it up with a few replicas.

If you are only building Java code, Python or Node.js, you may find this resolves many of the issues that we covered above, but it's hard to scale, and you still get side-effects as the environment is not immutable.

That's where the community project "actions-runtime-controller" or ARC comes in. It's a controller that launches a pool of Pods with the self-hosted runner. 

> How much work does ARC need?
>
> Some of the teams I have interviewed over the past 3 months told me that ARC took them a lot of time to set up and maintain, whilst others have told us it was a lot easier for them. It may depend on your use-case, and whether you're more of a personal user, or part of a team with 10-30 people committing code several times per day.
> The first customer for actuated, which I'll mention later in the article was a team of ~ 20 people who were using ARC and had grew tired of the maintenance overhead and certain reliability issues.

Unfortunately, by default ARC uses the same Pod many times as a persistent runner, so side effects still build up, malware can still be introduced and you have to maintain a Docker image with all the software needed for your builds.

You may be happy with those trade-offs, especially if you're only building private repositories.

But those trade-offs gets a lot worse if you use Docker or Kubernetes.

Out of the box, you simply cannot start a Docker container, build a container image or start a Kubernetes cluster.

And to do so, you'll need to resort to what can only be described as dangerous hacks:

1. You expose the Docker socket from the host, and mount it into each Pod - any CI job can take over the host, game over.
2. You run in [Docker in Docker (DIND)](http://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) mode. DIND requires a privileged Pod, which means that any CI job can take over the host, game over.

There is some early work on running Docker In Docker in user-space mode, but this is slow, tricky to set up and complicated. By default, user-space mode uses a non-root account. So you can't install software packages or run commands like apt-get.

See also: [Using Docker-in-Docker for your CI or testing environment? Think twice.](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/)

Have you heard of Kaniko?

[Kaniko](https://github.com/GoogleContainerTools/kaniko) is a tool for building container images from a Dockerfile, without the need for a Docker daemon. It's a great option, but it's not a replacement for running containers, it can only build them.

And when it builds them, in nearly every situation it will need root access in order to mount each layer to build up the image.

See also: [The easiest way to prove that root inside the container is also root on the host](https://suraj.io/post/root-in-container-root-on-host/)

And what about Kubernetes?

To run a KinD, Minikube or K3s cluster within your CI job, you're going to have to sort to one of the dangerous hacks we mentioned earlier which mean a bad actor could potentially take over the host.

Some of you may be running these Kubernetes Pods in your production cluster, whilst others have taken some due diligence and deployed a separate cluster just for these CI workloads. I think that's a slightly better option, but it's still not ideal and requires even more access control and maintenance.

Ultimately, there is a fine line between overconfidence and negligence. When building code on a public repository, we have to assume that the worst case scenario will happen one day. When using DinD or privileged containers, we're simply making that day come sooner.

Containers are great for running internal microservices and Kubernetes excels here, but there is a reason that AWS insists on hard multi-tenancy with Virtual Machines for their customers.

> See also: [Firecracker whitepaper](https://www.amazon.science/publications/firecracker-lightweight-virtualization-for-serverless-applications)

## What's the alternative?

When GitHub cautioned us against using self-hosted runners, on public repos, they also said:

> This is not an issue with GitHub-hosted runners because each GitHub-hosted runner is always a clean isolated virtual machine, and it is destroyed at the end of the job execution.

So using GitHub's hosted runners are probably the most secure option for Open Source projects and for public repositories - if you are happy with the build speed, and don't need Arm runners.

But that's why I'm writing this post, sometimes we need faster builds, or access to specialist hardware like Arm servers.

The Kubernetes solution is fast, but it uses a Pod which runs many jobs, and in order to make it useful enough to run `docker run`, `docker build` or to start a Kubernetes cluster, we have to make our machines vulnerable.

With actuated, we set out to re-build the same user experience as GitHub's hosted runners, but without the downsides of self-hosted runners or using Kubernetes Pods for runners.

Actuated runs each build in a microVM on servers that you alone provision and control.

Its centralised control-plane schedules microVMs to each server using an immutable Operating System that is re-built with automation and kept up to date with the latest security patches.

Once the microVM has launched, it connects to GitHub, receives a job, runs to completion and is completely erased thereafter.

You get all of the upsides of self-hosted runners, with a user experience that is as close to GitHub's hosted runners as possible.

Pictured - an Arm Server with 270 GB of RAM and 80 cores - that's a lot of builds.

[![](https://pbs.twimg.com/media/Fm62k4gXkAMHX-B?format=jpg&name=large)](https://twitter.com/alexellisuk/status/1616430466042560514/)

You get to run the following, without worrying about security or side-effects:

* Docker (`docker run`) and `docker build`
* Kubernetes - Minikube, K3s, KinD
* `sudo` / root commands

Need to test against a dozen different Kubernetes versions?

Not a problem:

![Testing multiple Kubernetes versions](https://actuated.dev/images/k3sup.png)

What about running the same on Arm servers?

Just change `runs-on: actuated` to `runs-on: actuated-aarch64` and you're good to go. We test and maintain support for Docker and Kubernetes for both Intel and Arm CPU architectures.

Do you need insights for your Open Source Program Office (OSPO) or for the Technical Steering Committee (TSC)?

[![](https://pbs.twimg.com/media/Fm62kSTXgAQLzUb?format=jpg&name=medium)](https://twitter.com/alexellisuk/status/1616430466042560514/)

We know that no open source project has a single repository that represents all of its activity. Actuated provides insights across an organisation, including total build time and the time queued - which is a reflection of whether you could do with more or fewer build machines.

And we are only just getting started with compiling insights, there's a lot more to come.

## Get involved today

We've already launched 10,000 VMs for customers jobs, and are now ready to open up the platform to the wider community. So if you'd like to try out what we're offering, we'd love to hear from you. As you offer feedback, you'll get hands on support from our engineering team and get to shape the product through collaboration.

So what does it cost? There is a subscription fee which includes - the control plane for your organisation, the agent software, maintenance of the OS images and our support via Slack. But all the plans are flat-rate, so it may even work out cheaper than paying GitHub for the bigger instances that they offer.

Professional Open Source developers like the ones you see at Red Hat, VMware, Google and IBM, that know how to work in community and understand cloud native are highly sought after and paid exceptionally well. So the open source project you work on has professional full-time engineers allocated to it by one or more companies, as is often the case, then using actuated could pay for itself in a short period of time.

If you represent an open source project that has no funding and is purely maintained by volunteers, what we have to offer may not be suited to your current position. And in that case, we'd recommend you stick with the slower GitHub Runners. Who knows? Perhaps one day GitHub may offer sponsored faster runners at no cost for certain projects?

And finally, what if your repositories are private? Well, we've made you aware of the trade-offs with a static self-hosted runner, or running builds within Kubernetes. It's up to you to decide what's best for your team, and your customers. Actuated works just as well with private repositories as it does with public ones.

See microVMs launching in ~ 1s during a matrix build for testing a Custom Resource Definition (CRD) on different Kubernetes versions:

<iframe width="560" height="315" src="https://www.youtube.com/embed/2o28iUC-J1w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Want to know how actuated works? [Read the FAQ for more technical details](https://docs.actuated.dev/faq/).

* [Find a server for your builds](https://docs.actuated.dev/register/)
* [Register for actuated](https://docs.actuated.dev/provision-server/)

Follow us on Twitter - [selfactuated](https://twitter.com/selfactuated)

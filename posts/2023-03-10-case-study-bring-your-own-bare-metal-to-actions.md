---
title: Bring Your Own Metal Case Study with GitHub Actions
description: See how BYO bare-metal made a 6 hour GitHub Actions build complete 25x faster.
author: Alex Ellis
tags:
- baremetal
- githubactions
- equinixmetal
- macmini
- xeon
author_img: alex
image: /images/2023-03-vpp/background.jpg
date: "2023-03-10"
---

I'm going to show you how both a regular x86_64 build and an Arm build were made dramatically faster by using Bring Your Own (BYO) bare-metal servers.

At the early stage of a project, GitHub's standard runners with 2x cores, 8GB RAM, and a little free disk space are perfect because they're free for public repos. For private repos they come in at a modest cost, if you keep your usage low.

What's not to love?

Well, [Ed Warnicke](https://twitter.com/edwarnicke?lang=en), Distinguished Engineer at Cisco contacted me a few weeks ago and told me about the VPP project, and some of the problems he was running into trying to build it with hosted runners.

> The Fast Data Project (FD.io) is an open-source project aimed at providing the world's fastest and most secure networking data plane through [Vector Packet Processing (VPP)](https://fd.io/).

Whilst VPP can be used as a stand-alone project, it is also a key component in the [Cloud Computing Foundation's (CNCF's)](https://www.cncf.io/) Open Source [Network Service Mesh](https://networkservicemesh.io/) project.

There were two issues:

1. The x86_64 build was taking 1 hour 25 minutes on a standard runner.

    Why is that a problem? CI is meant to both validate against regression, but to build binaries for releases. If that process can take 50 minutes before failing, it's incredibly frustrating. For an open source project, it's actively hostile to contributors.

2. The Arm build was hitting the 6 hour limit for GitHub Actions then failing

    Why? Well it was using [QEMU](https://www.qemu.org/), and I've spoken about this in the past - QEMU is a brilliant, zero cost way to build Arm binaries on a regular machine, but it's slow. And you'll see just how slow in the examples below, including where my Raspberry Pi beat a GitHub runner.

We explain how to use QEMU in Docker Actions in the following blog post:

[The efficient way to publish multi-arch containers from GitHub Actions](https://actuated.dev/blog/multi-arch-docker-github-actions)

## Rubbing some bare-metal on it

So GitHub does actually have a beta going for "larger runners", and if Ed wanted to try that out, he'd have to apply to a beta waitlist, upgrade to a Team or Enterprise Plan, and then pick a new runner size.

But that wouldn't have covered him for the Arm build, GitHub don't have any support there right now. I'm sure it will come one, day, but here we are unable to release binaries for our Arm users.

With actuated, we have no interest in competing with GitHub's business model of selling compute on demand. We want to do something more unique than that - we want to enable you to bring your own (BYO) devices and then use them as runners, with VM-level isolation and one-shot runners.

> What does Bring Your Own (BYO) mean?
> 
> "Your Own" does not have to mean physical ownership. You do not need to own a datacenter, or to send off a dozen Mac Minis to a Colo.
> You can provision bare-metal servers on AWS or with Equinix Metal as quickly as you can get an EC2 instance.
> Actually, bare-metal isn't strictly needed at all, and even DigitalOcean's and Azure's VMs will work with actuated because they support KVM, which we use to launch Firecracker.

And who is behind actuated? We are a nimble team, but have a pedigree with Cloud Native and self-hosted software going back 6-7 years from [OpenFaaS](https://openfaas.com/). OpenFaaS is a well known serverless platform which is used widely in production by commercial companies including Fortune 500s.

Actuated uses a Bring Your Own (BYO) server model, but there's very little for you to do once you've installed the actuated agent.

Here's how to set up the agent software: [Actuated Docs: Install the Agent](https://docs.actuated.dev/install-agent/).

You then get detailed stats about each runner, the build queue and insights across your whole GitHub organisation, in one place:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Actuated now aggregates usage data at the organisation level, so you can get insights and spot changes in behaviour.<br><br>This peak of 57 jobs was when I was quashing CVEs for <a href="https://twitter.com/openfaas?ref_src=twsrc%5Etfw">@openfaas</a> Pro customers in Alpine Linux and a bunch of Go <a href="https://t.co/a84wLNYYjo">https://t.co/a84wLNYYjo</a>… <a href="https://t.co/URaxgMoQGW">https://t.co/URaxgMoQGW</a> <a href="https://t.co/IuPQUjyiAY">pic.twitter.com/IuPQUjyiAY</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1633059062639108096?ref_src=twsrc%5Etfw">March 7, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## First up - x86_64

I forked Ed's repo into the "actuated-samples" repo, and edited the "runs-on:" field from "ubuntu-latest" to "actuated".

The build which previously took 1 hour 25 minutes now took 18 minutes 58 seconds. That's a 4.4x improvement.

![Improvements over the standard runner](/images/2023-03-vpp/x86.png)

4.4x doesn't sound like a big number, but look at the actual number.

It used to take well over an hour to get feedback, now you get it in less than 20 minutes.

And for context, this x86_64 build took 17 minutes to build on Ed's laptop, with some existing caches in place.

I used an [Equinix Metal m3.small.x86 server](https://deploy.equinix.com/product/servers/m3-small/), which has 8x Intel Xeon E-2378G cores @ 2.8 GHz. It also comes with a local SSD, local NVMe would have been faster here.

The Firecracker VM that was launched had 12GB of RAM and 8x vCPUs allocated.

## Next up - Arm

For the Arm build I created a new branch and had to change a few hard-coded references from "_amd64.deb" to "_arm64.deb" and then I was able to run the build. This is common enablement work. I've been doing Arm enablement for Cloud Native and OSS since 2015, so I'm very used to spotting this kind of thing.

So the build took 6 hours, and didn't even complete when running with QEMU.

How long did it take on bare-metal? 14 minutes 28 seconds.

![Improvements over QEMU](/images/2023-03-vpp/arm64.png)

That's a 25x improvement.


The Firecracker VM that we launched had 16GB of RAM and 8x vCPUs allocated.

It was running on a Mac Mini M1 configured with 16GB RAM, running with Asahi Linux. I bought it for development and testing, as a one-off cost, and it's a very fast machine. 

But, this case-study is *not* specifically about using consumer hardware, or hardware plugged in under your desk.

Equinix Metal and Hetzner both have the Ampere Altra bare-metal server available on either an hourly or monthly basis, and AWS customers can get access to the a1.metal instance on an hourly basis too.

See our hosting recommendations: [Actuated Docs: Provision a Server](https://docs.actuated.dev/provision-server/)

In October last year, I benchmarked a Raspberry Pi 4 as an actuated server and pitted it directly against QEMU and GitHub's Hosted runners.

It was 24 minutes faster. That's how bad using QEMU can be instead of using bare-metal Arm.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Then, just for run I scheduled the MicroVM on my <a href="https://twitter.com/Raspberry_Pi?ref_src=twsrc%5Etfw">@Raspberry_Pi</a> instead of an <a href="https://twitter.com/equinixmetal?ref_src=twsrc%5Etfw">@equinixmetal</a> machine.<br><br>Poor little thing has 8GB RAM and 4 Cores with an SSD connected over USB-C.<br><br>Anyway, it still beat QEMU by 24 minutes! <a href="https://t.co/ITyRpbnwEE">pic.twitter.com/ITyRpbnwEE</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/1583092051398524928?ref_src=twsrc%5Etfw">October 20, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Wrapping up

So, wrapping up - if you only build x86_64, and have very few build minutes, and are willing to upgrade to a Team or Enterprise Plan on GitHub, "faster runners" may be an option you want to consider.

If you don't want to worry about how many minutes you're going to use, or surprise bills because your team got more productive, or grew in size, or is finally running those 2 hour E2E tests every night, then actuated may be faster and better value overall for you.

But if you need Arm runners, and [want to use them with public repos](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions), then there are not many options for you which are going to be secure and easy to manage.

### A recap on the results

[![The improvement on the x86 build](/images/2023-03-vpp/background.jpg)](https://twitter.com/alexellisuk/status/1634128821124313091?s=20)
> [The improvement on the x86 build](https://twitter.com/alexellisuk/status/1634128821124313091?s=20)

You can see the builds here:

x86_64 - 4.4x improvement

* Before: 1 hour 25 minutes - [x86_64 build on a hosted runner](https://github.com/edwarnicke/govpp/actions/runs/3622982661)
* After: 18 minutes - 58 seconds [x86_64 build on Equinix Metal](https://github.com/actuated-samples/govpp/actions/runs/4383082399)

Arm - 25x improvement

* Before: 6 hours (and failing) - [Arm/QEMU build on a hosted runner](https://github.com/edwarnicke/govpp/actions/runs/3643464160)
* After: 14 minutes 28 seconds - [Arm build on Mac Mini M1](https://github.com/actuated-samples/govpp/actions/runs/4383475307)

### Want to work with us?

Want to get in touch with us and try out actuated for your team?

We're looking for pilot customers who want to speed up their builds, or make self-hosted runners simpler to manager, and ultimately, about as secure as they're going to get with MicroVM isolation.

Set up a 30 min call with me to ask any questions you may have and find out next steps.

* [Register for the actuated pilot](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform)

Learn more about how it compares to other solutions in the FAQ: [Actuated FAQ](https://docs.actuated.dev/faq)

See also:

* [The efficient way to publish multi-arch containers from GitHub Actions](https://actuated.dev/blog/multi-arch-docker-github-actions)
* [Is the GitHub Actions self-hosted runner safe for Open Source?](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions)
* [How to make GitHub Actions 22x faster with bare-metal Arm](https://actuated.dev/blog/native-arm64-for-github-actions)

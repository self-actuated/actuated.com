---
title: Introducing burst billing and capacity for GitHub Actions
description: Actuated now offers burst billing and capacity for customers with spiky and unpredictable CI/CD workloads.
tags:
- githubactions
- cicd
- burst
- capacity
- billing
author_img: alex
image: /images/2024-05-burst/background.png
date: "2024-04-25"
---

[Why did we make Actuated](/blog/blazing-fast-ci-with-microvms)? Actuated provides a securely isolated, managed, white-glove experience for customers who want to run CI/CD on GitHub Actions, with access to fast and private hardware. It's ideal for moving your organisation off Jenkins, customers who spend far too much on hosted runners, or those who cringe at the security implications of building with Docker using Kubernetes.

Today, we're introducing two new features for actuated customers: burst billing and burst capacity (on shared servers). With burst billing, you can go over the concurrency limit of your plan for the day, and pay for the extra usage at a slightly higher rate. With burst capacity, you can opt into running more jobs than your current pool of servers allow for by using our hardware.

**Why we charge on concurrency, not minutes**

Having run over 320k VMs for customer CI jobs on GitHub Actions, we've seen a lot of different workloads and usage patterns. Some teams have a constant stream of hundreds of jobs per hour due to the use of matrix builds, some have a plan that's a little to big for them, and others have a plan that's a little to small, so they get the odd delay whilst they wait for jobs to finish.

We decided to charge customers based not upon how many jobs they launched, how many minutes they consumed, but on the maximum amount of jobs they wanted to run at any one time (concurrency). Since customers already bring their own hardware, and pay per minute, hour or month for it, we didn't want them to have to pay again per minute and to be limited by how many jobs they could run per month.

For high usage customers, this is a great deal. You get to run unlimited minutes, and in one case we had a customer who consumed 100k minutes within one week. With GitHub's current pricing that would have cost them 3,200 USD per week, or 12,800 USD per month. So you can see how [the actuated plans](/pricing), based upon concurrency alone are a great deal cheaper here.

**What if your plan is too small?**

So let's take a team that has the 5 concurrent build plan, but their server can accommodate 10 builds at once. What happens there?

If 8 builds are queued, 5 will be scheduled, and the other 3 will remain in a queue. Once one of the first 5 completes, one of those 3 pending will get scheduled, and so forth, until all the work is done.

![Concurrency limiting in practice](/images/2024-05-burst/limited.png)
> The plan size is 5, but there are 8 jobs in the queue. The first 5 are scheduled, and the other 3 are pending.

Prior to today, the team would have only had two options: stay on the 5 concurrent build plan, and just accept that sometimes they'll have to wait for builds to complete, or upgrade to the 10 concurrent build plan, and have that extra capacity available to them whenever it's needed.

**CI usage can be unpredictable**

In the world of Kubernetes and autoscaling Pods, it might seem counterintuitive to plan out your capacity, but what we've seen is that when it comes to CI/CD, the customers we've worked with so far have very predictable usage patterns and can help them right-size their servers and plans.

As part of our white-glove service, we monitor the usage of customers to see when they're hitting their limits, or encountering delays. We'll also let them know if they are under or overutilising their servers based upon free RAM and CPU usage.

Then, there are two additional free tools we offer for self-service:

* Our open-source [actions-usage](https://actuated.dev/blog/github-actions-usage-cli) tool can give you a good idea of what your patterns look like for a given period of time.
* We built [vmmeter](https://actuated.dev/blog/right-sizing-vms-github-actions) to help customers right-size VMs to CI jobs. So often customers pick VM sizes that are an order of magnitude too big for their jobs, meaning fewer jobs can run in parallel on the same set of servers

**Extra billing on your own servers**

If you're on a plan that has 20 concurrent builds, and it's "Release day", which means you ideally need 40 concurrent builds, but only for that day, it doesn't make sense to upgrade to a 40 concurrent build plan for the whole month. So we've introduced billing for burst billing where you pay extra for the extra concurrency you use, but only for the days in which you use it.

This is a great way to get the extra capacity you need, without having to pay for it all the time, you'll need to have the extra capacity available on your own servers, but we can help you set that up.

In the below diagram, the customer is on a 5 concurrent build plan, but is bursting to 8 builds on his own servers.

![Burst billing](/images/2024-05-burst/burst-billing.png)
> Make use of excess capacity on your own servers for a day, without increasing your plan size for the whole month.

**Extra concurrency on our servers**

At no extra cost, we're offering burst capacity for customers who need it onto hardware which we run. This is turned off by default, so you'll have to ask us to access, but once it's available, you'll be able to run more jobs than your servers allow for. When you use our servers, you'll be billed for burst concurrency, which is slightly higher than the normal rate.

Below, the customer has used up the capacity of her own servers and is now bursting onto our servers for 2x *x86_64* and 2x Arm builds.

![Use our servers](/images/2024-05-burst/actuated-servers.png)
> Make use of our servers to run more jobs than your servers allow for.

## Wrapping up

If you'd like to try burst billing on your own servers, where you pay a little more on the days where you need to go over your plan, or if you'd like to use our server capacity to be able to keep the number of servers you run down, then please get in touch with us via the actuated Slack.

**How much extra is burst billing?**

Burst billing when used for spiky workloads is far cheaper than upgrading your plan for the whole month. The launch rate is 40%, however this may be subject to change.

**What if we go over the plan every day?**

If you go over the plan every day, or most days, then it may be cheaper to upgrade to the next plan size. For instance, if the average daily usage is 14 builds, and your plan size is 10, you should save money by adopting the 15 build plan.

That said, if your plan size is 10, and the monthly average is 12, you'll be better off with burst billing.

**Can we set a limit on burst billing?**

Burst billing is off by default. You can set an upper bound on the amount by telling us how high you want to go.

**How do we get burst capacity with actuated servers?**

Tell us the burst limit you'd like to enable, then we can enable *x86_64* or *Arm64* server capacity on your account.

**When is burst capacity used?**

Burst capacity is used when a job cannot be scheduled onto your own server capacity, and there is available capacity on our servers. Another way to think about burst capacity is as using on shared servers. Each job runs in its own microVM, which provides hard isolation.

You may also like:

* [Right-sizing VMs for GitHub Actions](/blog/right-sizing-vms-github-actions)
* [Measure your GitHub Actions usage](/blog/github-actions-usage-cli)
* [The state of Arm CI for the CNCF](/blog/cncf-arm-march-update)

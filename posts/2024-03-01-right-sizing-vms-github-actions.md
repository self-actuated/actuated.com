---
title: Right sizing VMs for GitHub Actions
description: How do you pick the right VM size for your GitHub Actions runners? We wrote a custom tool to help you find out.
tags:
- efficiency
- githubactions
- metering
author_img: alex
image: /images/2024-03-right-sizing/background.png
date: "2024-03-01"
---

When we [onboarded the etcd project from the CNCF](https://actuated.dev/blog/arm-ci-cncf-ampere), they'd previously been using a self-hosted runner for their repositories on a bare-metal host. There are several drawbacks to this approach, [including potential security issues, especially when using Docker](/blog/is-the-self-hosted-runner-safe-github-actions).

actuated VM sizes can be configured by a label, and you can pick any combination of vCPU and RAM, there's no need to pick a pre-defined size.

At the same time, it can be hard to know what size to pick, and if you make the VM size too large, then you won't be able to run as many jobs at once.

There's three main things to consider:

* The number of vCPUs - if there are not enough for the job, it'll be slower, and may hit timeouts which cause a failure
* The amount of RAM - if there's not enough, all the RAM could be consumed, and the VM will crash. You may not even get a helpful error message
* The amount of disk space per VM - if you make this too high, you'll be limited on the amount of jobs you can run at once, if you make it too low, jobs can fail, sometimes with non-obvious error messages

We wrote a tool called vmmeter which takes samples of resource consumption over the duration of a build, and will then report back with the peak and average values.

vmmeter is written in Go, and is available to use as a pre-built binary. We may consider open-sourcing it in the future. The information you gather still needs to be carefully considered and some experimentation will be required to get the right balance between VM size and performance.

The tool can be run in an action by adding some YAML, however, it can also be run on any Linux system using bash, or potentially within a different CI/CD system. See the note at the end if you're interested in trying that out.

## Running vmmeter inside GitHub Actions

This action will work with a Linux VM environment, so with a hosted runner or with actuated. It may not work when used within the `containers:` section of a workflow, or with a Kubernetes-based runner.

Add to the top of your GitHub action:

```yaml

steps:

# vmmeter start
        - uses: alexellis/setup-arkade@master
        - name: Install vmmeter
          run: |
            sudo -E arkade oci install ghcr.io/openfaasltd/vmmeter:latest --path /usr/local/bin/
        - uses: self-actuated/vmmeter-action@master
# vmmeter end
```

The first set installs arkade, which we then use to extract vmmeter from a container image to the host.

Then `self-actuated/vmmeter-action` is used to run the tool in the background, and also runs a post-setup setup to stop the measurements, and upload the results to the workflow run.

To show you how the tool works, I ran a simple [build of the Linux Kernel](https://github.com/actuated-samples/kernel-builder-linux-6.0/blob/master/.github/workflows/microvm-kernel.yml) without any additional modules or options added in.

Here's the summary text that was uploaded to the workflow run:

```
Total RAM: 61.2GB
Total vCPU: 32
Load averages:
Max 1 min: 5.63 (17.59%)
Max 5 min: 1.25 (3.91%)
Max 15 min: 0.41 (1.28%)

RAM usage (10 samples):
Max RAM usage: 2.528GB

Max 10s avg RAM usage: 1.73GB
Max 1 min avg RAM usage: 1.208GB
Max 5 min avg RAM usage: 1.208GB

Disk read: 374.2MB
Disk write: 458.2MB
Max disk I/O inflight: 0
Free: 45.57GB	Used: 4.249GB	(Total: 52.52GB)

Egress adapter RX: 271.4MB
Egress adapter TX: 1.535MB

Entropy min: 256
Entropy max: 256

Max open connections: 125
Max open files: 1696
Processes since boot: 18081

Run time: 45s
```

The main thing to look for is the peak load on the system. This roughly corresponds to the amount of vCPUs used at peak. If the number is close to the amount you allocated, then try allocating more and measuring the effect in build time and peak usage.

We've found that some jobs are RAM hungry, and others use a lot of CPU. So if you find that the RAM requested is much higher than the peak or average usage, the chances are that you can safely reduce it.

Disk usage is self-explanatory, if you've allocated around 30GB per VM, and a job is getting close to that limit, it may need increasing to avoid future failures.

Disk, network read/write and open files are potential indicators of I/O contention. if a job reads or writes a large amount of data over the network interface, then that may become a bottleneck. [Caching](/blog/local-caching-for-github-actions) is one of the ways to work around that, whether you set up your workflow to use GitHub's hosted cache, or one running in the same datacenter or region as your CI servers.

## Wrapping up

In one case, a build on the etcd-io project was specified with 16 vCPU and 32GB of RAM, but when running vmmeter, they found that less than 2 vCPU was used at peak and less than 3GB of RAM. That's a significant difference.

Toolpath is a commercial customer, and we were able to help them reduce their wall time per pull request from 6 hours to 60 minutes. Or from 6x 1 hour jobs to 6x 15-20 minute jobs running in parallel. Jason Gray told me during a product market fit interview that "the level of expertise and support pays for itself". We'd noticed that his teams jobs were requesting far too much CPU, but not enough RAM and were able to make recommendations. We then saw that disk space was running dangerously low, and were able to reconfigure their dedicated build servers for them, remotely, without them having to even think about it.

If you'd like to try out vmmeter, it's free to use on GitHub's hosted runners and on actuated runners. We wouldn't recommend making it a permanent fixture in your workflow, because if it were to fail or exit early for any reason, it may mark the whole build as a failure.

Instead, we recommend you use it learn and explore, and fine-tune your VM sizes. Getting the numbers closer to a right-size could reduce your costs with hosted runners and your efficiency with actuated runners.

The source-code for the action is available here: [self-actuated/vmmeter-action](https://github.com/self-actuated/vmmeter-action).

* [index.js](https://github.com/self-actuated/vmmeter-action/blob/master/index.js) is used to setup the tool and start taking measurements
* [post.js](https://github.com/self-actuated/vmmeter-action/blob/master/post.js) communicates to vmmeter over a TCP port and tells it to dump its response to `/tmp/vmmeter.log`, then to exit

*What if you're not using GitHub Actions?*

You can run vmmeter with bash on your own system, and may also able to use vmmeter in GitLab CI or Jenkins. We've got [manual instructions for vmmeter here](https://gist.github.com/alexellis/1f33e581c75e11e161fe613c46180771#running-vmmeter-inside-github-actions). You can even just start it up right now, do some work and then call the collect endpoint to see what was used over that period of time, a bit like a generic profiler.


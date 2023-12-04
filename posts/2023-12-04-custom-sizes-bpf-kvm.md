---
title: "December Boost: Custom Job Sizes, eBPF Support, & KVM Acceleration"
description: "You can now request custom amounts of RAM and vCPU for jobs, run eBPF within jobs, and use KVM acceleration."
tags:
- ebpf
- cloudnative
- opensource
author_img: alex
image: /images/2023-12-scheduling-bpf/background-bpf.png
date: "2023-12-04"
---

In this December update, we've got three new updates to the platform that we think you'll benefit from. From requesting custom vCPU and RAM per job, to eBPF features, to spreading your plan across multiple machines dynamically, it's all new and makes actuated better value.

## New eBPF support and 5.10.201 Kernel

And as part of our work to provide hosted [Arm CI for CNCF projects](/blog/arm-ci-cncf-ampere), including [Tetragon](https://github.com/cilium/tetragon) and [Cilium](https://github.com/cilium/cilium), we've now enabled eBPF and BTF features within the Kernel.

> [Berkley Packet Filter (BPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) is an advanced way to integrate with with the Kernel, for observability, security and networking. You'll see it included in various CNCF projects like Cilium, [Falco](https://github.com/falcosecurity/falco), [Kepler](https://www.cncf.io/projects/kepler/), and others.

Whilst BPF is powerful, it's also a very fast moving space, and was particularly complicated to patch to Firecracker's minimal Kernel configuration. We want to say a thank you to [Mahé Tardy
](https://twitter.com/mtardy_?lang=en) who maintains Tetragon and to [Duffie Coolie](https://www.linkedin.com/in/mauilion) both from [Isovalent](https://isovalent.com/) for pointers and collaboration.

We've made a big jump in the supported Kernel version from 5.10.77 up to 5.10.201, with newer revisions being made available on a continual basis.

To update your servers, log in via SSH and edit `/etc/default/actuated`.

For amd64:

```
IMAGE_REF="ghcr.io/openfaasltd/actuated-ubuntu22.04:x86_64-latest"
KERNEL_REF="ghcr.io/openfaasltd/actuated-kernel:x86_64-latest"
```

For arm64:

```
IMAGE_REF="ghcr.io/openfaasltd/actuated-ubuntu22.04:aarch64-latest"
KERNEL_REF="ghcr.io/openfaasltd/actuated-kernel:aarch64-latest"
```

Once you have the new images in place, reboot the server. Updates to the Kernel and root filesystem will be delivered Over The Air (OTA) automatically by our team.

## Request custom vCPU and RAM per job

Our initial version of actuated aimed to set a specific vCPU and RAM value for each build, designed to slice up a machine equally for the best mix of performance and concurrency. We would recommend it to teams during their onboarding call, then mostly leave it as it was. For a machine with 128GB RAM and 32 threads, you may have set it up for 8 jobs with 4x vCPU and 16GB RAM each, or 4 jobs with 8x vCPU and 32GB RAM.

However, whilst working with Justin Gray, CTO at Toolpath, we found that their build needed increasing amounts of RAM to avoid an Out Of Memory (OOM) crash, and so implemented custom labels.

These labels do not have any predetermined values, so you can change them to any value you like, independently. You're not locked into a set combinations.

Small tasks, automation, publishing Helm charts?

```yaml
runs-on: actuated-2cpu-8gb
```

Building a large application, or training an AI model?

```yaml
runs-on: actuated-32cpu-128gb
```

## Spreading your plan across all available hosts

Previously, if you had a plan with 10 concurrent builds and both an Arm server and an amd64 server, we'd split your plan statically 50/50. So you could run a maximum of 5 Arm and 5 amd64 builds at the same time.

Now, we've made this dynamic, all of your 10 builds can start on the Arm or amd64 server. Or, 1 could start on the Arm server, then 9 on the amd64 server, and so on.

The change makes the product better value for money, and we had always wanted it to work this way.

Thanks to [Patrick Stephens at Fluent/Calyptia](https://uk.linkedin.com/in/patrickjkstephens) for the suggestion and for helping us test it out.

## Nested virt, KVM, and running VMs in your jobs

When we started actuated over 12 months ago, there was no support for nested virtualisation in any part of GitHub's infrastructure, and so we made it available first for our customers.

We have several tutorials including how to run Firecracker itself within a CI job, Packer, nix and more.

When you run Packer in a VM, instead of with one of the cloud drivers, you save on time and costs, by not having to fire up cloud resources on AWS, GCP, Azure, and so forth. Instead, you can run a local VM to build the image, then convert it to an AMI or another format.

One of our customers has started exploring launching a VM during a CI job in order to test air-gapped support for enterprise customers. This is a great example of how you can use nested virtualisation to test your own product in a repeatable way.

* [How to run KVM guests in your GitHub Actions](https://actuated.dev/blog/kvm-in-github-actions)
* [Automate Packer Images with QEMU and Actuated](https://actuated.dev/blog/automate-packer-qemu-image-builds)
* [Faster Nix builds with GitHub Actions and actuated](https://actuated.dev/blog/faster-nix-builds)
* [Docs: Run a KVM guest](https://docs.actuated.dev/examples/kvm-guest)

## Wrapping up

We've now released eBPF/BTF support as part of onboarding CNCF projects, updated to the latest Kernel revision, made scheduling better value for money & easier to customise, and have added a range of tutorials for getting the most out of nested virtualisation.

If you'd like to try out actuated, you can get started same day.

[Talk to us.](/pricing).

You may also like:

* [Announcing managed Arm CI for CNCF projects](/blog/arm-ci-cncf-ampere)
* [Actuated docs & FAQ](https://docs.actuated.dev/)

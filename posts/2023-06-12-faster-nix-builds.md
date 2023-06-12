---
title: Faster Nix builds with GitHub Actions and actuated
description: "Speed up your Nix project builds on GitHub Actions with runners powered by Firecracker."
tags:
- cicd
- githubactions
- nix
- nixos
- faasd
- openfaas
author_img: welteki
image: "/images/2023-06-faster-nix-builds/background.png"
date: "2023-06-12"
---

[faasd](https://github.com/openfaas/faasd) is a lightweight and portable version of [OpenFaaS](https://www.openfaas.com/) that was created to run on a single host. In my spare time I maintain [faasd-nix](https://github.com/welteki/faasd-nix), a project that packages faasd and exposes a NixOS module so it can be run with NixOS.

The module itself depends on faasd, containerd and the CNI plugins and all of these binaries are built in CI with Nix and then cached using [Cachix](https://www.cachix.org/) to save time on subsequent builds.

I often deploy faasd with NixOS on a Raspberry Pi and to the cloud, so I build binaries for both `x86_64` and `aarch64`. The build usually runs on the default GitHub hosted action runners. Now because GitHub currently doesn't have Arm support, I use QEMU instead which can emulate them. The drawback of this approach is that builds can sometimes be several times slower.

> For some of our customers, their builds couldn't even complete in 6 hours using QEMU, and only took between 5-20 minutes using native Arm hardware. Alex Ellis, Founder of Actuated.

While upgrading to the latest nixpkgs release recently I decided to try and build the project on runners managed with Actuated to see the improvements that can be made by switching to both bigger `x86_64` iron and native Arm hardware.

## Nix and GitHub actions

One of the features Nix offers are reproducible builds. Once a package is declared it can be built on any system. There is no need to prepare your machine with all the build dependencies. The only requirement is that Nix is installed.

> If you are new to Nix, then I'd recommend you read the [Zero to Nix](https://zero-to-nix.com/start/install) guide. It's what got me excited about the project.

Because Nix is declarative and offers reproducible builds, it is easy to setup a concise build pipeline for GitHub actions. A lot of steps usually required to setup the build environment can be left out. For instance, faasd requires Go, but there's no need to install it onto the build machine, and you'd normally have to install btrfs-progs to build containerd, but that's not something you have to think about, because Nix will take care of it for you.

Another advantage of the reproducible builds is that if it works on your local machine it most likely also works in CI. No need to debug and find any discrepancies between your local and CI environment.

> Of course, if you ever do get frustrated and want to debug a build, you can use the built-in [SSH feature in Actuated](https://docs.actuated.dev/tasks/debug-ssh/). Alex Ellis, Founder of Actuated.

This is what the workflow looks like for building faasd and its related packages:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cachix/install-nix-action@v21
      - name: Build faasd 🔧
        run: |
          nix build -L .#faasd
      - name: Build containerd 🔧
        run: |
          nix build -L .#faasd-containerd
      - name: Build cni-plugin 🔧
        run: |
          nix build -L .#faasd-cni-plugins
```

All this pipeline does is install Nix, using the [cachix/install-nix-action](https://github.com/marketplace/actions/install-nix) and run the `nix build` command for the packages that need to be built.

## Notes on the nix build for aarch64

To build the packages for multiple architectures there are a couple of options:

- cross-compiling, Nix has great support for cross compilation.
- compiling through binfmt QEMU.
- compiling natively on an aarch64 machine.

The preferred option would be to compile everything natively on an aarch64 machine as that would result in the best performance. However, at the time of writing GitHub does not provide Arm runners. That is why QEMU is used by many people to compile binaries in CI.

Enabling the binfmt wrapper on NixOS can be done easily through the NixOS configuration. On non-NixOS machines, like on the GitHub runner VM, the QEMU static binaries need to be installed and the Nix daemon configuration updated.

Instructions to configure Nix for compilation with QEMU can be found on the [NixOS wiki](https://nixos.wiki/wiki/NixOS_on_ARM#Compiling_through_binfmt_QEMU)

The workflow for building aarch64 packages with QEMU on GitHub Actions looks like this:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-qemu-action@v2
      - uses: cachix/install-nix-action@v21
        with:
          extra_nix_config: |
            extra-platforms = aarch64-linux
      - name: Build faasd 🔧
        run: |
          nix build -L .#packages.aarch64-linux.faasd
      - name: Build containerd 🔧
        run: |
          nix build -L .#packages.aarch64-linux.faasd-containerd
      - name: Build cni-plugin 🔧
        run: |
          nix build -L .#packages.aarch64-linux.faasd-cni-plugins

```

Install the QEMU static binaries using [docker/setup-qemu-action](https://github.com/docker/setup-qemu-action). Let the nix daemon know that it can build for aarch64 by adding `extra-platforms = aarch64-linux` via the `extra_nix_config` input on the install nix action. Update the nix build commands to specify platform e.g. `nix build .#packages.aarch64-linux.faasd`.

## Speeding up the build with a Raspberry Pi

Nix has great support for caching and build speeds can be improved greatly by never building things twice. This project normally uses [Cachix](https://www.cachix.org/) for caching and charing binaries across systems. For this comparison caching was disabled. All packages and their dependencies are built from scratch again each time.

Building the project takes around 4 minutes and 20 seconds on the standard GitHub hosted runner. After switching to a more powerful Actuated runner with 4CPUs and 8GB of RAM the build time dropped to 2 minutes and 15 seconds.

![Comparison of more powerful Actuated runner with GitHub hosted runner](/images/2023-06-faster-nix-builds/amd64-build-comparison.png)
> Comparison of more powerful Actuated runner with GitHub hosted runner.

While build times are still acceptable for x86_64 this is not the case for the aarch64 build. It takes around 55 minutes to complete the Arm build with QEMU on a GitHub runner.

Running the same build with QEMU on the Actuated runner already brings down the build time to 19 minutes and 40 seconds. Running the build natively on a Raspberry Pi 4 (8GB) completed in 11 minutes and 47 seconds. Building on a more powerful Arm machine would potentially reduce this time to a couple of minutes.

![Results of the matrix build comparing the GitHub hosted runner and the 2 Actuated runners](/images/2023-06-faster-nix-builds/arm64-build-comparison.png)
> Results of the matrix build comparing the GitHub hosted runner and the 2 Actuated runners.

Running the build natively on the Pi did even beat the fast bare-metal machine that is using QEMU.

My colleague Alex ran the same build on his Raspberry Pi using Actuated and an NVMe mounted over USB-C, he got the build time down even further. Why? Because it increased the I/O performance. In fact, if you build this on server-grade Arm like the Ampere Altra, it would be about 4x faster than the Pi 4.

Building for Arm:

* Alex's Raspberry Pi with NVMe: 10m49s
* An Ampere Altra on Equinix Metal: 3m29s

Building for x86_64

* AMD Epyc on Equinix Metal: 1m57s

![Alex's results](/images/2023-06-faster-nix-builds/alex-results.png)

These results show that whatever the Arm hardware you pick, it'll likely be faster than QEMU, even when QEMU is run on the fastest bare-metal available, the slowest Arm hardware will beat it by minutes.

## Wrapping up

Building your projects with Nix allows your GitHub actions pipelines to be concise and easy to maintain.

Even when you are not using Nix to build your project it can still help you to create concise and easy to maintain GitHub Action workflows. With Nix shell environments you can use Nix to declare which dependencies you want to make available inside an isolated shell environment for your project: [Streamline your GitHub Actions dependencies using Nix](https://determinate.systems/posts/nix-github-actions)

Building Nix packages or entire NixOS systems on GitHub Actions can be slow especially if you need to build for Arm. Bringing your own metal to GitHub actions can speed up your builds. If you need Arm runners, Actuated is one of the only options for securely isolated CI that is safe for Open Source and public repositories. Alex explains why in: [Is the GitHub Actions self-hosted runner safe for Open Source?](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions)

Another powerful feature of the Nix ecosystem is the ability to run integration tests using virtual machines (NixOS test). This feature requires hardware acceleration to be available in the CI runner. Actuated makes it possible to run these tests in GitHub Actions CI pipelines: [how to run KVM guests in your GitHub Actions](https://actuated.dev/blog/kvm-in-github-actions).

See also:

- [Bring Your Own Metal - Case Study with GitHub Actions](https://actuated.dev/blog/case-study-bring-your-own-bare-metal-to-actions)
- [How to make GitHub Actions 22x faster with bare-metal Arm](https://actuated.dev/blog/native-arm64-for-github-actions)
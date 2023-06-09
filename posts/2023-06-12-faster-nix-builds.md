---
title: Faster Nix builds on GitHub Actions
description: "Speed up your Nix project builds on GitHub Actions with self hosted runners."
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

In my spare time I maintain a project [faasd-nix](https://github.com/welteki/faasd-nix). This project contains the NixOS modules to run [faasd](https://github.com/openfaas/faasd) on NixOS. Faasd is a lightweight version of [OpenFaaS](https://www.openfaas.com/) that was created to run on a single host with very modest requirements.

The module depends on faasd, containerd and the CNI plugins and all of these binaries are built in CI with Nix and cached using [Cachix](https://www.cachix.org/).

I often deploy faasd with NixOS on a Raspberry Pi so in CI packages are built for both x86_64 and aarch64. The build usually runs on the default GitHub hosted action runners. Because GitHub currently does not provide Arm runners QEMU is used to compile packages for different architectures. The drawback of this approach is that builds can be slow.

While upgrading to the latest nixpkgs release recently I decided to try and build the project on self hosted runners with Actuated to see the improvements that can be made by switching to more powerful self hosted runners.

## Nix and GitHub actions

One of the features Nix offers are reproducible builds. Once a package is declared it can be built on any system. There is no need to prepare your machine with all the build dependencies. The only requirement is that Nix is installed.

> If you are new to Nix the [Zero to Nix](https://zero-to-nix.com/start/install) guide is a good place to get started.

Because of this Nix can make the GitHub actions pipeline very concise. A lot of steps usually required to setup the build environment can be left out. Another advantage of the reproducible builds is that if it works on your local machine it most likely also works in CI. No need to debug and find any discrepancies between your local and CI environment.

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

## Build nix packages for aarch64

To build the packages for multiple architectures there are a couple of options:

- cross-compiling, Nix has great support for cross compilation.
- compiling through binfmt QEMU.
- compiling natively on an aarch64 machine.

The preferred option would be to compile everything natively on an aarch64 machine as that would result in the best performance. However, at the time of writing GitHub does not provide Arm runners. That is why QEMU is used to compile the binaries for aarch64 in CI.

Enabling the binfmt wrapper on NixOS can be done easily through the NixOS configuration. On non-NixOS machines, like on the GitHub runner VM, the QEMU static binaries need to be installed and the Nix daemon configuration updated.

> Instructions to configure Nix for compilation with QEMU can be found on the [NixOS wiki](https://nixos.wiki/wiki/NixOS_on_ARM#Compiling_through_binfmt_QEMU)

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

## Speeding up the build

Nix has great support for caching and build speeds can be improved greatly by never building things twice. This project normally uses [Cachix](https://www.cachix.org/) for caching and charing binaries across systems. For this comparison caching was disabled. All packages and their dependencies are built from scratch again each time.

Building the project takes around 4 minutes and 20 seconds on the standard GitHub hosted runner. After switching to a more powerful Actuated runner with 4CPUs and 8GB of ram the build time dropped to 2 minutes and 15 seconds.

![Comparison of more powerful Actuated runner with GitHub hosted runner](/images/2023-06-faster-nix-builds/amd64-build-comparison.png)
> Comparison of more powerful Actuated runner with GitHub hosted runner.

While build times are still acceptable for x86_64 this is not the case for the aarch64 build. It takes around 55 minutes to complete the Arm build with QEMU on a GitHub runner.

Running the same build with QEMU on the Actuated runner already brings down the build time to 19 minutes and 40 seconds. Running the build natively on a Pi4 - 8GB completed in 11 minutes and 47 seconds. Building on a more powerful Arm machine would potentially reduce this time to a couple of minutes.

![Results of the matrix build comparing the GitHub hosted runner and the 2 Actuated runners](/images/2023-06-faster-nix-builds/arm64-build-comparison.png)
> Results of the matrix build comparing the GitHub hosted runner and the 2 Actuated runners.

Running the build natively on the Pi did even beat the fast bare-metal machine that is using QEMU.

## Wrapping up
Building your projects with Nix allows your GitHub actions pipelines to be concise and easy to maintain.

Even when you are not using Nix to build your project it can still help you to create concise and easy to maintain GitHub Action workflows. With Nix shell environments you can use Nix to declare which dependencies you want to make available inside an isolated shell environment for your project: [Streamline your GitHub Actions dependencies using Nix](https://determinate.systems/posts/nix-github-actions)

Building Nix packages or entire NixOS systems on GitHub Actions can be slow especially if you need to build for Arm. Bringing your own metal to GitHub actions can speed up your builds. If you need Arm runners, Actuated is a [secure](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions) and easy to manage solution.

Another powerful feature of the Nix ecosystem is the ability to run integration tests using virtual machines (NixOS test). This feature requires hardware acceleration to be available in the CI runner. Actuated makes it possible to run these tests in GitHub Actions CI pipelines: [how to run KVM guests in your GitHub Actions](https://actuated.dev/blog/kvm-in-github-actions).

See also:

- [Bring Your Own Metal - Case Study with GitHub Actions](https://actuated.dev/blog/case-study-bring-your-own-bare-metal-to-actions)
- [How to make GitHub Actions 22x faster with bare-metal Arm](https://actuated.dev/blog/native-arm64-for-github-actions)
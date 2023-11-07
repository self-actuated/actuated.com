---
title: How to run KVM guests in your GitHub Actions
description: From building cloud images, to running NixOS tests and the android emulator, we look at how and why you'd want to run a VM in GitHub Actions.
author: Han Verstraete
tags:
- virtualization
- kvm
- githubactions
- nestedvirt
- cicd
author_img: welteki
image: /images/2023-02-17-kvm-in-github-actions/nested-firecracker.png
date: "2023-02-17"
---

GitHub's hosted runners do not support nested virtualization. This means some frequently used tools that require KVM like packer, the Android emulator, etc can not be used in GitHub Actions CI pipelines.

We noticed there are quite a few issues for people requesting KVM support for GitHub Actions:

- [Enable nested virtualization · Issue #183 · actions/runner-images](https://github.com/actions/runner-images/issues/183)
- [Revisiting KVM support for Hosted GitHub Actions · Discussion #8305 · community/community](https://github.com/community/community/discussions/8305)
- [[Experimental] Add CI GitHub Actions workflow by rajadain · Pull Request #3586 · WikiWatershed/model-my-watershed](https://github.com/WikiWatershed/model-my-watershed/pull/3586)

As mentioned in some of these issues, an alternative would be to run your own self-hosted runner on a bare metal host. This comes with the downside that builds can conflict and cause side effects to system-level packages. On top if this self-hosted runners are considered [insecure for public repositories](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#self-hosted-runner-security).

Solutions like the "actions-runtime-controller" or ARC that use Kubernetes to orchestrate and run self-hosted runners in Pods are also out of scope if you need to run VMs.

With Actuated we make it possible to launch a Virtual Machine (VM) within a GitHub Action. Jobs are launched in isolated VMs just like GitHub hosted runners but with support for nested virtualization.

## Case Study: Githedgehog

One of our customers Sergei Lukianov, founding engineer at [Githedgehog](https://githedgehog.com) told us he needed somewhere to build Docker images and to test them with Kubernetes, he uses KinD for that.

Prior to adopting Actuated, his team used hosted runners which are considerably slower, and paid on a per minute basis. Actuated made his builds both faster, and more secure than using any of the alternatives for self-hosted runners.

It turned out that he also needed to launch VMs in those jobs, and that's something else that hosted runners cannot cater for right now. Actuated’s KVM guest support means he can run all of his workloads on fast hardware.

Some other common use cases that require KVM support on the CI runner:

- Running [Packer](https://www.packer.io/) for creating Amazon Machine Images (AMI) or VM images for other cloud platforms.
- Accelerating the [Android Emulator](https://developer.android.com/studio/run/emulator-commandline) via KVM.
- Running [NixOS](https://nixos.org/) tests or builds that depend on VMs.
- Testing software that can only be done with [KVM](https://www.linux-kvm.org/page/Main_Page) or in a VM.

## Running VMs in GitHub Actions

In this section we will walk you through a couple of hands-on examples.

### Firecracker microVM

In this example we are going to follow the Firecracker quickstart guide to boot up a Firecracker VM but instead of running it on our local machine we will run it from within a GitHub Actions workflow.

The workflow instals Firecracker, configures and boots a guest VM and then waits 20 seconds before shutting down the VM and exiting the workflow. The image below shows the run logs of the workflow. We see the login prompt of the running microVM.

![Running a firecracker microVM in a GitHub Actions job](/images/2023-02-17-kvm-in-github-actions/nested-firecracker.png)
> Running a firecracker microVM in a GitHub Actions job

Here is the workflow file used by this job:

```yaml
name: vm-run

on: push
jobs:
  vm-run:
    runs-on: actuated
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: Install arkade
        uses: alexellis/setup-arkade@v2
      - name: Install firecracker
        run: sudo arkade system install firecracker
      - name: Run microVM
        run: sudo ./run-vm.sh
```

The [setup-arkade](https://github.com/alexellis/setup-arkade) is to install arkade on the runner. Next firecracker is installed from the arkade system apps.

As a last step we run a firecracker microVM. The `run-vm.sh` script is based on the [firecracker quickstart](https://github.com/firecracker-microvm/firecracker/blob/main/docs/getting-started.md) and collects all the steps into a single script that can be run in the CI pipeline.

It script will:

- Get the kernel and rootfs for the microVM
- Start fireckracker and configure the guest kernel and rootfs
- Start the guest machine
- Wait for 20 seconds and kill the firecracker process so workflow finishes.

The `run-vm.sh` script:

```sh
#!/bin/bash

# Get a kernel and rootfs
arch=`uname -m`
dest_kernel="hello-vmlinux.bin"
dest_rootfs="hello-rootfs.ext4"
image_bucket_url="https://s3.amazonaws.com/spec.ccfc.min/img/quickstart_guide/$arch"

if [ ${arch} = "x86_64" ]; then
    kernel="${image_bucket_url}/kernels/vmlinux.bin"
    rootfs="${image_bucket_url}/rootfs/bionic.rootfs.ext4"
elif [ ${arch} = "aarch64" ]; then
    kernel="${image_bucket_url}/kernels/vmlinux.bin"
    rootfs="${image_bucket_url}/rootfs/bionic.rootfs.ext4"
else
    echo "Cannot run firecracker on $arch architecture!"
    exit 1
fi

echo "Downloading $kernel..."
curl -fsSL -o $dest_kernel $kernel

echo "Downloading $rootfs..."
curl -fsSL -o $dest_rootfs $rootfs

echo "Saved kernel file to $dest_kernel and root block device to $dest_rootfs."

# Start firecracker
echo "Starting firecracker"
firecracker --api-sock /tmp/firecracker.socket &
firecracker_pid=$!

# Set the guest kernel and rootfs
rch=`uname -m`
kernel_path=$(pwd)"/hello-vmlinux.bin"

if [ ${arch} = "x86_64" ]; then
    curl --unix-socket /tmp/firecracker.socket -i \
      -X PUT 'http://localhost/boot-source'   \
      -H 'Accept: application/json'           \
      -H 'Content-Type: application/json'     \
      -d "{
            \"kernel_image_path\": \"${kernel_path}\",
            \"boot_args\": \"console=ttyS0 reboot=k panic=1 pci=off\"
       }"
elif [ ${arch} = "aarch64" ]; then
    curl --unix-socket /tmp/firecracker.socket -i \
      -X PUT 'http://localhost/boot-source'   \
      -H 'Accept: application/json'           \
      -H 'Content-Type: application/json'     \
      -d "{
            \"kernel_image_path\": \"${kernel_path}\",
            \"boot_args\": \"keep_bootcon console=ttyS0 reboot=k panic=1 pci=off\"
       }"
else
    echo "Cannot run firecracker on $arch architecture!"
    exit 1
fi

rootfs_path=$(pwd)"/hello-rootfs.ext4"
curl --unix-socket /tmp/firecracker.socket -i \
  -X PUT 'http://localhost/drives/rootfs' \
  -H 'Accept: application/json'           \
  -H 'Content-Type: application/json'     \
  -d "{
        \"drive_id\": \"rootfs\",
        \"path_on_host\": \"${rootfs_path}\",
        \"is_root_device\": true,
        \"is_read_only\": false
   }"

# Start the guest machine
curl --unix-socket /tmp/firecracker.socket -i \
  -X PUT 'http://localhost/actions'       \
  -H  'Accept: application/json'          \
  -H  'Content-Type: application/json'    \
  -d '{
      "action_type": "InstanceStart"
   }'

# Kill the firecracker process to exit the workflow
sleep 20
kill -9 $firecracker_pid

```

The full example can be found on [GitHub](https://github.com/skatolo/nested-firecracker)

If you'd like to know more about how Firecracker works and how it compares to traditional VMs and Docker you can watch Alex's webinar on the topic.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/CYCsa5e2vqg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

> Join Alex and Richard Case for a cracking time. The pair share what's got them so excited about Firecracker, the kinds of use-cases they see for microVMs, fundamentals of Linux Operating Systems and plenty of demos.

### NixOS integration tests

With nix there is the ability to provide a set of declarative configuration to define integration tests that spin up virtual machines using [QEMU](https://www.qemu.org/) as the backend. While running these tests in CI without hardware acceleration is supported this is considerably slower.

For a more detailed overview of the test setup and configuration see the original tutorial on nix.dev:
- [Integration testing using virtual machines (VMs)](https://nix.dev/tutorials/nixos/build-and-deploy/integration-testing-using-virtual-machines)

The workflow file for running NixOS tests on  GitHub Actions:
```yaml
name: nixos-tests

on: push
jobs:
  nixos-test:
    runs-on: actuated
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1
      - uses: actions/setup-python@v3
        with:
          python-version: '3.x'
      - uses: cachix/install-nix-action@v16
        with:
          extra_nix_config: "system-features = nixos-test benchmark big-parallel kvm"
      - name: NixOS test
        run: nix build -L .#checks.x86_64-linux.postgres
```

We just install Nix using the [install-nix-action](https://github.com/cachix/install-nix-action) and run the tests in the next step.

The full example is available on [GitHub](https://github.com/skatolo/gh-actions-nixos-tests)

### Other examples of using a VM

In the previous section we showed you some brief examples for the kind of workflows you can run. Here are some other resources and tutorials that should be easy to adapt and run in CI.

- Create KVM virtual machine images with the [Packer QEMU Builder](https://developer.hashicorp.com/packer/plugins/builders/qemu)
- Launching an Ubuntu cloud image with cloud-init: [KVM: Testing cloud-init locally using KVM for an Ubuntu cloud image](https://fabianlee.org/2020/02/23/kvm-testing-cloud-init-locally-using-kvm-for-an-ubuntu-cloud-image/)

## Conclusion

Hosted runners do not support nested virtualization. That makes them unsuitable for running CI jobs that require KVM support.

For Actuated runners we provide a custom Kernel that enables KVM support. This will allow you to run Virtual Machines within your CI jobs.

At time of writing there is no support for aarch64 runners. Only Intel and AMD CPUs support nested virtualisation. 

While it is possible to deploy your own self-hosted runners to run jobs that need KVM support, this is not recommended:

- [Is the GitHub Actions self-hosted runner safe for Open Source?](https://actuated.dev/blog/is-the-self-hosted-runner-safe-github-actions)

Want to see a demo or talk to our team? [Contact us here](https://forms.gle/8XmpTTWXbZwWkfqT6)

Just want to try it out instead? [Register your GitHub Organisation and set-up a subscription](/pricing)

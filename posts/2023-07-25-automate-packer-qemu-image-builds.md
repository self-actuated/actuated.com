---
title: Automate Packer Images with QEMU and Actuated
description: "Learn how to automate Packer images using QEMU and nested virtualisation through actuated."
tags:
- images
- packer
- qemu
- kvm
author_img: welteki
image: "/images/2023-07-packer/background.png"
date: "2023-07-25"
---

One of the most popular tools for creating images for virtual machines is [Packer](https://www.packer.io/) by [Hashicorp](https://hashicorp.com). Packer automates the process of building images for a variety of platforms from a single source configuration. Different builders can be used to create machines and generate images from those machines.

In this tutorial we will use the [QEMU builder](https://developer.hashicorp.com/packer/plugins/builders/qemu) to create a [KVM](https://www.linux-kvm.org/page/Main_Page) virtual machine image.

We will see how the Packer build can be completely automated by integrating Packer into a continuous integration (CI) pipeline with GitHub Actions. The workflow will automatically trigger image builds on changes and publish the resulting images as GitHub release artifacts.

Actuated supports nested virtualsation where a VM can make use of KVM to launch additional VMs within a GitHub Action. This makes it possible to run the Packer QEMU builder in GitHub Action workflows. Something that is not possible with GitHub's default hosted runners.

> See also: [How to run KVM guests in your GitHub Actions](/blog/kvm-in-github-actions)

## Create the Packer template

We will be starting from a [Ubuntu Cloud Image](https://cloud-images.ubuntu.com/) and modify it to suit our needs. If you need total control of what goes into the image you can start from scratch using the ISO.

Variables are used in the packer template to set the `iso_url` and `iso_checksum`. In addition to these we also use variables to configure the `disk_size`, `ram`, `cpu`, `ssh_password` and `ssh_username`:

```
variable "cpu" {
  type    = string
  default = "2"
}

variable "disk_size" {
  type    = string
  default = "40000"
}

variable "headless" {
  type    = string
  default = "true"
}

variable "iso_checksum" {
  type    = string
  default = "sha256:d699ae158ec028db69fd850824ee6e14c073b02ad696b4efb8c59d37c8025aaa"
}

variable "iso_url" {
  type    = string
  default = "https://cloud-images.ubuntu.com/jammy/20230719/jammy-server-cloudimg-amd64.img"
}

variable "name" {
  type    = string
  default = "jammy"
}

variable "ram" {
  type    = string
  default = "2048"
}

variable "ssh_password" {
  type    = string
  default = "ubuntu"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "version" {
  type    = string
  default = ""
}

variable "format" {
  type    = string
  default = "qcow2"
}
```

The Packer source configuration:

```
source "qemu" "jammy" {
  accelerator      = "kvm"
  boot_command     = []
  disk_compression = true
  disk_interface   = "virtio"
  disk_image       = true
  disk_size        = var.disk_size
  format           = var.format
  headless         = var.headless
  iso_checksum     = var.iso_checksum
  iso_url          = var.iso_url
  net_device       = "virtio-net"
  output_directory = "artifacts/qemu/${var.name}${var.version}"
  qemuargs = [
    ["-m", "${var.ram}M"],
    ["-smp", "${var.cpu}"],
    ["-cdrom", "cidata.iso"]
  ]
  communicator           = "ssh"
  shutdown_command       = "echo '${var.ssh_password}' | sudo -S shutdown -P now"
  ssh_password           = var.ssh_password
  ssh_username           = var.ssh_username
  ssh_timeout            = "10m"
}
```

Some notable settings in the source configuration:

- We set `disk_image=true` since we are starting from an Ubuntu Cloud Image. If you wanted to launch an ISO based installation this would have to be false.
- Notice how the variables are used to configure different VM settings like disk size: `disk_size=var.disk_size`, image output format: `format=var.format` and the RAM and CPU for the vm through `qemuargs`.
- The `ssh_username` and `ssh_password` that Packer can use to establish an ssh connection to the VM are also configured.

In the next section we will see how [cloud-init](https://cloudinit.readthedocs.io/en/latest/) is used to setup user account with the correct password that Packer needs for provisioning.

The full example of the packer file is available on [GitHub](https://github.com/skatolo/actuated-packer-qemu).

### Create the user-data file

Cloud images provided by Canonical do not have users by default. The Ubuntu images use [cloud-init](https://cloudinit.readthedocs.io/en/latest/) to pre-configure the system during boot.

Packer uses provisioners to install and configure the machine image after booting. To run these provisioners Packer needs to be able to communicate with the machine. By default this happens by establishing an ssh connection to the machine.

Create a user-data file that sets the password of the default user so that it can be used by Packer to connect over ssh:

```
#cloud-config
password: ubuntu
ssh_pwauth: true
chpasswd:
  expire: false
```

Next create an ISO that can be referenced by our Packer template and presented to the VM:

```bash
genisoimage -output cidata.iso -input-charset utf-8 -volid cidata -joliet -r \
```

The ISO can be mounted by QEMU to provide the configuration data to `cloud-init` while the VM boots.

The `-cdrom` flag is used in the `qemuargs` field to mount the `cidata.iso` file:

```
  qemuargs = [
    ["-m", "${var.ram}M"],
    ["-smp", "${var.cpu}"],
    ["-cdrom", "cidata.iso"]
  ]
```

### Provision the image

The build section of the Packer template is used to define provisioners that can run scripts and commands to install software and configure the machine.

In this example we are installing python3 but you can run any script you want or use tools like [Ansible](https://www.ansible.com/) to automate the configuration.

```
build {
  sources = ["source.qemu.jammy"]

  provisioner "shell" {
    execute_command = "{{ .Vars }} sudo -E bash '{{ .Path }}'"
    inline          = ["sudo apt update", "sudo apt install python3"]
  }

  post-processor "shell-local" {
    environment_vars = ["IMAGE_NAME=${var.name}", "IMAGE_VERSION=${var.version}", "IMAGE_FORMAT=${var.format}"]
    script           = "scripts/prepare-image.sh"
  }
}
```

### Prepare the image for publishing.

Packer supports post-processors. They only run after Packer saves an instance as an image. Post-processors are commonly used to compress artifacts, upload them into a cloud, etc. See the [Packer docs](https://developer.hashicorp.com/packer/tutorials/docker-get-started/docker-get-started-post-processors) for more use-cases and examples. 

We will add a post processing step to the packer template to run the `prepare-image.sh` script. This script renames the image artifacts and calculates the shasum to prepare them to be uploaded as release artifacts on GitHub.

```
  post-processor "shell-local" {
    environment_vars = ["IMAGE_NAME=${var.name}", "IMAGE_VERSION=${var.version}", "IMAGE_FORMAT=${var.format}"]
    script           = "scripts/prepare-image.sh"
  }
```

### Launch the build locally

If your local system is setup correctly, it has the packer binary and qemu installed, you can build with just:

```bash
packer build .
```

The artifacts folder will contain the resulting machine image and shasum file after the build completes.

```
artifacts
└── qemu
    └── jammy
        ├── jammy.qcow2
        └── jammy.qcow2.sha256sum
```

## Automate image releases with GitHub Actions.

For the QEMU builder to run at peak performance it requires hardware acceleration. This is not always possible in CI runners. GitHub's hosted runners do not support nested virtualization. With Actuated we added support for launching Virtual Machines in GitHub Action pipelines. This makes it possible to run the Packer QEMU builder in your workflows.

Support for KVM is not enabled by default on Actuated and there are some prerequisites:

- `arm64` runners are not supported at the moment
- A bare-metal host that supports nested virtualization is required for the Agent.

To configure your Actuated Agent for KVM support follow the [instructions in the docs](https://docs.actuated.com/examples/kvm-guest/).

### The GitHub actions workflow

The default GitHub hosted runners come with Packer pre-installed. On self-hosted runners you will need a step to install the Packer binary. The official [setup-packer][https://github.com/hashicorp/setup-packer] action can be used for this.

We set `runs-on` to `actuated` so that the build workflow will run on an Actuated runner:

```yaml
name: Build

on:
  push:
    tags: ["v[0-9].[0-9]+.[0-9]+"]
    branches:
      - "main"
jobs:
  build-image:
    name: Build
    runs-on: actuated
    ##...
```

The build job runs the following steps:

1. Retrieve the Packer configuration by checking out the GitHub repository.

    ```yaml
    - name: Checkout Repository
      uses: actions/checkout@v3
    ```
2. Install QEMU to ensure Packer is able to launch kvm/qemu virtual machines.

    ```yaml
    - name: Install qemu
      run: sudo apt-get update && sudo apt-get install qemu-system -y
    ```
3. Setup packet to ensure the binary is available in the path.

    ```yaml
    - name: Setup packer
      uses: hashicorp/setup-packer@main
    ```
4. Initialize the packer template and install all plugins referenced by the template.

    ```yaml
    - name: Packer Init
      run: packer init .
    ```
5. Build the images defined in the root directory. Before we run the `packer build` command we make `/dev/kvm` world read-writable so that the QEMU builder can use it.

    ```yaml
    - name: Packer Build
      run: |
        sudo chmod o+rw /dev/kvm
        packer build .
    ```
6. Upload the images as GitHub release artifacts. This job only runs for tagged commits.

    ```yaml
    - name: Upload images and their SHA to Github Release
      if: startsWith(github.ref, 'refs/tags/v')
      uses: alexellis/upload-assets@0.4.0
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        asset_paths: '["./artifacts/qemu/*/*"]'
    ```

## Taking it further

We created a GitHub actions workflow that can run a Packer build with QEMU to create a custom Ubuntu image. The resulting `qcow2` image is automatically uploaded to the GitHub release assets on each release.

The released image can be downloaded and used to spin up a VM instance on your private hardware or on different cloud providers.

We exported the image in `qcow2` format but you might need a different image format. The QEMU builder also supports outputting images in `raw` format. In our Packer template the output format can be changed by setting the `format` variable.

Additional tools like the [qemu disk image utility](https://www.qemu.org/docs/master/tools/qemu-img.html) can also be used to convert images between different formats. A [post-processor](https://developer.hashicorp.com/packer/docs/templates/hcl_templates/blocks/build/post-processor) would be the ideal place for these kinds of extra processing steps.

AWS also supports importing VM images and converting them to an AMI so they can be used to launch EC2 instances. See: [Create an AMI from a VM image](https://docs.aws.amazon.com/vm-import/latest/userguide/vmimport-image-import.html)

If you'd like to know more about nested virtualisation support, check out: [How to run KVM guests in your GitHub Actions](/blog/kvm-in-github-actions)

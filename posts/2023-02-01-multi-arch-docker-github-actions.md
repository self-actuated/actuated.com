---
title: The efficient way to publish multi-arch containers from GitHub Actions
description: Learn how to publish container images for both Arm and Intel machines from GitHub Actions.
author: Alex Ellis
tags:
- security
- oss
- multiarch
author_img: alex
image: /images/2023-02-multi-arch/architecture.jpg
date: "2023-02-01"
---

In 2017, I wrote an article on [multi-stage builds with Docker](https://docs.docker.com/build/building/multi-stage/), and it's now part of the Docker Documentation. In my opinion, multi-arch builds were the proceeding step in the evolution of container images.

## What's multi-arch and why should you care?

If you want users to be able to use your containers on different types of computer, then you'll often need to build different versions of your binaries and containers.

The [faas-cli](https://github.com/openfaas/faas-cli) tool is how users interact with [OpenFaaS](https://github.com/openfaas/faas).

It's distributed in binary format for users, with builds for Windows, MacOS and Linux.

* `linux/amd64`, `linux/arm64`, `linux/arm/v7`
* `darwin/amd64`, `darwin/arm64`
* `windows/amd64`

But why are there six different binaries for three Operating Systems? With the advent of Raspberry Pi, M1 Macs (Apple Silicon) and AWS Graviton servers, we have had to start building binaries for more than just Intel systems.

If you're curious how to build multi-arch binaries with Go, you can check out the release process for the open source arkade tool here, which is a simpler example than faas-cli: [arkade Makefile](https://github.com/alexellis/arkade/blob/master/Makefile) and [GitHub Actions publish job](https://github.com/alexellis/arkade/blob/master/.github/workflows/publish.yml)

So if we have to support at least six different binaries for Open Source CLIs, what about container images?

## Do we need multi-arch containers too?

Until recently, it was common to hear people say: "I can't find any containers that work for Arm". This was because the majority of container images were built only for Intel. Docker Inc has done a sterling job of making their "official" images work on different platforms, that's why you can now run `docker run -t -i ubuntu /bin/bash` on a Raspberry Pi, M1 Mac and your regular PC.

Many open source projects have also caught on to the need for multi-arch images, but there are still a few like Bitnami, haven't yet seen value. I think that is OK, this kind work does take time and effort. Ultimately, it's up to the project maintainers to listen to their users and decide if they have enough interest to add support for Arm.

A multi-arch image is a container that will work on two or more different combinations of operating system and CPU architecture.

Typically, this would be:

* `linux/amd64` - "normal" computers made by Intel or AMD
* `linux/arm64` - 64-bit Arm servers like [AWS Graviton](https://docs.aws.amazon.com/whitepapers/latest/aws-graviton-performance-testing/what-is-aws-graviton.html) or [Ampere Altra](https://amperecomputing.com/processors/ampere-altra/)
* `linux/arm/v7` - the 32-bit Raspberry Pi Operating System

So multi-arch is really about catering for the needs of Arm users. Arm hardware platforms like the Ampere Altra come with 80 efficient CPU cores, have a very low TDP compared to traditional Intel hardware, and are available from various cloud providers.

## How do we build multi-arch containers work?

There are a few tools and tricks that we can combine together to take a single Dockerfile and output an image that anyone can pull, which will be right for their machine.

Let's take the: `ghcr.io/inlets-operator:latest` image from [inlets](https://inlets.dev/).

When a user types in `docker pull`, or deploys a Pod to Kubernetes, their local containerd daemon will fetch the manifest file and inspect it to see what SHA reference to use for to download the required layers for the image.

![How manifests work](/images/2023-02-multi-arch/multi-arch.png)

> How manifests work

Let's look at a manifest file with the crane tool. I'm going to use [arkade](https://arkade.dev) to install crane:

```bash
arkade get crane

crane manifest ghcr.io/inlets/inlets-operator:latest
```

You'll see a manifests array, with a platform section for each image:

```json
{
  "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
  "manifests": [
    {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "digest": "sha256:bae8025e080d05f1db0e337daae54016ada179152e44613bf3f8c4243ad939df",
      "platform": {
        "architecture": "amd64",
        "os": "linux"
      }
    },
    {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "digest": "sha256:3ddc045e2655f06653fc36ac88d1d85e0f077c111a3d1abf01d05e6bbc79c89f",
      "platform": {
        "architecture": "arm64",
        "os": "linux"
      }
    }
  ]
}
```

## How do we convert a Dockerfile to multi-arch?

Instead of using the classic version of Docker, we can enable the buildx and Buildkit plugins which provide a way to build multi-arch images.

We'll continue with the Dockerfile from the open source inlets-operator project.

Within [the Dockerfile](https://github.com/inlets/inlets-operator/blob/master/Dockerfile), we need to make a couple of changes.

```diff
- FROM golang:1.18 as builder
+ FROM --platform=${BUILDPLATFORM:-linux/amd64} golang:1.18 as builder

+ ARG TARGETPLATFORM
+ ARG BUILDPLATFORM
+ ARG TARGETOS
+ ARG TARGETARCH
```

The BUILDPLATFORM variable is the native architecture and platform of the machine performing the build, this is usually amd64.

The TARGETPLATFORM is important for the final step of the build, and will normally be injected based upon one each of the platforms you have specified for the build command.

For Go specifically, we also updated the `go build` command to tell Go to use cross-compilation based upon the TARGETOS and TARGETARCH environment variables, which are populated by Docker.

```diff
- go build -o inlets-operator
+ GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -o inlets-operator
```

Here's the full example:

```
FROM --platform=${BUILDPLATFORM:-linux/amd64} golang:1.18 as builder

ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

ARG Version
ARG GitCommit

ENV CGO_ENABLED=0
ENV GO111MODULE=on

WORKDIR /go/src/github.com/inlets/inlets-operator

# Cache the download before continuing
COPY go.mod go.mod
COPY go.sum go.sum
RUN go mod download

COPY .  .

RUN CGO_ENABLED=${CGO_ENABLED} GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
  go test -v ./...

RUN CGO_ENABLED=${CGO_ENABLED} GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
  go build -ldflags "-s -w -X github.com/inlets/inlets-operator/pkg/version.Release=${Version} -X github.com/inlets/inlets-operator/pkg/version.SHA=${GitCommit}" \
  -a -installsuffix cgo -o /usr/bin/inlets-operator .

FROM --platform=${BUILDPLATFORM:-linux/amd64} gcr.io/distroless/static:nonroot

LABEL org.opencontainers.image.source=https://github.com/inlets/inlets-operator

WORKDIR /
COPY --from=builder /usr/bin/inlets-operator /
USER nonroot:nonroot

CMD ["/inlets-operator"]
```

## How to do you configure GitHub Actions to publish multi-arch images?

Now that the Dockerfile has been configured, it's time to start working on the GitHub Action.

This example is taken from the Open Source [inlets-operator](https://github.com/inlets/inlets-operator). It builds a container image containing a Go binary and uses a Dockerfile in the root of the repository. 

View [publish.yaml](https://github.com/inlets/inlets-operator/blob/master/.github/workflows/publish.yaml), adapted for actuated:

```diff
name: publish

on:
  push:
    tags:
      - '*'

jobs:
  publish:
+    permissions:
+      packages: write

-   runs-on: ubuntu-latest
+   runs-on: actuated
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1

+     - name: Setup mirror
+       uses: self-actuated/hub-mirror@master
      - name: Get TAG
        id: get_tag
        run: echo TAG=${GITHUB_REF#refs/tags/} >> $GITHUB_ENV
      - name: Get Repo Owner
        id: get_repo_owner
        run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" > $GITHUB_ENV

+     - name: Set up QEMU
+       uses: docker/setup-qemu-action@v2
+     - name: Set up Docker Buildx
+       uses: docker/setup-buildx-action@v2
      - name: Login to container Registry
        uses: docker/login-action@v2
        with:
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
          registry: ghcr.io

      - name: Release build
        id: release_build
        uses: docker/build-push-action@v3
        with:
          outputs: "type=registry,push=true"
+         platforms: linux/amd64,linux/arm/v6,linux/arm64
          build-args: |
            Version=${{  env.TAG }}
            GitCommit=${{ github.sha }}
          tags: |
            ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ github.sha }}
            ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:${{ env.TAG }}
            ghcr.io/${{ env.REPO_OWNER }}/inlets-operator:latest
```

All of the images and corresponding manifest are published to GitHub's Container Registry (GHCR). The action itself is able to authenticate to GHCR using a built-in, short-lived token. This is dependent on the "permissions" section and "packages: write" being set.

You'll see that we added a `Setup mirror` step, this explained in the [Registry Mirror example](/examples/registry-mirror) and is not required for Hosted Runners.

The `docker/setup-qemu-action@v2` step is responsible for setting up QEMU, which is used to emulate the different CPU architectures.

The `docker/build-push-action@v3` step is responsible for passing in a number of platform combinations such as: `linux/amd64` for cloud, `linux/arm64` for Arm servers and `linux/arm/v6` for Raspberry Pi.

## What if you're not using GitHub Actions?

The various GitHub Actions published by the Docker team are a great way to get started, but if you look under the hood, they're just syntactic sugar for the Docker CLI.

```bash
export DOCKER_CLI_EXPERIMENTAL=enabled

# Have Docker download the latest buildx plugin
docker buildx install

# Create a buildkit daemon with the name "multiarch"
docker buildx create \
    --use \
    --name=multiarch \
    --node=multiarch

# Install QEMU
docker run --rm --privileged \
    multiarch/qemu-user-static --reset -p yes

# Run a build for the different platforms
docker buildx build \
    --platform=linux/arm64,linux/amd64 \
    --output=type=registry,push=true --tag image:tag .
```

For OpenFaaS users, we do all of the above any time you type in `faas-cli publish` and the `faas-cli build` command just runs a regular Docker build, without any of the multi-arch steps.

If you're interested, you can checkout the code here: [publish.go](https://github.com/openfaas/faas-cli/blob/master/commands/publish.go).

## Putting it all together

* CLIs are published for many different combinations of OS and CPU, but containers are usually only required for Linux with an amd64 or Arm CPU.
* Multi-arch images work through a manifest, which then tells containerd which image is needs for the platform it is running on.
* QEMU is a tool for emulating different CPU architectures, and is used to build the images for the different platforms.

In our experience with OpenFaaS, inlets and actuated, once you have converted one or two projects to build multi-arch images, it becomes a lot easier to do it again, and make all software available for Arm servers.

You can learn more about [Multi-platform images](https://docs.docker.com/build/building/multi-platform/) in the Docker Documentation.

*Want more multi-arch examples?*

OpenFaaS uses multi-arch Dockerfiles for all of its templates, and the examples are freely available on GitHub including Python, Node, Java and Go.

See also: [OpenFaaS templates](https://github.com/openfaas/templates)

*A word of caution*

QEMU can be incredibly slow at times when using a hosted runner, where a build takes takes 1-2 minutes can extend to over half an hour. If you do run into that, one option is to check out actuated or another solution, which can build directly on an Arm server with a securely isolated Virtual Machine.

In [How to make GitHub Actions 22x faster with bare-metal Arm](https://actuated.dev/blog/native-arm64-for-github-actions), we showed how we decreased the build time of an open-source Go project from 30.5 mins to 1.5 mins. If this is the direction you go in, you can use a [matrix-build](https://docs.actuated.dev/examples/matrix/) instead of a QEMU-based multi-arch build.

See also: [Recommended bare-metal Arm servers](https://docs.actuated.dev/provision-server/#arm64-aka-aarch64)

---
title: How to add a Software Bill of Materials (SBOM) to your containers with GitHub Actions
description: Learn how to add a Software Bill of Materials (SBOM) to your containers with GitHub Actions in a few easy steps.
author: Alex Ellis
tags:
- security
- oss
- supplychain
- sbom
author_img: alex
image: /images/2023-jan-sbom/list.jpg
date: "2023-01-25"
---

## What is a Software Bill of Materials (SBOM)?

In [April 2022 Justin Cormack, CTO of Docker announced](https://www.docker.com/blog/announcing-docker-sbom-a-step-towards-more-visibility-into-docker-images/) that Docker was adding support to generate a Software Bill of Materials (SBOM) for container images. 

An SBOM is an inventory of the components that make up a software application. It is a list of the components that make up a software application including the version of each component. The version is important because it can be cross-reference with a vulnerability database to determine if the component has any known vulnerabilities.

Many organisations are also required to company with certain Open Source Software (OSS) licenses. So if SBOMs are included in the software they purchase or consume from vendors, then it can be used to determine if the software is compliant with their specific license requirements, lowering legal and compliance risk.

Docker's enhancements to Docker Desktop and their open source Buildkit tool were the result of a collaboration with Anchore, a company that provides a commercial SBOM solution.

## Check out an SBOM for yourself

Anchore provides commercial solutions for creating, managing and inspecting SBOMs, however they also have two very useful open source tools that we can try out for free.

* [syft](https://github.com/anchore/syft) - a command line tool that can be used to generate an SBOM for a container image.
* [grype](https://github.com/anchore/grype) - a command line tool that can be used to scan an SBOM for vulnerabilities.

OpenFaaS Community Edition (CE) is a popular open source serverless platform for Kubernetes. It's maintained by open source developers, and is free to use.

Let's pick a container image from the Community Edition of [OpenFaaS](https://github.com/orgs/openfaasltd/packages) like the container image for the OpenFaaS gateway.

We can browse the GitHub UI to find the latest revision, or we can use Google's crane tool:

```bash
crane ls ghcr.io/openfaas/gateway | tail -n 5
0.26.0
8e1c34e222d6c194302c649270737c516fe33edf
0.26.1
c26ec5221e453071216f5e15c3409168446fd563
0.26.2
```

Now we can introduce one of those tags to syft:

```bash
syft ghcr.io/openfaas/gateway:0.26.2
 ✔ Pulled image            
 ✔ Loaded image            
 ✔ Parsed image            
 ✔ Cataloged packages      [39 packages]
NAME                                              VERSION                               TYPE      
alpine-baselayout                                 3.4.0-r0                              apk        
alpine-baselayout-data                            3.4.0-r0                              apk        
alpine-keys                                       2.4-r1                                apk        
apk-tools                                         2.12.10-r1                            apk        
busybox                                           1.35.0                                binary     
busybox                                           1.35.0-r29                            apk        
busybox-binsh                                     1.35.0-r29                            apk        
ca-certificates                                   20220614-r4                           apk        
ca-certificates-bundle                            20220614-r4                           apk        
github.com/beorn7/perks                           v1.0.1                                go-module  
github.com/cespare/xxhash/v2                      v2.1.2                                go-module  
github.com/docker/distribution                    v2.8.1+incompatible                   go-module  
github.com/gogo/protobuf                          v1.3.2                                go-module  
github.com/golang/protobuf                        v1.5.2                                go-module  
github.com/gorilla/mux                            v1.8.0                                go-module  
github.com/matttproud/golang_protobuf_extensions  v1.0.1                                go-module  
github.com/nats-io/nats.go                        v1.22.1                               go-module  
github.com/nats-io/nkeys                          v0.3.0                                go-module  
github.com/nats-io/nuid                           v1.0.1                                go-module  
github.com/nats-io/stan.go                        v0.10.4                               go-module  
github.com/openfaas/faas-provider                 v0.19.1                               go-module  
github.com/openfaas/faas/gateway                  (devel)                               go-module  
github.com/openfaas/nats-queue-worker             v0.0.0-20230117214128-3615ccb286cc    go-module  
github.com/prometheus/client_golang               v1.13.0                               go-module  
github.com/prometheus/client_model                v0.2.0                                go-module  
github.com/prometheus/common                      v0.37.0                               go-module  
github.com/prometheus/procfs                      v0.8.0                                go-module  
golang.org/x/crypto                               v0.5.0                                go-module  
golang.org/x/sync                                 v0.1.0                                go-module  
golang.org/x/sys                                  v0.4.1-0.20230105183443-b8be2fde2a9e  go-module  
google.golang.org/protobuf                        v1.28.1                               go-module  
libc-utils                                        0.7.2-r3                              apk        
libcrypto3                                        3.0.7-r2                              apk        
libssl3                                           3.0.7-r2                              apk        
musl                                              1.2.3-r4                              apk        
musl-utils                                        1.2.3-r4                              apk        
scanelf                                           1.3.5-r1                              apk        
ssl_client                                        1.35.0-r29                            apk        
zlib                                              1.2.13-r0                             apk  
```

These are all the components that syft found in the container image. We can see that it found 39 packages, including the OpenFaaS gateway itself.

Some of the packages are Go modules, others are packages that have been installed with `apk` (Alpine Linux's package manager).

## Checking for vulnerabilities

Now that we have an SBOM, we can use grype to check for vulnerabilities.

```bash
grype ghcr.io/openfaas/gateway:0.26.2
 ✔ Vulnerability DB        [no update available]
 ✔ Loaded image            
 ✔ Parsed image            
 ✔ Cataloged packages      [39 packages]
 ✔ Scanned image           [2 vulnerabilities]
NAME                        INSTALLED  FIXED-IN  TYPE       VULNERABILITY   SEVERITY 
google.golang.org/protobuf  v1.28.1              go-module  CVE-2015-5237   High      
google.golang.org/protobuf  v1.28.1              go-module  CVE-2021-22570  Medium  
```

In this instance, we can see there are only two vulnerabilities, both of which are in the `google.golang.org/protobuf` Go module, and neither of them have been fixed yet.

* As the maintainer of OpenFaaS CE, I could try to eliminate the dependency from the original codebase, or wait for a workaround to be published by its vendor.
* As a consumer of OpenFaaS CE my choices are similar, and it may be worth trying to look into the problem myself to see if the vulnerability is relevant to my use case.
* Now, for OpenFaaS Pro, a commercial distribution of OpenFaaS, where source is not available, I'd need to contact the vendor OpenFaaS Ltd and see if they could help, or if they could provide a workaround. Perhaps there would even be a paid support relationship and SLA relating to fixing vulnerabilities of this kind? 

With this scenario, I wanted to show that different people care about the supply chain, and have different responsibilities for it.

## Generate an SBOM from within GitHub Actions

The examples above were all run locally, but we can also generate an SBOM from within a GitHub Actions workflow. In this way, the SBOM is shipped with the container image and is made available without having to scan the image each time.

Imagine you have the following Dockerfile:

```
FROM alpine:3.17.0

RUN apk add --no-cache curl ca-certificates

CMD ["curl", "https://www.google.com"]
```

I know that there's a vulnerability in alpine 3.17.0 in the OpenSSL library. How do I know that? I recently updated every OpenFaaS Pro component to use `3.17.1` to fix a specific vulnerability.

Now a typical workflow for this Dockerfile would look like the below:

```yaml
name: build

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

permissions:
  actions: read
  checks: write
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
          registry: ghcr.io

      - name: Publish image
        uses: docker/build-push-action@v3
        with:
          build-args: |
            GitCommit=${{ github.sha }}
          outputs: "type=registry,push=true"
          tags: |
            ghcr.io/alexellis/gha-sbom:${{ github.sha }}
```

Upon each commit, an image is published to GitHub's Container Registry with the image name of: `ghcr.io/alexellis/gha-sbom:SHA`.

To generate an SBOM, we just need to update the `docker/build-push-action` to use the `sbom` flag:

```yaml
      - name: Local build
        id: local_build
        uses: docker/build-push-action@v3
        with:
          sbom: true
          provenance: false
```

By checking the logs from the action, we can see that the image has been published with an SBOM:

```bash
#16 [linux/amd64] generating sbom using docker.io/docker/buildkit-syft-scanner:stable-1
#0 0.120 time="2023-01-25T15:35:19Z" level=info msg="starting syft scanner for buildkit v1.0.0"
#16 DONE 1.0s
```

The SBOM can be viewed as before:

```bash
syft ghcr.io/alexellis/gha-sbom:46bc16cb4033364233fad3caf8f3a255b5b4d10d@sha256:7229e15004d8899f5446a40ebdd072db6ff9c651311d86e0c8fd8f999a32a61a

grype ghcr.io/alexellis/gha-sbom:46bc16cb4033364233fad3caf8f3a255b5b4d10d@sha256:7229e15004d8899f5446a40ebdd072db6ff9c651311d86e0c8fd8f999a32a61a
 ✔ Vulnerability DB        [updated]
 ✔ Loaded image            
 ✔ Parsed image            
 ✔ Cataloged packages      [21 packages]
 ✔ Scanned image           [2 vulnerabilities]
NAME        INSTALLED  FIXED-IN  TYPE  VULNERABILITY  SEVERITY 
libcrypto3  3.0.7-r0   3.0.7-r2  apk   CVE-2022-3996  High      
libssl3     3.0.7-r0   3.0.7-r2  apk   CVE-2022-3996  High  
```

The image: `alpine:3.17.0` contains two High vulnerabilities, and from reading the notes, we can see that both have been fixed.

We can resolve the issue by changing the Dockerfile to use `alpine:3.17.1` instead, and re-running the build.

```bash
grype ghcr.io/alexellis/gha-sbom:63c6952d1ded1f53b1afa3f8addbba9efa37b52b
 ✔ Vulnerability DB        [no update available]
 ✔ Pulled image            
 ✔ Loaded image            
 ✔ Parsed image            
 ✔ Cataloged packages      [21 packages]
 ✔ Scanned image           [0 vulnerabilities]
No vulnerabilities found
```

## Wrapping up

There is a lot written on the topic of supply chain security, so I wanted to give you a quick overview, and how to get started wth it.

We looked at Anchore's two open source tools: Syft and Grype, and how they can be used to generate an SBOM and scan for vulnerabilities.

We then produced an SBOM for a pre-existing Dockerfile and GitHub Action, introducing a vulnerability by using an older base image, and then fixing it by upgrading it. We did this by adding additional flags to the `docker/build-push-action`. We added the sbom flag, and set the provenance flag to false. Provenance is a separate but related topic, which is explained well in an article by Justin Chadwell of Docker (linked below).

I maintain an Open Source alternative to brew for developer-focused CLIs called [arkade](https://arkade.dev/). This already includes Google's crane project, and there's a [Pull Request coming shortly to add Syft and Grype to the project](https://github.com/alexellis/arkade/issues/839).

It can be a convenient way to install these tools on MacOS, Windows or Linux:

```bash
# Available now
arkade get crane

# Coming shortly
arkade get syft grype
```

> In the beginning of the article we mentioned license compliance. SBOMs generated by syft do not seem to include license information, but in my experience, corporations which take this risk seriously tend to run their own scanning infrastructure [with commercial tools like Blackduck](https://www.synopsys.com/software-integrity/security-testing/software-composition-analysis.html)

See also:

* [Announcing Docker SBOM: A step towards more visibility into Docker images- Justin Cormack](https://www.docker.com/blog/announcing-docker-sbom-a-step-towards-more-visibility-into-docker-images/)
* [Generating SBOMs for Your Image with BuildKit - Justin Chadwell](https://www.docker.com/blog/generate-sboms-with-buildkit/)
* [Anchore on GitHub](https://github.com/anchore)

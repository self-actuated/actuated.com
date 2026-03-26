---
title: How we cut GitLab build times from 10 minutes to under 4
description: Learn how we shaved over 50% build time from a .NET build vs. GitLab's managed runners.
tags:
- gitlab
- performance
author_img: alex
# image: /images/2025-10-q4-announcements/background.png
date: "2026-03-26"
---

Everyone's been there. Builds start off fast and get slower over time, until you're staring at a 30-minute job and wondering what went wrong. That's no different with GitLab, where hosted and Kubernetes-based runners are the default option.

We recently took a call with a team at an online trading platform. Their average build time was about 10 minutes, and they wanted to claw back at least 2 minutes. Whilst we didn't have access to their proprietary code, we did find and build a real-world e-commerce project called [nopCommerce](https://github.com/nopsolutions/nopcommerce).

On GitLab.com's hosted runners, the build took 9m50s, which made it a reasonable proxy for the kind of build they were dealing with. We managed to get that build running in 3m59s, saving roughly 6 minutes.

Across a team with 250 developers, that's roughly 67 eight-hour working days saved every month.

This matters even more now that AI agents can generate code faster than humans can read or review it.

![Almost 10 min build time with GitLab's medium runner](/images/2026-03-gitlab-dotnet/gitlab_medium.png)
> Almost 10 min build time with GitLab's medium runner

![Our fastest run with actuated on bare-metal, just under 4 minutes](/images/2026-03-gitlab-dotnet/actuated_hetzner.png)
> Our fastest run with actuated on bare-metal, just under 4 minutes

Our fastest run for the unmodified code was 4m42s just by switching to actuated and a bare-metal server from Hetzner. We managed to drop a further 43 seconds by applying an optimisation that is not available for Kubernetes runners, and out of reach for most teams, with a final build time of 3m59s.

| GitLab.com | Actuated bare-metal | Actuated bare-metal optimized |
|------------|-----|----|
| 9m50s | 4m42s | 3m59s|

The source code for the project is available on our public GitLab group: [https://gitlab.com/actuated/nopcommerce-ci-demo/](https://gitlab.com/actuated/nopcommerce-ci-demo/).

## Laying the foundations

When teams deploy to Kubernetes or ECS in production, they tend to build and publish container images using Docker or BuildKit. The nopCommerce sample app already had a Dockerfile, which made for a good start.

We put together a basic GitLab CI pipeline with three stages, with a waterfall approach:

* Build - build within a .NET Core container image, to catch high-level errors
* Test - test within a .NET Core container image
* Docker - providing the build and test jobs completed, an image is built with Docker

We left off the publish step because it adds a variable amount of time depending on the networking. We wanted to focus on the straight-line speed with as few variables as possible.

```yaml
# nopCommerce CI/CD Pipeline
# Expected total time: ~8-12 minutes
#
# Breakdown:
#   build:    ~4-6 min (restore + full solution with 28 plugins)
#   test:     ~2-3 min (NUnit test suite with SQLite in-memory)
#   docker:   ~2-3 min (multi-stage Docker build)

stages:
  - build
  - test
  - docker

variables:
  DOTNET_CLI_TELEMETRY_OPTOUT: "true"
  DOTNET_NOLOGO: "true"
  SOLUTION_DIR: "src"
  CONFIGURATION: "Release"

# ---------------------------------------------------------------------------
# Stage 1: Restore + Build the entire solution (Release configuration)
# Restore and build are combined because NuGet packages are stored in the
# global packages folder (~/.nuget/packages) which cannot be shared between
# jobs via artifacts.
# ---------------------------------------------------------------------------
build:
  stage: build
  image: mcr.microsoft.com/dotnet/sdk:9.0-alpine
  tags:
    - saas-linux-medium-amd64
  script:
    - echo "Restoring NuGet packages and building nopCommerce solution (${CONFIGURATION})..."
    - dotnet build -c ${CONFIGURATION} ${SOLUTION_DIR}
  artifacts:
    paths:
      - ${SOLUTION_DIR}/**/bin/
      - ${SOLUTION_DIR}/**/obj/
    expire_in: 1 hour

# ---------------------------------------------------------------------------
# Stage 2: Run NUnit tests with SQLite in-memory database
# Tests cover Core, Data, Services, and Web layers
# ---------------------------------------------------------------------------
test:
  stage: test
  image: mcr.microsoft.com/dotnet/sdk:9.0-alpine
  tags:
    - saas-linux-medium-amd64
  needs:
    - job: build
      artifacts: true
  script:
    - echo "Running test suite..."
    - dotnet test --no-build -c ${CONFIGURATION} --verbosity normal ${SOLUTION_DIR}
  artifacts:
    when: always
    reports:
      junit: ${SOLUTION_DIR}/**/TestResults/*.xml

# ---------------------------------------------------------------------------
# Stage 3: Build Docker image
# Multi-stage Dockerfile: builds the entire solution inside Docker
# ---------------------------------------------------------------------------
docker:
  stage: docker
  image: docker:latest
  tags:
    - saas-linux-medium-amd64
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  needs:
    - job: test
  script:
    - echo "Building Docker image..."
    - docker build -t nopcommerce:${CI_COMMIT_SHORT_SHA} -t nopcommerce:latest .
    - docker images nopcommerce
```

For each test run, we changed the tags from `saas-linux-medium-amd64` to `actuated-4cpu-8gb`.

The actuated agent starts an ephemeral microVM per build, which gets registered against the project, and performs only a single build.

This tends to take around 1-2 seconds from the event being published by GitLab to seeing a build running.

So most of the savings came simply from switching from GitLab's hosted runners to actuated and a machine we set up to build projects under our group.

## Finding more speed

If you look carefully, there's a flaw built into every GitLab job.

On Kubernetes, the runner itself is running within a container already, then yet another container is started `docker:dind` with a nested Docker engine running within that. Unfortunately, to make that happen privileged Pods are required, which GitLab itself warns about during installation.

On top of that, not only are they insecure by default, but they're slow because the native filesystem used by Docker and container runtimes, `overlayfs`, does not work when nested. So the worst possible storage driver gets used: VFS.

Unlike `overlayfs`, which is a high-performance Copy on Write (CoW) filesystem, VFS copies every file it touches, which as you can see amounted to at least 40 seconds of wasted I/O. Builds tend to be heavy on I/O, so you get the worst of both worlds.

With actuated, GitLab's runner starts inside a microVM, with a dedicated OS and systemd available. There's no nesting of Docker, a private Docker daemon runs directly alongside the runner.

We can access this via a `shell` executor step instead of a container step. It avoids downloading the large `docker:dind` image, avoids the overhead of having to start a second Docker daemon, and avoids using the VFS filesystem.

```yaml
# ---------------------------------------------------------------------------
# Stage 3: Build Docker image
# Multi-stage Dockerfile: builds the entire solution inside Docker
# ---------------------------------------------------------------------------
docker:
  stage: docker
  tags:
    - actuated-16cpu-32gb
    - shell
  needs:
    - job: test
  before_script:
    - curl -fsSL https://get.docker.com | sh
  script:
    - echo "Building Docker image..."
    - docker build -t nopcommerce:${CI_COMMIT_SHORT_SHA} -t nopcommerce:latest .
    - docker images nopcommerce
```

So that one change clawed back 30-40s of build time.

Everything else was kept the same.

Our full table of results can be found below:

**Actuated Runners**

| CPU | RAM | Duration | vs GitLab Small | Notes |
|---|---|---|---|---|
| 16 | 32GB | 3m 59s | 60% faster | Shell executor for docker build |
| 16 | 32GB | 4m 42s | 52% faster | Docker executor |
| 8 | 16GB | 5m 01s | 49% faster | Docker executor |
| 4 | 16GB | 5m 06s | 48% faster | Docker executor |

**GitLab's Hosted Runners**

| CPU | RAM | Duration | vs GitLab Small |
|---|---|---|---|
| 4 | 16GB | 7m 21s | 25% faster |
| 2 | 8GB | 9m 50s | baseline |

## Further work

Caching is the obvious next step.

Actuated runs a pull-through Docker registry on every server, so any image used in your CI pipeline only gets pulled from the Internet once, or when it changes, saving on bandwidth and time.

To take things further, we could look at caching layers from the docker build itself, either to the GitLab server, to a co-located S3 bucket, or an S3 server running directly on the host. We took this approach for [Discourse's builds on GitHub Actions](https://actuated.com/blog/local-caching-for-github-actions) and saw further improvements.

To recap on differences from Kubernetes-based runners:

* No more managing Kubernetes clusters just for CI
* Keep your existing GitLab pipelines with minimal changes
* Run privileged tasks like `sudo`, `apt-get`, Docker, and K3s without compromising security
* Avoid Docker-in-Docker/VFS overhead with the shell executor
* Get faster build and job startup times on bare metal
* Start every jobs almost instantly in a fresh ephemeral microVM
* Adjust vCPU / RAM for every job through labels i.e. `actuated-1cpu-2gb` up to `actuated-32cpu-128gb`

Your mileage may vary depending on where the bottlenecks are for your builds. If you've already tried the obvious things and feel like there's more improvement to be had, [talk to us](https://forms.gle/8XmpTTWXbZwWkfqT6). We'd be glad to see if Actuated would be a good fit for your team.

> Actuated runners are **48–60% faster** than GitLab's small hosted runner. Even the actuated runner (4cpu) outperforms the GitLab medium runner (4cpu) by over 2 minutes — a **31% improvement** with matching specs.

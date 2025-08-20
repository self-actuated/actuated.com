---
title: Introducing Burstable CPU Jobs
description: Burstable CPU jobs request a minimum amount of vCPU to allocate, but will take more if available on a given server.
tags:
- efficiency
- burstable
- scheduling
author_img: alex
image: /images/2025-08-burstable-cpu/background.png
date: "2025-08-20"
---

We introduce Burstable CPU jobs which allow for a minimum amount of vCPU to be set for any job, but more is allocated if available.

We'll also give you a reminder of other smart labels for more advanced scheduling like the `actuated-any-` label which can be used to allocate work to x86_64 or arm64 depending on availability to improve overall efficiency and resource utilization.

As a tl;dr:

Before: `actuated-32cpu-32gb` - a job would remain queued until a machine with 32vCPU was available 

After: `actuated-24cpu-32gb-burstable` - a job will take as many vCPU as are available on a host, but will run with fewer so long as 24 are available at a minimum.

## Impatiently Building Kernels

This new feature solves a problem we ran into when building many variations of the Linux Kernel on a finite set of servers.

Our largest x86_64 server is an A102 from Hetzner which has 32vCPU and 128GB of RAM. It can produce a fully-featured Kernel in around 3min30s when all of the 32vCPUs are allocated to that single job.

So when we need to rebuild 4-5 variations of that Kernel, our jobs get queued up and run in serial.

### Option 1 - Buy more servers

The simplest solution is to purchase additional A102 servers from Hetzner, however our needs are sporadic and don't warrant having high-specification hardware sat idle 99% of the time.

### Option 2 - Lower the vCPU allocation

At the same time, we recently purchased an Acemagic F3A Mini PC which has 24vCPU which run at a clock speed that almost matches the A102.

We could simply lower the vCPU allocation so that every Kernel job can run on either the A102 or the F3A, but that would result in a performance penalty when building a single Kernel. That may not be noticeable in automated builds, but it severely impacts the developer experience when we have to iterate on new Kernel versions or find a missing `CONFIG_` setting.

### Option 3 - Burstable CPU Jobs

The third option gives us the best both worlds. We get to specify a minimum vCPU amount i.e. `24` and some extra metadata, in this instance a `-burstable` label means that our scheduler will allocate additional vCPUs if they are available on a server during scheduling.

Old behaviour:

The job label is `actuated-32cpu-32gb` and can only run on the A102. The F3A is idle, and we have no parallel Kernel builds.

New behaviour:

The job label is changed to `actuated-24cpu-32gb-burstable`.

The first job runs on the A102, and subsequent jobs run on the F3A.

If we had a third mini PC enrolled into our account with i.e. 12vCPU, we could change the label to `actuated-12cpu-32gb-burstable` and have a maximum of three Kernel builds running at any one time.

## Wrapping up

The new burstable feature works for both x86_64 and arm64 builds. It's a convenient way to squeeze more out of your existing servers whilst only trading off performance during busy times.

**Did you know about the `actuated-any` label?**

In a similar vein to Burstable CPU, in 2023 we introduced an `actuated-any` prefix for jobs that could run on either x86_64 or arm64 architectures, allowing for even greater flexibility in job scheduling.

This is ideal for automation and jobs which use interpreted languages like Python or Node, that can run on either architecture without modification.

```yaml
name: check-pull-requests

on:
  push:
    branches:
      - master
      - main
  workflow_dispatch:

permissions:
  actions: read

jobs:
  check-pull-requests:
    name: check-pull-requests
    runs-on: actuated-any-1cpu-2gb
    steps:
        - uses: actions/checkout@v5
        - name: Check Pull Requests in Repository
          run: |
            echo "Checking for open pull requests..."
            npm run check-pull-requests
```

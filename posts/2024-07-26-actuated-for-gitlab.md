---
title: Secure your GitLab jobs with microVMs and Actuated
description: Learn how microVMs provide more flexibility and security for CI workloads, by removing the need for privileged containers or Docker In Docker.
tags:
- gitlab
- security
- docker
author_img: welteki
date: "2024-07-26"
---

Last year we introduced a [tech preview for Actuated for GitLab CI](/blog/secure-microvm-ci-gitlab). Actuated reduces management overheads of self-hosted runners and provides a secure, ephemeral microVM for every job.

Since the initial preview a lot of features have been added. In this article we will give you an overview of some of the available features and how they can benefit your GitLab CI.

- [Introduction](#introduction)
- [Run jobs in microVMs with Actuated](#run-jobs-in-microvms-with-actuated)
- [Mixed docker and shell executors](#mixed-docker-and-shell-executors)
- [Private peering](#private-peering)

## Introduction

It can be challenging to run GitLab CI/CD jobs that build and publish Docker images or jobs that require extensive system access in a safe way. Docker-in-Docker (DIND) requires the docker executor to run containers in privileged mode. Using the shell executor would give a job full access to the runner host and network. They can also leave behind side effects between builds as the runner is reused.

Using both approaches causes a significant security concern and the [GitLab runner security docs](https://docs.gitlab.com/runner/security/) warn against it.

![Docker in Docker security notice printed out by the GitLab helm chart](/images/2024-07-gitlab/chart-warning.png)
> Security notice displayed by the GitLab Helm chart to explain why docker in docker is disabled by default for security purposes.

With Actuated, jobs run in ephemeral microVMs using Linux KVM for secure isolation. After the job is completed, the VM will be destroyed and removed from the GitLab instance. This allows us to safely run DIND and the shell executor in a fresh isolated environment for each job.

There are no horrible Kernel tricks or workarounds required to be able to use user namespaces, no need to change your tooling from what developers love - Docker, to Kaninko or Buildah or similar. You have `sudo` access and full VM with systemd available, things like Kubernetes will also work out of the box if you need them for end to end testing.

![GitLab UI showing Actuated project runners](/images/2024-07-gitlab/project-runners.png)
> Runners get automatically added to a project and are removed again when they finish running a job.

## Run jobs in microVMs with Actuated

When a pipeline is triggered through a commit, merge request or in the UI the Actuated control plane gets notified through a webhook. For every job we schedule and run a new microVM and register it as a runner to the project. After the job is completed, the VM will be destroyed and removed from the GitLab instance. Scheduling and launching VMs is very fast. On average a new VM is booting up and running the job within 1 second.

![actuated for GitLab CI](/images/2023-06-gitlab-preview/conceptual.png)

To run jobs on Actuated the `actuated` tag has to be added to a job. One feature our customers like is the ability to configure the VM size for a job through the tag. Using the tag `actuated-4cpu-8gb` will schedule a VM with 4 vCPUs and 8 gigabytes of RAM.

You can pick any combination for vCPU and RAM. There's no need to pick a predefined runner size. This means that runners can be sized accordingly for the job they need to run so that the available CPU and memory resources can be used more efficiently.

Example `.gitlab-ci.yaml` that runs a job on Actuated runners using the docker executor:

```yaml
image: ruby:2.7
services:
  - postgres:9.3

before_script:
  - bundle install
test:
  script:
    - bundle exec rake spec
  tags:
    - actuated-4cpu-8gb
```

## Mixed Docker and Shell executors

GitLab supports a number of executors to run builds in different environments. With Actuated we support running jobs with the [docker](https://docs.gitlab.com/runner/executors/docker.html) and [shell](https://docs.gitlab.com/runner/executors/shell.html) executor.

There is no need to pre-configure the type of executors you want to use. Actuated allows you to quickly select the executor for a job by adding an additional tag. Adding the `shell` tag to a job will launch a VM and register the GitLab runners using the shell executor. If no tag is provided the docker executor is used by default.

```yaml
build-job:
  stage: build
  script:
    - echo "Hi $GITLAB_USER_LOGIN!"
  tags:
    - actuated-2cpu-4gb
    - shell
```

With Actuated the shell executor can be used securely without leaving side effects behind that can influence job execution. A clean isolated build environment is provided for every job since the GitLab runner is started on an ephemeral VM that is removed as soon as the job has completed.

Using the shell executor in an isolated VM lets you safely run workloads like:

- Jobs that benefit from or need hardware acceleration e.g. the android emulator.
- Jobs that require extensive system access.
- Run a k3s cluster in CI for E2E testing.

These kinds of jobs can be difficult to run in a docker container or would require the container to run in privileged mode which is unsafe and advised against in [GitLab runner security guidelines](https://docs.gitlab.com/runner/security/#usage-of-docker-executor).

Since jobs run in ephemeral VMs with Actuated it is also possible to run the docker executor safely in privileged mode. If you are already using the docker executor in privileged mode Actuated can improve the security of your jobs without making changes to your existing pipelines.

The following `.gitlab-ci.yaml` runs two jobs. The first job uses the docker executor to build and push a container image for an OpenFaaS function with Docker and the faas-cli. The second job sets the additional `shell` tag to request Actuated to run the job with the shell executor. By running the jobs with the shell executor we get access to the full ephemeral VM that is launched for the job. This makes it easy to bootstrap a K3s Kubernetes cluster with [k3sup](https://github.com/alexellis/k3sup) for E2E testing the function with OpenFaaS.

```yaml
stages:
  - push
  - e2e

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERT_DIR: ""

push_job:
  stage: push
  image: docker:latest
  before_script:
    # Install dependencies: faas-cli
    - apk add --no-cache git curl
    - if [ -f "./faas-cli" ] ; then cp ./faas-cli /usr/local/bin/faas-cli || 0 ; fi
    - if [ ! -f "/usr/local/bin/faas-cli" ] ; then apk add --no-cache curl git &&
      curl -sSL https://cli.openfaas.com |
      sh && chmod +x /usr/local/bin/faas-cli &&
      cp /usr/local/bin/faas-cli ./faas-cli ; fi
  script:
    - echo $CI_JOB_TOKEN | docker login $CI_REGISTRY \
        -u $CI_REGISTRY_USER \
        --password-stdin

    # Build and push an OpenFaaS function
    - /usr/local/bin/faas-cli template pull stack
    - /usr/local/bin/faas-cli publish

  tags:
    - actuated-4cpu-8gb

e2e_job:
  stage: e2e
  before_script:
    # Install dependencies: faas-cli kubectl kubectx k3sup
    - curl -SLs https://get.arkade.dev | sh
    - export PATH=$PATH:$HOME/.arkade/bin/
    - arkade get faas-cli kubectl kubectx k3sup --progress=false
  script:
    # Deploy a K3s cluster.
    - |
      mkdir -p ~/.kube/
      k3sup install --local --local-path ~/.kube/config
      k3sup ready
    - kubectl get nodes

    # Install OpenFaaS on the local cluster.
    - mkdir -p ~/.openfaas && echo $OPENFAAS_LICENSE > ~/.openfaas/LICENSE
    - |
      arkade install openfaas \
        --license-file ~/.openfaas/LICENSE \
        --operator \
        --clusterrole \
        --jetstream \
        --autoscaler
      kubectl get secret -n openfaas
      echo $OPENFAAS_LICENSE | wc
    - kubectl create secret docker-registry gitlab-ci-pull \
        --docker-server=$CI_REGISTRY \
        --docker-username=$CI_REGISTRY_USER \
        --docker-password=$CI_JOB_TOKEN \
        --docker-email=docker@example.com \
        --namespace openfaas-fn
    - kubectl rollout status -n openfaas deploy/gateway --timeout=60s
    - |
      kubectl port-forward -n openfaas svc/gateway 8080:8080 &>/dev/null &
      echo -n "$!" > kubectl-pid.txt

      echo PID for port-fowarding: $(cat kubectl-pid.txt)

    - faas-cli ready --attempts 120

    - |
      kubectl patch serviceaccount \
        -n openfaas-fn default \
        -p '{"imagePullSecrets": [{"name": "gitlab-ci-pull"}]}'

    # Deploy the function that we build and pushed in the previous stage.
    - |
      echo $(kubectl get secret \
        -n openfaas basic-auth \
        -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo) |
      faas-cli login --username admin --password-stdin
    - faas-cli template pull stack
    - CI_REGISTRY=$CI_REGISTRY CI_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA faas-cli deploy

    # Test the OpenFaaS function by invoking it.
    - faas-cli ready bcrypt
    - curl -i http://127.0.0.1:8080/function/bcrypt -d ""

    - kill -9 "$(cat kubectl-pid.txt)"

  tags:
    - actuated-4cpu-8gb
    - shell
```

## Private peering

Actuated allows you to host your runners wherever you want, in the public cloud or on premise in your own data center. This means that in some cases it can be difficult to expose the Actuated agent when your servers are behind a corporate firewall or have no inbound internet access.

One of our enterprise customers was running into this issue. To allow them to quickly deploy agents in different networks within their organisations we released private peering for the agent. When peering is enabled the client makes an outbound connection to the Actuated control plane and does not rely on any inbound data path.

Agent peering simplifies agent setup and improves security:

- No additional setup, firewall or routing rule changes required.
- The agent is exposed privately to the Actuated control plane.
- All traffic between the agent and the control plane is encrypted.

![Private peering diagram](/images/2024-07-gitlab/peering.png)

> Peering example for an enterprise with two agents within their own private firewalls.

## Wrapping up

We highlighted some of the features and benefits of running GitLab CI jobs on Actuated runners:

- Secure isolated builds in ephemeral microVMs.
- Fixed cost & Less management.
- Easy on demand mixed use of Docker and Shell executors.
- Optimised usage of available runners.
- Easy setup in complex network environments.

Actuated for GitLab is for self-hosted GitLab instances hosted on-premise or on the public cloud.

[Talk to us](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform), if you would like to see how Actuated can improve your GitLab CI.

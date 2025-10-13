---
title: Fast and Secure Jenkins Builds with Firecracker
description: Learn about our new plugin to make Jenkins builds faster, more secure, and easier to manage.
tags:
- jenkins
- enterprise
- cicd
- security
- docker
- kubernetes
author_img: alex
image: /images/2025-10-slicer-jenkins/background.png
date: "2025-10-13"
---

In this post, we'll introduce actuated's new Firecracker plugin for Jenkins and why you should consider it over the existing plugins for Docker, Kubernetes, EC2, or GCE.   

To say that [Jenkins](https://en.wikipedia.org/wiki/Jenkins_(software)) is a staple in the CI/CD world would be an understatement. This project was first released under the name [Hudson](https://en.wikipedia.org/wiki/Hudson_(software)) in 2004 as a side project by Kohsuke Kawaguchi while working at Sun Microsystems. It has since evolved into one of the most widely used automation and build tools in the industry.

Just as when the World Wide Web was in its infancy, TLS termination and encrypted messages were the stuff of fiction - so were highly privileged daemons like Docker, and specialised tasks like building and loading Kernel modules into a build environment. Build environments were rarely immutable, ephemeral or hermetic.

In 2025 there are now a range of ways to make the build environment for Jenkins known as a "slave" or by more modern terminology a "runner" - ephemeral and less prone to side-effects. Whilst not natively implemented in Jenkins, the Docker, Kubernetes, GCE and EC2 plugins all provide a way to launch a build environment that is isolated from the Jenkins master and other builds.

But there are limits and tradeoffs to these approaches.

**Kubernetes Plugin**

I was recently speaking to a friend at jFrog which has a large self-hosted instance of Jenkins. He told me that using the [Kubernetes executor](https://plugins.jenkins.io/kubernetes/), there were delays of between 1 and 5 minutes for each job, and that Pods had to run in privileged mode to allow Docker-in-Docker builds. This is a significant security risk, and one that many organisations are not comfortable with.

![Kubernetes plugin](/images/2025-10-slicer-jenkins/k8s-plugin.png)
> The Kubernetes plugin is inherently vulnerable to privilege escalation attacks when using a Privileged Pod or containers with root.

Scaling: Can request new nodes as required via Cluster Autoscaler, but this can add 1-2 minutes to launch time.
Speed: Slow, in real world scenarios this can take 1-5 minutes to launch a Pod.
Security: Medium if no Pod is allowed to run as root, or access Docker in any way. More usual rating is Low - all Pods run as root or a privileged Pod.

In high concurrency scenarios - Kubernetes rate-limits Pod launches. I just got off the phone with a customer who regularly launches 400-500 concurrent builds and couldn't understand why GitHub's Kubernetes solution could take up to 10 minutes to schedule all of the builds.

The readability of Kubernetes pipeline syntax is challenging and custom container images are required, which need to kept up to date (something that many teams struggle with).

```
podTemplate(
  agentContainer: 'maven',
  agentInjection: true,
  containers: [
    containerTemplate(name: 'maven', image: 'maven:3.9.9-eclipse-temurin-17'),
    containerTemplate(name: 'golang', image: 'golang:1.16.5', command: 'sleep', args: '99d')
  ]) {

    node(POD_LABEL) {
        stage('Get a Maven project') {
            git 'https://github.com/jenkinsci/kubernetes-plugin.git'
            container('maven') {
                stage('Build a Maven project') {
                    sh 'mvn -B -ntp clean install'
                }
            }
        }

        stage('Get a Golang project') {
            git url: 'https://github.com/hashicorp/terraform.git', branch: 'main'
            container('golang') {
                stage('Build a Go project') {
                    sh '''
                    mkdir -p /go/src/github.com/hashicorp
                    ln -s `pwd` /go/src/github.com/hashicorp/terraform
                    cd /go/src/github.com/hashicorp/terraform && make
                    '''
                }
            }
        }

    }
}
```

**Docker Plugin**

If you've ever touched Jenkins for work, then you're likely familiar with the [Docker plugin](https://www.jenkins.io/doc/book/pipeline/docker/). It can either create a container for each build, or use a long-running container as a build environment. The former is more secure, but can be slow to start up, especially if the image is large or needs to be pulled from a remote registry. The latter is faster, but can lead to side-effects building up over time and is vulnerable to malware, unintentional changes, and ransomware attacks

![Docker plugin](/images/2025-10-slicer-jenkins/docker-plugin.png)
> The Docker plugin is a misnomer, sharing a Docker Socket, running in Privileged mode, or exposing a TCP socket means there are no boundaries or isolation between the builds and the host.

Whilst working with Intel on their CI/CD infrastructure, an engineer shared the woes of trying to get Docker itself to work within a build slave due to incompatible settings between Docker on the host and within Jenkins.

Docker runs as root, with the socket mounted, or exposed over TCP (even worse).

Scaling: By default scales across only one host - difficult to cluster and use a dynamic pool of hosts.
Security: Low. Docker is running as root, the socket is mounted or exposed over TCP.

The Docker Pipeline plugin is slightly less verbose than the Kubernetes plugin, but suffers from the same issue. These pinned images tend to get out of date quickly, and need to be maintained. Enterprise companies are also likely to customise them for their own needs further exacerbating the problem.

```
pipeline {
    agent {
        docker {
            image 'maven:3.9.9-eclipse-temurin-21'
            args '-v $HOME/.m2:/root/.m2'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn -B'
            }
        }
    }
}
```

**EC2 / GCE Plugins**

These plugins can run in one-shot or reusable modes. In the one-shot mode, you get a new VM launched which lasts for just one job, but it has a tradeoff. It takes at least 1 minute to launch the most stripped down minimal VM on [AWS EC2](https://plugins.jenkins.io/ec2/), so job queue times are likely to be high. In reusable mode, the VM is kept alive for a period of time, and can be reused for multiple jobs. This is faster, but can lead to side-effects building up over time making it as bad as the long-running Docker container approach.

Scaling: If set to one-shot mode, a new host is created for each build 1-2 minutes of lead time. In reusable mode (default) a host is reused for multiple builds until it becomes idle and can then be terminated.
Speed: Slow - at least 1 minute to launch a minimal VM.
Security: (If configured for one VM per job) High. VMs are isolated from each other, and can be launched with minimal privileges. Low if reused.
Configuration: Complex - requires managing AMIs, SSH keys, and network configuration. Many configuration options for the plugin to get it to work "right".

**Summing up issues with existing plugins**

* Slow to boot fresh environments
* Likely runs as root, with a Privileged Pod or Docker socket mounted
* Side-effects build up over time
* Complex configuration
* In high concurrency scenarios - Kubernetes rate-limits Pod launches
* Difficult to maintain custom images and infrastructure required for the plugins to work

Beware of the copious amounts of guides on sites like Medium.com and Dev.to that encourage you to take shortcuts and set up long-running, reusable build slaves. It's not 2004 anymore, and this approach is fraught with risk.

For a deeper dive into why the CNCF and Ampere choose Actuated and Firecracker for building OSS projects over GitHub's own supported solution, read: [How secure are containers & Kubernetes vs. microVMs for self-hosted CI?](https://actuated.com/blog/how-secure-are-containers-vs-microvms-ci).

## A Next-Gen Approach

Compared to the approaches above, which all feel like retrofits to an architecture built in the early 2000s, Firecracker is a modern, lightweight virtualisation technology that was open-sourced by AWS in 2018. It is designed to run serverless workloads and container workloads with minimal overhead, and provides strong isolation between workloads.

![Firecracker architecture](/images/2025-10-slicer-jenkins/slicer-plugin.png)
> Pictured: The Jenkins plugin for Slicer makes two REST calls over HTTP to start up two VMs for the requested builds.

**The CNCF and Ampere Computing choose Actuated over Kubernetes**

If you've heard of our work with actuated, then you'll know that the [CNCF and Ampere Computing partnered to choose Actuated](https://amperecomputing.com/blogs/ampere-computing-and-cncf-supporting-arm-native-ci-for-ncf-projects) instead of GitHub's own Actions Runtime Controller (ARC) to run GitHub Actions for top-tier CNCF projects needing Arm compute. Over a period of 18 months, over 3 million CI jobs were run for Open Telemetry, runc, containerd, etcd, and many others.

Why? Primarily, ARC means managing a Kubernetes cluster with highly privileged Pods, so that common tools like Docker can be used in CI jobs. It has limitations to what will run - so you can't build and load a Kernel module like you can in Firecracker. You can't run a Kubernetes cluster to test your images - not safely, and not quickly. Docker in Docker relies on the VFS plugin aka "native snapshotter" which is up to 5-10x slower than overlayfs.

Firecracker has a headline of being able to launch a microVM in 125ms, but anyone who has used it for real world tasks knows that it'll be a good 1s to boot up a full build image with systemd and Docker preinstalled. Not at all shabby compared to the alternatives explored above.

So Firecracker, or microVMs more broadly give us:

* Full isolation of every build
* Fast start up time - 1s even with a bloated build image containing systemd, Docker, and other common build tools
* Run Docker and Kubernetes as root without risk
* Run apt-get, yum, dnf, zypper, etc with no side-effects
* Build, and load Kernel modules without risk or compatibility issues with the host
* Run untrusted code safely

## Introducing the Slicer Plugin for Jenkins by Actuated.com

Instead of adding Jenkins support directly to actuated, we took a slightly different approach. We span out the internals of actuated into a general purpose VM orchestrator tool called [SlicerVM.com](https://slicervm.com). Then, we built a native Java plugin for a Cloud implementation just like the EC2, GCE, and Kubernetes plugins that launches microVMs on demand.

This was not a task for the feint of heart - for one it requires extensive use of Java, and two many undocumented and mysterious Jenkins-specific APIs, which run into race conditions and other oddities.

So for our friend working at an enterprise company, where Jenkins is firmly rooted and likely to be just as entrenched within the next 5 years, this plugin provides a way to run builds in microVMs with the mentioned benefits of lower queued times, running privileged commands the normal way - apt/dnf/yum/zypper, Docker, Kubernetes, etc.

That's enough about how it works and why it's better, let's see it in action on YouTube:

<iframe width="560" height="315" src="https://www.youtube.com/embed/LSUVBGfzf3s?si=Ise4t8vbMuX8ss_b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

To get started, you need one or more machines capable of running KVM, with a Linux OS installed. We recommend Ubuntu Server LTS, however other RHEL-like operating systems also work.

You can use bare-metal in the cloud (i.e. Hetzner), or within your own datacenter, or within a VM where nested virtualisation is available i.e. VMware, OpenStack, or Azure, GCE, DigitalOcean, Oracle Cloud, etc.

For teams that are only able to procure from AWS, the options for bare-metal are a bit more limited, but we are starting work to make [KVM-PVM](https://blog.alexellis.io/how-to-run-firecracker-without-kvm-on-regular-cloud-vms/) more broadly available to our customers so you can run KVM with pagetable isolation on existing EC2 instances.

**Example pipeline builds**

Pipeline builds need no specific changes other than a build agent label, so that the plugin knows when a new microVM is required.

Example build using Docker:

```
pipeline {
  agent { label 'slicer'}
  options { timeout(time: 2, unit: 'MINUTES') }
  
  stages {
    stage('Build') { steps { sh '''
sudo systemctl start docker
docker run -i alpine:latest ping -c 4 google.com
    ''' } }
  }
}
```

Example End to End test using Kubernetes:

```
pipeline {
  agent { label 'slicer'}
  options { timeout(time: 2, unit: 'MINUTES') }
  
  stages {
    stage('Build') { steps { sh '''
export PATH=$PATH:$HOME/.arkade/bin

arkade get k3sup kubectl --progress=false

export KUBECONFIG=`pwd`/kubeconfig

k3sup install --local --no-extras
k3sup ready --attempts 5 --pause 100ms

kubectl get nodes -o wide
kubectl get pods -A -o wide
''' } }
  }

}
```

We used K3sup to setup the cluster, but kubeadm, KinD, minikube, K3d, minikube, Openshift's CRC, or any other local Kubernetes solution will work in exactly the same way.

Just like with actuated, custom VM sizes can be allocated without creating predefined sets: `slicer-2cpu-gb` or `slicer-8cpu-16gb` for example.

You can also customise the image to pre-install Docker, the latest JVM version, or whatever tooling you're used to obtaining from your in-house golden images.

## Next steps

To try out Slicer for Jenkins, sign up for a personal or commercial subscription at [SlicerVM.com](https://slicervm.com) and let us know that you'd like to receive the plugin. Each server requires a seat, however there is no limit on how large you want to make your server, so one machine can run a significant number of concurrent builds.

If it's too early for you to embark on a self-service Proof Of Concept, then you can [contact us for more a brief call and demo via Zoom](https://forms.gle/8XmpTTWXbZwWkfqT6). The form mentions GitHub Actions, so feel free to use the free text box to let us know you're interested in Jenkins support.

### Glossary

What's KVM?

[KVM](https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine) is a Linux kernel module that allows the kernel to function as a hypervisor. It requires a CPU with hardware virtualisation extensions such as Intel VT-x or AMD-V. KVM can also run on many cloud or on-premises VMs where nested virtualisation is enabled.

What's KVM-PVM?

[KVM-PVM](https://blog.alexellis.io/how-to-run-firecracker-without-kvm-on-regular-cloud-vms/) is a patch led by Alibaba Cloud and Ant Group which allows KVM to run with pagetable isolation on CPUs without hardware virtualisation extensions.

What's Firecracker?

[Firecracker](https://firecracker-microvm.github.io/) is an open-source virtualisation technology that runs lightweight microVMs with minimal overhead. It was open-sourced by AWS in 2018 and is used to run AWS services like Lambda and Fargate.

What's actuated?

[Actuated.com](https://actuated.com) is a managed service for running GitHub Actions and other CI/CD workloads in Firecracker microVMs. You Bring Your Own Cloud (BYOC) and it handles the orchestration, scaling, image management, and security of your runners.

What's Slicer?

[SlicerVM.com](https://slicervm.com) was spun out of actuated to provide a general purpose YAML or API-driven orchestration tool for Firecracker. You can use it launch one-shot tasks like CI runners, or long-lived services like Kubernetes, web-servers, databases, etc.

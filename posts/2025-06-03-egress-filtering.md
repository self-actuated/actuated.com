---
title: Egress Filtering for CI to mitigate data exfiltration
description: Egress filtering is a security measure that restricts outbound traffic from your CI environment, preventing data exfiltration and ensuring that sensitive information remains secure.
tags:
- security
- containers
- firecracker
- egress
author_img: alex
image: /images/2025-06-egress/background.png
date: "2025-06-03"
---

We take at how to implement egress filtering in a CI environment, without relying on a solution that runs within the job itself. This approach is particularly useful for preventing data exfiltration and ensuring that sensitive information remains secure.

## Introduction

In a time where high-street names, large retailers and airlines are regularly experiencing global outages due to cyber attacks, organisations are asking themselves how they can better protect their data and systems.

The rise of malware, cyber attacks, and ransomware are becoming a major concern for organizations - and rightly so. A single successful attack can lead to significant financial losses, reputational damage, and legal consequences. A notable [example in the UK is the brand M&S](https://www.bbc.co.uk/news/articles/c93llkg4n51o), which ii likely to suffer disruption to last until July and will cost £300m (approx 400m USD).

It's not just big brands - malware is increasingly being included in the software supply chain such as [the xz incident](https://www.akamai.com/blog/security-research/critical-linux-backdoor-xz-utils-discovered-what-to-know), [malicious packages in PyPy](https://unit42.paloaltonetworks.com/malicious-packages-in-pypi/), and [npm](https://www.sonatype.com/blog/multiple-crypto-packages-hijacked-turned-into-info-stealers).

Typically, we would consider a language like Go to be a safe choice, however it is also not immune and has been a target for data exfiltration attacks and [more recently disk wiping](https://thehackernews.com/2025/05/malicious-go-modules-deliver-disk.html).

So what's the answer? There are many - from runtime security measure, to static analysis, to careful control over what software and base images are used within a job.

But many of these measures rely on software executing within the job itself, which means that there is potential for the job to be compromised before the security measures are applied. This is where egress filtering with actuated comes in.

## Egress Filtering with Actuated

Actuated is a CI solution that provides a secure and ephemeral microVM for each job whether that's for GitHub.com or GitLab CI users.

With a container-based CI solution, you may typically need to run a Kubernetes cluster, and then run a set of long-lived containers within that, which can be compromised over time by side-effects of previous job runs. You may consider using a tool like Istio to implement egress filtering, but it will often get in the way of your other workloads or control-plane components within the cluster.

Not to mention the complexity of setting up and maintaining such a system, and the inherent risk of [running containers as privileged or mounting a Docker socket](/posts/2024-10-23-how-secure-are-containers-vs-microvms-ci/).

The Actuated agent is a lightweight process that runs on a Linux host and is responsible for managing the lifecycle of the microVMs. It provides a secure environment for each job, ensuring that the job runs in isolation and cannot access any sensitive information or resources outside of its own environment.

[![](https://docs.actuated.com/images/conceptual-high-level.png)](https://docs.actuated.com/#watch-a-live-demo)
> The Actuated agent starts a microVM for each job, which is isolated from the host and other jobs. All network access has to go through a special Linux bridge. 

All network traffic from the microVM is routed through a network bridge, which means we can apply policies and control the traffic that is allowed to leave the microVM. This allows us to implement egress filtering without relying on software running within the job itself.

Example of HTTPS filtering for an allowed domain:

![Allowed](/images/2025-06-egress/transparent-https.png)
> Pictured: HTTPS request is allowed to egress when it matches the whitelist, otherwise it is blocked. The agent also applies DNS filtering to prevent data exfiltration.

For a domain that's not in the list:

![Not allowed](/images/2025-06-egress/transparent-https.png)
> Pictured: The request to a domain which is not on the whitelist is blocked by the agent, preventing the malware from accessing the remote endpoint.

### The whitelist

The most practical form of filtering bans all outgoing TCP and UDP traffic, then allows only a sub-set of whitelisted domains to be accessed, ideally without involving a costly enterprise-grade intercepting HTTPS proxy server such as [Cisco Umbrella](https://umbrella.cisco.com/solutions/web-content-filtering) or [Zscaler](https://www.zscaler.com/).

Egress filtering is not for the feint of heart, it requires careful consideration of the traffic that is allowed to leave the microVM - and a basic GitHub Actions job that only prints "Hello World" may genuinely need to access up to 10-20 different domains just to run and publish its built-in telemetry.

![Audit-only mode](/images/2025-06-egress/egress.jpeg)
> Pictured: a build that starts a K3s cluster, something which is not possible on Kubernetes without resorting to privileged containers or mounting the Docker socket.

A practical whitelist may look like this for a very minimal build:

*`/etc/actuated-egress/whitelist.yaml`*

```yaml
allowed_domains:
  - api.github.com
  - gitlab.com
  - github.com
  - google.com
  - archive.ubuntu.com
  - security.ubuntu.com
  - '*.actions.githubusercontent.com'
  - checkip.amazonaws.com
  - '*.blob.core.windows.net'
  - raw.githubusercontent.com
  - codeload.github.com
  - objects.githubusercontent.com
  - deb.nodesource.com
  - download.docker.com
  - trafficmanager.net
  - a2z.com
# Custom entries for our usage
  - get.arkade.dev
  - openfaas-live.actuated.dev
  - "*.o6s.io"
  - "*.openfaas.com" 
```

To build the list, you can set actuated to run in audit-only mode.

*`/etc/default/actuated-egress`*

```
AUDIT_MODE="true"
COREFILE="/etc/coredns/Corefile"
WHITELIST="/etc/actuated-egress/whitelist.yaml"
LOGS_PATH="/var/log/actuated-egress"
```

Instead of blocking traffic not present within the whitelist, it will log the domains accessed to a file in: `/var/log/actuated-egress`.

You can then run a well-known job, gather the list of domains, assess them one-by-one and add any required.

Then flip the `AUDIT_MODE` to `false` and restart the agent - at this point, you can try to run the job again to see if it works as expected.

### 80/20 principle

Whilst you could purchase a costly web-filtering solution such as the ones mentioned above to look at layer 7 traffic - this requires that every process in the job is proxy-aware, and can be configured to use a HTTP proxy. That's not often the case with Linux-based software, and it is a serious pain to configure.

Instead, we can rely on actuated's transparent HTTPS proxying and DNS filtering to provide a solid level of protection against data exfiltration, without overwhelming the user with configuration.

First, all traffic outgoing from the VM is blocked and denied by default.

Then, all traffic to port 80 and 443 is transparently redirected to actuated's agent, which applies the whitelist we've already explored.

Next, ICMP, UDP and other non-TCP traffic is blocked by default, and then DNS traffic is again, re-routed to actuated's agent, which applies the same whitelist to the DNS queries.

This means, that if an npm package, PiPy package, or Go module tries to access a domain that is not on the whitelist to exfiltrate a credential or source code, it will be blocked by the agent.

### Conclusion

When you combine a ephemeral microVM with egress filtering, you can create a secure CI environment that is resistant to many kinds of data exfiltration and malware attacks.

Unlike with containers and Kubernetes, the one-shot microVMs used by actuated have their own guest Kernel so they can run Docker, Kubernetes, even custom Kernel modules without any risk to the host or other jobs.

Then a default deny for all outgoing network traffic, combined with restrictive whitelisting of domains applies the 80/20 principle to egress filtering, allowing you to run jobs without needing to configure a complex proxy or web-filtering solution.

If you'd like to talk to us or find out more: [contact us here](https://actuated.com/pricing).

You can watch a demo below of the filtering in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/L1iOmwquNVg?si=H9xxBe6mvC5F5V1Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


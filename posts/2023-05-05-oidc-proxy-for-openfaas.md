---
title: Keyless deployment to OpenFaaS with OIDC and GitHub Actions
description: We're announcing a new OIDC proxy for OpenFaaS for keyless deployments from GitHub Actions.
author: Alex Ellis
tags:
- oidc
- githubactions
- security
- federation
- iam
author_img: alex
image: /images/2023-05-openfaas-oidc-proxy/background.png
date: "2023-05-05"
---

In 2021, GitHub released [OpenID Connect (OIDC)](https://openid.net/connect/) support for CI jobs running under GitHub Actions. This was a huge step forward for security meaning that any GitHub Action could mint an OIDC token and use it to securely federate into another system without having to store long-lived credentials in the repository.

I wrote a prototype for OpenFaaS shortly after the announcement and a deep dive explaining how it works. I used [inlets](https://inlets.dev/blog/2022/11/16/automate-a-self-hosted-https-tunnel.html) to set up a HTTPS tunnel, and send the token to my machine for inspection. Various individuals and technical teams have used my content as [a reference guide](https://twitter.com/mlbiam/status/1653391969110900741?s=20) when working with GitHub Actions and OIDC.

See the article: [Deploy without credentials with GitHub Actions and OIDC](https://blog.alexellis.io/deploy-without-credentials-using-oidc-and-github-actions/)

Since then, custom actions for GCP, AWS and Azure have been created which allow an OIDC token from a GitHub Action to be exchanged for a short-lived access token for their API - meaning you can manage cloud resources securely. For example, see: [Configuring OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) - we have actuated customers who use this approach to deploy to ECR from their self-hosted runners without having to store long-lived credentials in their repositories.

## Why OIDC is important for OpenFaaS customers

Before we talk about the new OIDC proxy for OpenFaaS, I should say that [OpenFaaS Enterprise](https://openfaas.com/pricing) *also has* an IAM feature which includes OIDC support for the CLI, dashboard and API. It supports any trusted OIDC provider, not just GitHub Actions. Rather than acting as a proxy, it actually implements a full fine-grained authorization and permissions policy language that resembles the one you'll be used to from AWS.

However, not everyone needs this level of granularity.

[Shaked, the CTO of Kubiya.ai](https://il.linkedin.com/in/shaked-askayo-18403714a) is an [OpenFaaS](https://openfaas.com/) & [inlets](https://inlets.dev) customer. His team at [Kubiya](https://kubiya.ai) is building a conversational AI for DevOps - if you're ever tried ChatGPT, imagine that it was hooked up to your infrastructure and had superpowers. On a recent call, he told me that their team now has 30 different repositories which deploy OpenFaaS functions to their various AWS EKS clusters. That means that a secret has to be maintained at the organisation level and then consumed via `faas-cli login` in each job.

It gets a little worse for them - because different branches deploy to different OpenFaaS gateways and to different EKS clusters.

In addition to managing various credentials for each cluster they add - they were uncomfortable with exposing all of their functions on the Internet.

So today the team working on actuated is releasing a new OIDC proxy which can be deployed to any OpenFaaS cluster to avoid the need to manage and share long-lived credentials with GitHub.

![Conceptual design of the OIDC proxy for OpenFaaS](/images/2023-05-openfaas-oidc-proxy/conceptual.png)
> Conceptual design of the OIDC proxy for OpenFaaS

**About the OIDC proxy for OpenFaaS**

* It can be deployed via Helm
* Only allows access to a given set of GitHub organisations
* Uses a standard Ingress record
* It only accepts OIDC tokens signed from GitHub Actions
* It only allows requests to the `/system` endpoints of the OpenFaaS REST API - keeping your functions safe

Best of all, unlike OpenFaaS Enterprise, it's free for all actuated customers - whether they're using OpenFaaS CE, Standard or Enterprise.

Here's what Shaked had to say about the new proxy:

> That's great - thank you! Looking forward to it as it will simplify our usage of the openfaas templates and will speed up our development process
> Shaked, CTO, Kubiya.ai

## How to deploy the proxy for OpenFaaS

Here's what you need to do:

* Install OpenFaaS on a Kubernetes cluster
* Create a new DNS A or CNAME record for the Ingress to the proxy i.e. `oidc-proxy.example.com`
* Install the OIDC proxy using Helm
* Update your GitHub Actions workflow to use the OIDC token

> My cluster is not publicly exposed on the Internet, so I'm using an [inlets tunnel](https://inlets.dev/blog/2022/11/16/automate-a-self-hosted-https-tunnel.html) to expose the OIDC Proxy from my local KinD cluster. I'll be using the domain `minty.exit.o6s.io` but you'd create something more like `oidc-proxy.example.com` for your own cluster.

First Set up your values.yaml for Helm:

```yaml
# The public URL to access the proxy
publicURL: https://oidc-proxy.example.com

# Comma separated list of repository owners for which short-lived OIDC tokens are authorized.
# For example: alexellis,self-actuated
repositoryOwners: 'alexellis,self-actuated'
ingress:
    host: oidc-proxy.example.com
    issuer: letsencrypt-prod
```

The chart will create an Ingress record for you using an existing issuer. If you want to use something else like Inlets or Istio to expose the OIDC proxy, then simply set `enabled: false` under the `ingress:` section.

Then run:

```bash
helm repo add actuated https://self-actuated.github.io/charts/
helm repo update

helm upgrade --install actuated/openfaas-oidc-proxy \
    -f ./values.yaml
```

For the full setup - [see the README for the Helm chart](https://github.com/self-actuated/charts/tree/master/chart/openfaas-oidc-proxy)

You can now go to one of your repositories and update the workflow to authenticate to the REST API via an OIDC token.

In order to get an OIDC token within a build, add the `id_token: write` permission to the permissions list.

```yaml
name: keyless_deploy

on:
  workflow_dispatch:
  push:
    branches:
    - '*'
jobs:
  keyless_deploy:
    permissions:
      contents: 'read'
      id-token: 'write'
```
Then set `runs-on` to `actuated` to use your faster actuated servers:

```diff
-   runs-on: ubuntu-latest
+   runs-on: actuated
```

Then in the workflow, install the OpenFaaS CLI:

```yaml
steps:
    - uses: actions/checkout@master
    with:
        fetch-depth: 1
    - name: Install faas-cli
    run: curl -sLS https://cli.openfaas.com | sudo sh
```

Then get a token:

```yaml
- name: Get token and use the CLI
    run: |
        OPENFAAS_URL=https://minty.exit.o6s.io
        OIDC_TOKEN=$(curl -sLS "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=$OPENFAAS_URL" -H "User-Agent: actions/oidc-client" -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN")
        JWT=$(echo $OIDC_TOKEN | jq -j '.value')
```

Finally, use the token whenever you need it by passing in the `--token` flag to any of the `faas-cli` commands:

```yaml
faas-cli list -n openfaas-fn --token "$JWT"
faas-cli ns --token "$JWT"
faas-cli store deploy printer --name p1 --token "$JWT"

faas-cli describe p1 --token "$JWT"
```

Since we have a lot of experience with GitHub Actions, we decided to make the above simpler by creating a custom [Composite Action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action). If you check out the code for [self-actuated/openfaas-oidc](https://github.com/self-actuated/openfaas-oidc) you'll see that it obtains a token, then writes it into an openfaaas config file, so that the `--token` flag isn't required.

Here's how it changes:

```yaml
- uses: self-actuated/openfaas-oidc@v1
  with: 
    gateway: https://minty.exit.o6s.io
- name: Check OpenFaaS version
  run: |
    OPENFAAS_CONFIG=$HOME/.openfaas/
    faas-cli version
```

Here's the complete example:

```yaml
name: federate

on:
  workflow_dispatch:
  push:
    branches:
    - '*'
jobs:
  auth:
    # Add "id-token" with the intended permissions.
    permissions:
      contents: 'read'
      id-token: 'write'

    runs-on: actuated
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: Install faas-cli
        run: curl -sLS https://cli.openfaas.com | sudo sh
      - uses: self-actuated/openfaas-oidc@v1
        with:
          gateway: https://minty.exit.o6s.io

      - name: Get token and use the CLI
        run: |
          export OPENFAAS_URL=https://minty.exit.o6s.io
          faas-cli store deploy env --name http-header-printer
          faas-cli list
```

How can we be sure that our functions cannot be invoked over the proxy?

Just add an extra line to test it out:

```yaml
      - name: Get token and use the CLI
        run: |
          export OPENFAAS_URL=https://minty.exit.o6s.io
          faas-cli store deploy env --name http-header-printer
          sleep 5

          echo | faas-cli invoke http-header-printer
```

![A failed invocation over the proxy](/images/2023-05-openfaas-oidc-proxy/failed-invoke.png)
> A failed invocation over the proxy

Best of all, now that you're using OIDC, you can now go and delete any of those long lived basic auth credentials from your secrets!

## Wrapping up

The new OIDC proxy for OpenFaaS is available for all actuated customers and works with OpenFaaS CE, Standard and Enterprise. You can use it on as many clusters as you like, whilst you have an active subscription for actuated at no extra cost.

In a short period of time, you can set up the Helm chart for the OIDC proxy and no longer have to worry about storing various secrets in GitHub Actions for all your clusters, simply obtain a token and use it to deploy to any cluster - securely. There's no risk that your functions will be exposed on the Internet, because the OIDC proxy only works for the `/system` endpoints of the OpenFaaS REST API.

**An alternative for those who need it**

[OpenFaaS Enterprise](https://openfaas.com/pricing) has its own OIDC integration with much more fine-grained permissions implemented. It means that team members using the CLI, Dashboard or API do not need to memorise or share basic authentication credentials with each other, or worry about getting the right password for the right cluster.

An OpenFaaS Enterprise policy can restrict all the way down to read/write permissions on a number of namespaces, and also integrates with OIDC.

See an example:

* [OpenFaaS Enterprise - IAM with GitHub Actions](https://docs.openfaas.com/openfaas-pro/iam/github-actions-federation/)
* [OpenFaaS Enterprise - IAM with GitLab](https://docs.openfaas.com/openfaas-pro/iam/gitlab-federation/)

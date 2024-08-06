---
title: How to develop a great CLI with Go
description: "Alex shares his insights from building half a dozen popular Go CLIs. Which can you apply to your projects?"
tags:
- images
- packer
- qemu
- kvm
author_img: alex
image: /images/2023-08-great-cli/background.png
date: "2023-08-22"
---

Is your project's CLI growing with you? I'll cover some of the lessons learned writing the OpenFaaS, actuated, actions-usage, arkade and k3sup CLIs, going as far back as 2016. I hope you'll find some ideas or inspiration for your own projects - either to start them off, or to improve them as you go along.

> Just starting your journey, or want to go deeper?
> 
> You can master the fundamentals of Go (also called Golang) with my [eBook Everyday Golang](https://store.openfaas.com/l/everyday-golang), which includes chapters on Go routines, HTTP clients and servers, text templates, unit testing and crafting a CLI. If you're on a budget, I would recommend checkout out the official [Go tour](https://go.dev/tour/), too.

## Introduction

The earliest CLI I wrote was for OpenFaaS, called [faas-cli](https://github.com/openfaas/faas-cli). It's a client for a REST API exposed over HTTP, and I remember how it felt to add the first command *list functions*, then one more, and one more, until it was a fully working CLI with a dozen commands.

But it started with one command - something that was useful to us at the time, that was to list the available functions.

The initial version used Go's built-in flags parser, which is rudimentary, but perfectly functional.

```
faas-cli -list
faas-cli -describe
faas-cli -deploy
```

Over time, you may outgrow this simple approach, and drift towards wanting sub-commands, each with their own set of options.

An early contributor [John McCabe](https://github.com/johnmccabe) introduced me to [Cobra](https://github.com/spf13/cobra) and asked if he could convert everything over.

```
faas-cli list
faas-cli describe
faas-cli deploy
```

Now each sub-command can have its set of flags, and even sub-commands in the case of `faas-cli secret list/create/delete`

[actions-usage](https://github.com/self-actuated/actions-usage) is a free analytics tool we wrote for GitHub Actions users to iterate GitHub's API and summarise your usage over a certain period of time. It's also written in Go, but because it's mostly single-purpose, it'll probably never need sub-commands.

```
actions-usage -days 28 \
    -token-file ~/pat.txt \
    -org openfaasltd
```

Shortly after launching the tool for teams an open-source organisations, we had a feature request to run it on individual user accounts.

That meant switching up some API calls and adding new CLI flags:

```
actions-usage -days 7 \
    -token-file ~/pat.txt \
    -user alexellis
```

We then got a bit clever and started adding some extra reports and details, you can see what it looks in the article [Understand your usage of GitHub Actions](/blog/github-actions-usage-cli)

## What's new for actuated-cli

I'm very much a believer in a Minimal Viable Product (MVP). If you can create some value or utility to users, you should ship it as early as possible, especially if you have a good feedback loop with them.

A quick note about the [actuated-cli](https://github.com/self-actuated/actuated-cli), it's main use-cases are to:

* List the runners for an organisation
* List the queued or in-progress jobs for an organisation
* Update a remote server, or get the logs from a VM or the agent service

### No more owner flags

The `actuated-cli` was designed to work on a certain organisation, but it meant extra typing, so wherever possible, we've removed the flag completely.

```
actuated-cli runners --owner openfaasltd
```

becomes:

```
actuated-cli runners
```

How did we do this? We determine the intersection of organisations for which your account is authorized, and which are enrolled for actuated. It's much less typing and it's more intuitive.

### The host flag became a positional argument

This was another exercise in reducing typing. Let's say we wanted to upgrade the agent for a certain host, we'd have to type:

```
actuated-cli upgrade --owner openfaasltd --host server-1
```

By looking at the "args" slice, instead of for a specific command, we can assume that any text after the flags is always the server name:

```
actuated-cli upgrade --owner openfaasltd server-1
```

### Token management

The actuated CLI uses a GitHub personal access token to authenticate with the API. This is a common pattern, but it's not always clear how to manage the token.

We took inspiration from the `gh` CLI, which is a wrapper around the GitHub API.

The `gh` CLI has a `gh auth` command which can be used to obtain a token, and save it to a local file, then any future usage of the CLI will use that token.

Before, you had to create a Personal Access Token in the GitHub UI, then copy and paste it into a file, and decide where to put it, and what to name it. What's more, if you missed a permission, then the token wouldn't work.

```
actuated-cli --token ~/pat.txt
```

Now, you simply run:

```
actuated-cli auth
```

And as you saw from the previous commands, there's no longer any need for the `--token` flag. Unless of course, you want to supply it, then you can.

A good way to have a default for a flag, and then an override, is to use the Cobra package's `Changed()` function. Read the default, unless `.Changed()` on the `--token` or `--token-value` flags return `true`.

### The `--json` flag

From early on, I knew that I would want to be able to pipe output into .jq, or perhaps even do some scripting. I've seen this in `docker`, `kubectl` and numerous other CLI tools written in Go.

```
actuated-cli runners --json | jq '.[] | .name'

"m1m1"
"m1m2"
"of-epyc-lon1"
```

The JSON format also allows you to get access to certain fields which the API call returns, which may not be printed by the default command's text-based formatter:

```
|         NAME         |  CUSTOMER   |   STATUS    | VMS  | PING  |   UP    | CPUS |   RAM   | FREE RAM | ARCH  |                 VERSION                  |
|----------------------|-------------|-------------|------|-------|---------|------|---------|----------|-------|------------------------------------------|
| of-epyc-lon1         | openfaasltd | running     | 0/5  | 7ms   | 6 days  |   48 | 65.42GB | 62.85GB  | amd64 | 5f702001a952e496a9873d2e37643bdf4a91c229 |
```

Instead, we get:

```json
[  {
    "name": "of-epyc-lon1",
    "customer": "openfaasltd",
    "pingNano": 30994998,
    "uptimeNano": 579599000000000,
    "cpus": 48,
    "memory": 65423184000,
    "memoryAvailable": 62852432000,
    "vms": 0,
    "maxVms": 5,
    "reachable": true,
    "status": "running",
    "agentSHA": "5f702001a952e496a9873d2e37643bdf4a91c229",
    "arch": "amd64"
  }
]
```

### SSH commands and doing the right thing

Actuated has a [built-in SSH gateway](https://docs.actuated.dev/tasks/debug-ssh/), this means that any job can be debugged - whether running on a hosted or self-hosted runner, just by editing the workflow YAML.

Add the following to the `- steps:` section, and the `id_token: write` permission, and your workflow will pause, and then you can connect over SSH using the CLI or the UI.

```yaml
    - uses: self-actuated/connect-ssh@master
```

There are two sub-commands:

* `actuated-cli ssh list` - list the available SSH sessions
* `actuated-cli ssh connect` - connect to an available session

Here's an example of having only one connection:

```
actuated-cli ssh list
| NO  |   ACTOR   |   HOSTNAME    | RX | TX | CONNECTED |
|-----|-----------|---------------|----|----|-----------|
|   1 | alexellis | fv-az1125-168 |  0 |  0 | 32s       |
```

Now how do you think the `ssh connect` command should work?

Here's the most obvious way:

```
actuated-cli ssh connect --hostname fv-az1125-168
```

This is a little obtuse, since we only have one server to connect to, we can improve it for the user, with:

```
actuated-cli ssh connect
```

That's right, we do the right thing, the obvious thing.

Then when there is more than one connection, instead of adding two flags `--no` or `--hostname`, we can simply take the positional argument:

```
actuated-cli ssh connect 1
actuated-cli ssh connect fv-az1125-168
```

Are there any places where you could simplify your own CLI?

Read the source code here: [ssh_connect.go](https://github.com/self-actuated/actuated-cli/blob/master/cmd/ssh_connect.go)

### The `--verbose` flag

We haven't made any use of the `--verbose` flag yet in the CLI, but it's a common pattern which has been used in `faas-cli` and various others. Once your output gets to a certain width, it can be hard to view in a terminal, like the output from the previous command.

To implement `--verbose`, you should reduce the columns to the absolute minimum to be useful, so maybe we could give up the Version, customer, ping, and CPUs columns in the standard view, then add them back in with `--verbose`.

### Table printing

As you can see from the output of the commands above, we make heavy usage of a table printer.

You don't necessarily need a 3rd-party table printer, Go has a fairly good "tab writer" which can create nicely formatted code:

```
faas-cli list -g https://openfaas.example.com
Function                        Invocations     Replicas
bcrypt                          9               1    
figlet                          0               1    
inception                       0               1    
nodeinfo                        2               1    
ping-url                        0               1  
```

You can find the standard [tabwriter package](https://pkg.go.dev/text/tabwriter) here.

Or try out the [tablewriter](https://github.com/olekukonko/tablewriter) package by Olekukonko. We've been able to make use of it in [arkade](https://arkade.dev) too - a free marketplace for developer tools.

See usage in arkade here: [table.go](https://github.com/alexellis/arkade/blob/master/pkg/get/table.go#L19)

See usage in actuated-cli's SSH command here: [ssh_ls.go](https://github.com/self-actuated/actuated-cli/blob/master/cmd/ssh_ls.go)

## Progress bars

One thing that has been great about having open-source CLIs, is that other people make suggestions and help you learn about new patterns.

For arkade, [Ramiro from Okteto](https://twitter.com/rberrelleza) sent a PR to add a progress bar to show how long remained to download a big binary like the Kubernetes CLI.

```bash
arkade get kubectl
Downloading: kubectl
Downloading: https://storage.googleapis.com/kubernetes-release/release/v1.24.2/bin/linux/amd64/kubectl

15.28 MiB / 43.59 MiB [------------------------>____________________________________] 35.05%
```

It's simple, but gives enough feedback to stop you from thinking the program is stuck. In my Human Design Interaction course at university, I learned that anything over 7s triggers uncertainty in an end-user.

See how it's implemented: [download.go](https://github.com/alexellis/arkade/blob/master/pkg/get/download.go#L191)

## HTTP and REST are not the only option

When I wrote [K3sup](https://github.com/alexellis/k3sup), a tool to install K3s on remote servers, I turned to SSH to automate the process. So rather than making HTTP calls, a Go library for SSH is used to open a connection and run remote commands.

It also simplifies an annoying post-installation task - managing the kubeconfig file. By default this is a protected file on the initial server you set up, k3sup will download the file and merge it with your local kubeconfig.

```
k3sup install \
    --host HOST1 \
    --user ubuntu \
    --merge \
    --local-path ~/.kube/config
```

I'd recommend trying out [golang.org/x/crypto/ssh](https://pkg.go.dev/golang.org/x/crypto/ssh) in your own CLIs and tools. It's great for automation, and really simple to use.

## Document everything as best as you can

Here's an example of a command with good documentation:

```
Schedule additional VMs to repair the build queue.
Use sparingly, check the build queue to see if there is a need for 
more VMs to be launched. Then, allow ample time for the new VMs to 
pick up a job by checking the build queue again for an in_progress
status.

Usage:
  actuated-cli repair [flags]

Examples:
  ## Launch VMs for queued jobs in a given organisation
  actuated repair OWNER

  ## Launch VMs for queued jobs in a given organisation for a customer
  actuated repair --staff OWNER


Flags:
  -h, --help    help for repair
  -s, --staff   List staff repair

Global Flags:
  -t, --token string         File to read for Personal Access Token (default "$HOME/.actuated/PAT")
      --token-value string   Personal Access Token
```

Not only does it show example usage, so users can understand *what can be done*, but it has a detailed explanation of when to use the command.

```golang
	cmd := &cobra.Command{
		Use:   "repair",
		Short: "Schedule additional VMs to repair the build queue",
		Long: `Schedule additional VMs to repair the build queue.
Use sparingly, check the build queue to see if there is a need for 
more VMs to be launched. Then, allow ample time for the new VMs to 
pick up a job by checking the build queue again for an in_progress
status.`,
		Example: `  ## Launch VMs for queued jobs in a given organisation
  actuated repair OWNER

  ## Launch VMs for queued jobs in a given organisation for a customer
  actuated repair --staff OWNER
`
    }
```

Browse the source code: [repair.go](https://github.com/self-actuated/actuated-cli/blob/master/cmd/repair.go)

## Wrapping up

I covered just a few of the recent changes - some were driven by end-user feedback, others were open source contributions, and in some cases, we just wanted to make the CLI easier to use. I've been writing CLIs for a long time, and I still have a lot to learn.

What CLIs do you maintain? Could you apply any of the above to them?

Do you want to learn how to master the fundamentals of Go? Check out my eBook: [Everyday Go](https://store.openfaas.com/l/everyday-golang).

If you're on a budget, I would recommend checkout out the official [Go tour](https://go.dev/tour/), too. It'll help you understand some of the basics of the language and is a good primer for the e-book.

Read the source code of the CLIs we mentioned:

* [actions-usage](https://github.com/self-actuated/actions-usage) - free analytics tool for GitHub Actions
* [actuated-cli](https://github.com/self-actuated/actuated-cli) - CLI client for actuated customers
* [faas-cli](https://github.com/openfaas/faas-cli) - CLI client for OpenFaaS
* [k3sup](https://github.com/alexellis/k3sup) - Install K3s over SSH
* [arkade](https://github.com/alexellis/arkade) - Download CLI tools from GitHub releases


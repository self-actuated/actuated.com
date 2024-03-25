---
title: Run AI models with ollama in CI with GitHub Actions
description: With the new GPU support for actuated, we've been able to run models like llama2 from ollama in CI on consumer and datacenter grade Nvidia cards.
tags:
- ai
- ollama
- ml
- localmodels
- githubactions
- openai
- llama
- machinelearning
author_img: alex
image: /images/2024-04-ollama-in-ci/background.png
date: "2024-04-25"
---

That means you can run real end to end tests in CI with the same models you may use in dev and production. And if you use OpenAI or AWS SageMaker extensively, you could perhaps swap out what can be a very expensive API endpoint for your CI or testing environments to save money.

If you'd like to learn more about how and why you'd want access to GPUs in CI, read my past update: [Accelerate GitHub Actions with dedicated GPUs](/blog/gpus-for-github-actions).

We'll first cover what ollama is, why it's so popular, how to get it, what kinds of fun things you can do with it, then how to access it from actuated using a real GPU.

![ollama can run in CI with isolated GPU acceleration using actuated](/images/2024-04-ollama-in-ci/logos.png)
> ollama can now run in CI with isolated GPU acceleration using actuated

## What's ollama?

[ollama](https://ollama.com/) is an open source project that aims to do for AI models, what Docker did for Linux containers. Whilst Docker created a user experience to share and run containers using container images in the Open Container Initiative (OCI) format, ollama bundles well-known AI models and makes it easy to run them without having to think about Python versions or cuda libraries.

The ollama project can be run directly on a Linux, MacOS or Windows host, or within a container. There's a server component, and a CLI that acts as a client to pre-trained models. The main use-case today is that of inference - exercising the model with input data. A more recent feature means that you can create embeddings, if you pull a model that supports them.

On Linux, ollama can be installed using a utility script:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

This provides the `ollama` CLI command.

## A quick tour of ollama

After the initial installation, you can start a server:

```bash
ollama serve
```

By default, its REST API will listen on port `11434` on 127.0.0.1. 

You can find the reference for ollama's REST API here: [API endpoints](https://github.com/ollama/ollama/blob/main/docs/api.md) - which includes things like: creating a chat completion, pulling a model, or generating embeddings.

You can then browse [available models on the official website](https://ollama.com/library), which resembles the Docker Hub.

Most models will download with a default parameter size that's small enough to run on most CPUs or GPUs, but if you need to access it, there are larger models for higher accuracy.

For instance, the [llama2](https://ollama.com/library/llama2) model by Meta will default to the 7b model which needs around 8GB of RAM.

```bash
# Pull the default model size:

ollama pull llama2

# Override the parameter size
ollama pull llama2:13b
```

Once you have a model, you can then either "run" it, where you'll be able to ask it questions and interact with it like you would with ChatGPT, or you can send it API requests from your own applications using REST and HTTP.

For an interactive prompt, give no parameters:
```bash
ollama run llama2
```

To get an immediate response for use in i.e. scripts:

```bash
ollama run llama2 "What are the pros of MicroVMs for continous integrations, especially if Docker is the alternative?"
```

And you can use the REST API via `curl`, or your own codebase:

```bash
curl -s http://localhost:11434/api/generate -d '{
    "model": "llama2",
    "stream": false,
    "prompt":"What are the risks of running privileged Docker containers for CI workloads?"
}' | jq
```

### Access ollama from Python code

Here's how to access the API via Python, the `stream` parameter will emit JSON progressively when set to True, block until done if set to False. With Node.js, Python, Java, C#, etc the code will be very similar, but using your own preferred HTTP client.

```python
import requests
import json

url = "http://localhost:11434/api/generate"
payload = {
    "model": "llama2",
    "stream": False,
    "prompt": "What are the risks of running privileged Docker containers for CI workloads?"
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, data=json.dumps(payload), headers=headers)

# Parse the JSON response
response_json = response.json()

# Pretty print the JSON response
print(json.dumps(response_json, indent=4))
```

### Putting it together for a GitHub Action

The following GitHub Action will run on for customers who are enrolled for GPU support for actuated.

The initial set `self-actuated/nvidia-run` installs either the consumer or datacenter driver for Nvidia, depending on what you have in your system and takes about 30 seconds. This can be cached, if you like.

Then, we simply run the equivalent bash commands from the previous section to:

* Install ollama
* Start serving the REST API
* Pull the llama2 model from Meta
* Run an inference via CLI
* Run an inference via REST API using curl

```yaml
name: ollama-e2e

on:
    workflow_dispatch:

jobs:
    ollama-e2e:
        name: ollama-e2e
        runs-on: [actuated-8cpu-16gb, gpu]
        steps:
        - uses: actions/checkout@v1
        - uses: self-actuated/nvidia-run@master
        - name: Install Ollama
          run: |
            curl -fsSL https://ollama.com/install.sh | sudo -E sh
        - name: Start serving
          run: |
              ollama serve &
              sleep 5

        - name: Pull llama2
          run: |
              ollama pull llama2

        - name: Invoke via the CLI
          run: |
              ollama run llama2 "What are the pros of MicroVMs for continous integrations, especially if Docker is the alternative?"

        - name: Invoke via API
          run: |
            curl -s http://localhost:11434/api/generate -d '{
              "model": "llama2",
              "stream": false,
              "prompt":"What are the risks of running privileged Docker containers for CI workloads?"
            }' | jq
```

### Interactive access with SSH

By modifying your CI job, you can drop into a remote SSH session and run interactive commands at any point in the workflow.

That's how I came up with the commands for the Nvidia driver installation, and for the various ollama commands I shared.

Find out more about SSH for GitHub Actions [in the actuated docs](https://docs.actuated.dev/tasks/debug-ssh/).

## Wrapping up

Within a very short period of time ollama helped us pull a popular AI model that can be used for chat and completions. We were then able to take what we learned and run it on a GPU at an accelerated speed and accuracy by using actuated's [new GPU support for GitHub Actions and GitLab CI](/blog/gpus-for-github-actions).

ollama isn't the only way to find, download and run AI models, just like Docker wasn't the only way to download and install Nginx or Postgresql, but it provides a useful and convenient interface for those of us who are still learning about AI, and are not as concerned with the internal workings of the models.

Over on the OpenFaaS blog, in the tutorial [Stream OpenAI responses from functions using Server Sent Events](https://www.openfaas.com/blog/openai-streaming-responses/), we covered how to stream a response from a model to a function, and then back to a user. There, we used the [llama-api](https://github.com/c0sogi/llama-api) open source project, which is a single-purpose HTTP API for simulating llama2.

One of the benefits of ollama is [the detailed range of examples](https://github.com/ollama/ollama/tree/main/examples) in the docs, and the ability to run other models that may include computer vision such as with the [LLaVA: Large Language and Vision Assistant model](https://llava-vl.github.io/) or generating code with [Code Llama](https://codellama.dev/about).

Right now, many of us are running and tuning models in development, some of us are using OpenAI's API or self-hosted models in production, but there's very little talk about doing thorough end to end testing or exercising models in CI. That's where actuated can help.

Feel free to [reach out for early access, or to see if we can help your team with your CI needs](/pricing/).
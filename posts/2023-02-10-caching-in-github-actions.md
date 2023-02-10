---
title: Make your builds run faster with GitHub's built in caching for Actions.
description: Learn how we made a Golang project build 4x faster using GitHub's built-in caching mechanism.
author: Han Verstraete
tags:
- oss
- githubactions
author_img: welteki
image: /images/2023-02-10-caching-in-github-actions/background.png
date: "2023-02-10"
---
 
GitHub provides a [cache action](https://github.com/actions/cache) that allows caching dependencies and build outputs to improve workflow execution time.

A common use case would be to cache packages and dependencies from tools such as npm, pip, Gradle, ... . If you are using Go, caching go modules and the build cache can save you a significant amount of build time as we will see in the next section.

Caching can be configured manually, but a lot of setup actions already use the [actions/cache](https://github.com/actions/cache) under the hood and provide a configuration option to enable caching.

We use the actions cache to speed up workflows for building the Actuated base images. As part of those workflows we build a kernel and then a rootfs. Since the kernel’s configuration is changed infrequently it makes sense to cache that output.

![Build time comparison](/images/2023-02-10-caching-in-github-actions/build-time-comparison.png)

> Comparing workflow execution times with and without caching.

Building the kernel takes around `1m20s` on our aarch-64 Actuated runner and `4m10s` for the x86-64 build so we get some significant time improvements by caching the kernel.

The output of the cache action can also be used to do something based on whether there was a cache hit or miss. We use this to skip the kernel publishing step when there was a cache hit.

```yaml
- if: ${{ steps.cache-kernel.outputs.cache-hit != 'true' }}
  name: Publish Kernel
  run: make publish-kernel-x86-64
```

## Caching Go dependency files and build outputs

In this minimal example we are going to setup caching for Go dependency files and build outputs. As an example we will be building [alexellis/registry-creds](https://github.com/alexellis/registry-creds). This is a Kubernetes operator that can be used to replicate Kubernetes ImagePullSecrets to all namespaces. 

It has the K8s API as a dependency which is quite large so we expect to save some time by cashing the Go mod download. By also caching the Go build cache it should be possible to speed up the workflow even more.

### Configure caching manually

We will first create the workflow and run it without any caching.

```yaml
name: ci

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          repository: "alexellis/registry-creds"
      - name: Setup Golang
        uses: actions/setup-go@v3
        with:
          go-version: ~1.19
      - name: Build
        run: |
          CGO_ENABLED=0 GO111MODULE=on \
          go build -ldflags "-s -w -X main.Release=dev -X main.SHA=dev" -o controller
```

The [checkout action](https://github.com/actions/checkout) is used to check out the registry-creds repo so the workflow can access it. The next step sets up Go using the [setup-go action](https://github.com/actions/setup-go) and as a last step we run `go build`.

![No cache workflow run](/images/2023-02-10-caching-in-github-actions/no-cache-workflow.png)

When triggering this workflow we see that each run takes around `1m20s`.


Modify the workflow and add an additional step to configure the caches using the [cache action](https://github.com/actions/cache):

```yaml
steps:
  - name: Setup Golang
    uses: actions/setup-go@v3
    with:
      go-version: ~1.19
  - name: Setup Golang caches
    uses: actions/cache@v3
    with:
      path: |
        ~/.cache/go-build
        ~/go/pkg/mod
      key: ${{ runner.os }}-golang-${{ hashFiles('**/go.sum') }}
      restore-keys: |
        ${{ runner.os }}-golang-
```

The `path` parameter is used to set the paths on the runner to cache or restore. The `key` parameter sets the key used when saving the cache. A hash of the go.sum file is used as part of the cache key.

Optionally the restore-keys are used to find and restore a cache if there was no hit for the key. In this case we always restore the cache even if there was no specific hit for the go.sum file.

The first time this workflow is run the cache is not populated so we see a similar execution time as without any cache of around `1m20s`.

![Comparing workflow runs](/images/2023-02-10-caching-in-github-actions/workflow-cache-comparison.png)

Running the workflow again we can see that it now completes in just `18s`.

### Use setup-go built-in caching

The V3 edition of the [setup-go](https://github.com/actions/setup-go) action has support for caching built-in. Under the hood it also uses the [actions/cache](https://github.com/actions/cache) with a similar configuration as in the example above.

The advantage of using the built-in functionality is that it requires less configuration settings. Caching can be enabled by adding a single line to the workflow configuration:

```diff
name: ci

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          repository: "alexellis/registry-creds"
      - name: Setup Golang
        uses: actions/setup-go@v3
        with:
          go-version: ~1.19
+         cache: true
      - name: Build
        run: |
          CGO_ENABLED=0 GO111MODULE=on \
          go build -ldflags "-s -w -X main.Release=dev -X main.SHA=dev" -o controller
```

Triggering the workflow with the build-in cache yields similar time gains as with the manual cache configuration.

## Conclusion
We walked you through a short example to show you how to set up caching for a Go project and managed to build the project 4x faster.

If you are building with Docker you can use [Docker layer caching](https://docs.docker.com/build/ci/github-actions/examples/#cache) to make your builds faster. Buildkit automatically caches the build results and allows exporting the cache to an external location. It has support for [uploading the build cache to GitHub Actions cache](https://docs.docker.com/build/cache/backends/)

Keep in mind that there are some limitations to the GitHub Actions cache. Cache entries that have not been accessed in over 7 days will be removed. There is also a limit on the total cache size of 10 GB per repository.

Some points to take away:

- Using the actions cache is not limited to GitHub hosted runners but can be used with self-hosted runners as well.
- Workflows using the cache action can be converted to run on Actuated runners without any modifications.
- Jobs on Actuated runners start in a clean VM each time. This means dependencies need to be downloaded and build artifacts or caches rebuilt each time. Caching these files in the actions cache can improve workflow execution time.

Want to learn more about Go and GitHub Actions?

- The ebook [Everyday Golang](https://openfaas.gumroad.com/l/everyday-golang) has a chapter dedicated on how to build and release go projects with GitHub Actions.

Detailed instruction for setting up caching can be found in the GitHub documentation: [Cache dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
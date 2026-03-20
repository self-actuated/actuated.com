import Head from 'next/head'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

const benefits = [
  'Faster builds with bare-metal performance',
  'No Kubernetes cluster to manage',
  'No Docker In Docker (DIND) security nightmares',
  'Instant boot - VMs ready in under 1 second',
  'Ephemeral microVMs destroyed after every job',
  'Mixed Docker and Shell executors',
  'Flexible VM sizing per job via tags',
  'Private peering for on-premises networks',
]

const platforms = [
  { name: 'AWS', description: 'EC2 bare-metal or nested virtualisation' },
  { name: 'Azure', description: 'Bare-metal or nested virtualisation' },
  { name: 'GCP', description: 'Bare-metal or nested virtualisation' },
  { name: 'OpenStack', description: 'KVM-enabled instances' },
  { name: 'VMware', description: 'Nested virtualisation support' },
  { name: 'On-premises', description: 'Your own data centre hardware' },
  { name: 'Bare-metal', description: 'Dedicated servers from any provider' },
]

export default function GitLab() {
  return (
    <>
      <Head>
        <title>Actuated for GitLab CI - Secure, Fast microVM Runners</title>
        <meta name="description" content="Blazing fast GitLab CI with Firecracker microVMs. No Kubernetes, no DIND, no security nightmares. Instant boot on your own infrastructure." key="description" />
        <meta property="og:title" content="Actuated for GitLab CI - Secure, Fast microVM Runners" key="og_title" />
        <meta property="og:description" content="Blazing fast GitLab CI with Firecracker microVMs. No Kubernetes, no DIND, no security nightmares." key="og_description" />
        <meta property="twitter:title" content="Actuated for GitLab CI - Secure, Fast microVM Runners" key="tw_title" />
        <meta property="twitter:description" content="Blazing fast GitLab CI with Firecracker microVMs. No Kubernetes, no DIND, no security nightmares." key="tw_description" />
      </Head>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold uppercase tracking-wide text-indigo-300">
              GitLab.com &amp; Self-hosted GitLab CI
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Blazing fast GitLab CI
              <span className="block text-indigo-300">without the complexity.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-indigo-200">
              Secure, ephemeral Firecracker microVMs for every job. No Kubernetes to manage. No Docker In Docker security nightmares. Just fast, isolated builds on your own infrastructure.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/pricing"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
              >
                Get started
              </Link>
              <a
                href="https://forms.gle/8XmpTTWXbZwWkfqT6"
                className="rounded-md bg-indigo-500 bg-opacity-60 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-opacity-70"
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Value props - 4 columns */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Faster Builds</h3>
              <p className="mt-2 text-sm text-gray-600">Bare-metal performance with builds typically 2-3x faster than hosted runners.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No K8s to Manage</h3>
              <p className="mt-2 text-sm text-gray-600">No Helm charts, no Kubernetes clusters. Just install our agent on bare-metal or VMs.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No DIND Nightmares</h3>
              <p className="mt-2 text-sm text-gray-600">Run Docker natively in each microVM. No privileged containers, no socket binding.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Instant Boot</h3>
              <p className="mt-2 text-sm text-gray-600">VMs boot and start running jobs in under 1 second. Faster than Kubernetes pod scheduling.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two supported modes */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Two supported modes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Whether you use GitLab.com or run GitLab on your own infrastructure, Actuated has you covered.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border-2 border-indigo-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">GitLab.com</h3>
              </div>
              <p className="mt-4 text-base text-gray-600">
                Connect your own servers as runners for GitLab.com projects. Get bare-metal speed with the convenience of GitLab's hosted platform.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Bring your own bare-metal or cloud servers
                </li>
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Full isolation between jobs
                </li>
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  No changes to your existing pipelines
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-indigo-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">GitLab CI (Self-hosted)</h3>
              </div>
              <p className="mt-4 text-base text-gray-600">
                Run Actuated alongside your self-hosted GitLab instance. Full control over your CI infrastructure with enterprise-grade isolation.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  On-premises or cloud hosted GitLab
                </li>
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Private peering for firewalled networks
                </li>
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Docker and Shell executors supported
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How it works - conceptual diagram */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                When a pipeline is triggered, the Actuated control plane launches a dedicated Firecracker microVM for every job. The VM boots in under a second, runs the job, then is destroyed completely.
              </p>
              <dl className="mt-8 space-y-6">
                <div className="flex gap-x-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">1</div>
                  <div>
                    <dt className="font-semibold text-gray-900">Pipeline triggered</dt>
                    <dd className="mt-1 text-sm text-gray-600">A commit, merge request, or manual trigger starts the pipeline.</dd>
                  </div>
                </div>
                <div className="flex gap-x-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">2</div>
                  <div>
                    <dt className="font-semibold text-gray-900">MicroVM boots instantly</dt>
                    <dd className="mt-1 text-sm text-gray-600">A fresh Firecracker microVM spins up and registers as a runner in under 1 second.</dd>
                  </div>
                </div>
                <div className="flex gap-x-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">3</div>
                  <div>
                    <dt className="font-semibold text-gray-900">Job runs with full isolation</dt>
                    <dd className="mt-1 text-sm text-gray-600">sudo, Docker, Kubernetes - everything works out of the box with KVM-level security.</dd>
                  </div>
                </div>
                <div className="flex gap-x-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">4</div>
                  <div>
                    <dt className="font-semibold text-gray-900">VM destroyed</dt>
                    <dd className="mt-1 text-sm text-gray-600">No side effects, no leakage between jobs. Every build starts completely fresh.</dd>
                  </div>
                </div>
              </dl>
            </div>
            <div className="mt-10 lg:mt-0">
              <img
                className="rounded-xl shadow-lg"
                src="/images/2023-06-gitlab-preview/conceptual.png"
                alt="Actuated for GitLab CI - conceptual architecture"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DIND security warning */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="order-2 lg:order-1 mt-10 lg:mt-0">
              <img
                className="rounded-xl shadow-lg"
                src="/images/2024-07-gitlab/chart-warning.png"
                alt="Docker in Docker security notice from the GitLab Helm chart"
              />
              <p className="mt-3 text-sm text-gray-500 text-center">Security notice displayed by the GitLab Helm chart warning against Docker in Docker.</p>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Say goodbye to DIND
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Docker-in-Docker (DIND) requires privileged mode. The GitLab Helm chart disables it by default for good reason - it's a significant security risk.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                With Actuated, Docker runs natively inside each microVM. No privileged containers, no socket binding from the host, no flakey VFS driver. No need to switch to Kaniko, Buildah, or fight with user namespaces.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                You get <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">sudo</code>, a fresh Docker engine, and systemd in every VM - things like Kubernetes work out of the box for E2E testing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits list */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for GitLab CI
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-x-3 rounded-lg bg-white p-4 shadow-sm">
                <CheckCircleIcon className="h-6 w-6 flex-none text-indigo-600 mt-0.5" />
                <span className="text-sm font-medium text-gray-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick config example */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Simple to configure
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Add the <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">actuated</code> tag to any job. Size VMs per-job with tags like <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">actuated-4cpu-8gb</code>. No predefined sizes - pick any combination of vCPU and RAM.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Switch between Docker and Shell executors per-job by adding the <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">shell</code> tag. The Shell executor gives you full VM access - perfect for running KinD or K3s clusters for E2E testing.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="rounded-xl bg-gray-900 p-6 shadow-lg">
                <p className="text-xs font-mono text-gray-400 mb-3">.gitlab-ci.yml</p>
                <pre className="text-sm text-gray-300 overflow-x-auto"><code>{`build:
  image: docker:latest
  script:
    - docker build -t myapp .
    - docker push myapp
  tags:
    - actuated-4cpu-8gb

test-e2e:
  script:
    - k3sup install --local
    - kubectl apply -f ./manifests
    - ./run-tests.sh
  tags:
    - actuated-8cpu-16gb
    - shell`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video / Demo section */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              See it in action
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Watch Actuated launch parallel GitLab CI jobs in dedicated Firecracker microVMs - each booting in under a second.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/PybSPduDT6s"
                title="Actuated for GitLab CI demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center">Demo: Actuated for GitLab CI</p>
          </div>

          {/* Embedded tweet */}
          <div className="mt-12 max-w-xl mx-auto">
            <blockquote className="twitter-tweet"><p lang="en" dir="ltr">Here&#39;s 3x <a href="https://twitter.com/gitlab?ref_src=twsrc%5Etfw">@GitLab</a> CI jobs running in parallel within the same Pipeline demoed by <a href="https://twitter.com/alexellisuk?ref_src=twsrc%5Etfw">@alexellisuk</a> <br /><br />All in their own ephemeral VM powered by Firecracker<a href="https://twitter.com/hashtag/cicd?src=hash&amp;ref_src=twsrc%5Etfw">#cicd</a> <a href="https://twitter.com/hashtag/secure?src=hash&amp;ref_src=twsrc%5Etfw">#secure</a> <a href="https://twitter.com/hashtag/isolation?src=hash&amp;ref_src=twsrc%5Etfw">#isolation</a> <a href="https://twitter.com/hashtag/microvm?src=hash&amp;ref_src=twsrc%5Etfw">#microvm</a> <a href="https://twitter.com/hashtag/baremetal?src=hash&amp;ref_src=twsrc%5Etfw">#baremetal</a> <a href="https://t.co/fe5HaxMsGB">pic.twitter.com/fe5HaxMsGB</a></p>&mdash; actuated (@selfactuated) <a href="https://twitter.com/selfactuated/status/1668575246952136704?ref_src=twsrc%5Etfw">June 13, 2023</a></blockquote>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
          </div>
        </div>
      </div>

      {/* Infrastructure support */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Run anywhere with KVM support
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Actuated works with bare-metal servers and nested virtualisation across all major providers.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="rounded-lg border border-gray-200 bg-white p-5 text-center hover:border-indigo-300 hover:shadow-sm transition-all">
                <h3 className="text-base font-semibold text-gray-900">{platform.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Private peering */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Private peering for enterprise
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Servers behind a private network? Enable peering for an outbound connection that passes through firewalls, NAT, HTTP Proxies and VPNs without additional configuration.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  No additional networking or firewall changes
                </li>
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Agent only accessible to the Actuated control-plane
                </li>
                <li className="flex gap-x-3 text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
                  All traffic encrypted with TLS
                </li>
              </ul>
            </div>
            <div className="mt-10 lg:mt-0">
              <img
                className="rounded-xl shadow-lg"
                src="/images/2024-07-gitlab/peering.png"
                alt="Private peering diagram for enterprise networks"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blog posts */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Learn more
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Link href="/blog/actuated-for-gitlab" className="group rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all">
              <p className="text-sm text-indigo-600 font-medium">July 2024</p>
              <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600">Secure your GitLab jobs with microVMs and Actuated</h3>
              <p className="mt-2 text-base text-gray-600">Feature overview including mixed executors, VM sizing, private peering, and how microVMs provide more flexibility and security for CI workloads.</p>
            </Link>
            <Link href="/blog/secure-microvm-ci-gitlab" className="group rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all">
              <p className="text-sm text-indigo-600 font-medium">June 2023</p>
              <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600">Secure CI for GitLab with Firecracker microVMs</h3>
              <p className="mt-2 text-base text-gray-600">The original announcement for Actuated for GitLab CI, including a video demo and details on why Firecracker provides the isolation CI needs.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-700">
        <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to speed up your GitLab CI?</span>
            <span className="block text-indigo-200 text-xl mt-2">No sales pitch, just a quick chat with our engineers.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <a
              href="https://forms.gle/8XmpTTWXbZwWkfqT6"
              className="inline-flex items-center rounded-md bg-white px-8 py-3 text-base font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </>
  )
}


import { KeyIcon} from '@heroicons/react/20/solid'
import { CommandLineIcon} from '@heroicons/react/20/solid'
import {FireIcon} from '@heroicons/react/20/solid'
import {CpuChipIcon,BanknotesIcon} from '@heroicons/react/20/solid'
import {ServerStackIcon} from '@heroicons/react/20/solid'

export default function Solutions() {
    return (
        
      <div id='solutions' className="bg-white py-5 sm:py-5 lg:py-5">
       
          <div className="mx-auto mt-10 max-w-xl px-4 lg:max-w-7xl lg:px-6">
            <p className='mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900'>
                Increase speed, security and efficiency.
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              Learn what friction actuated solves and how it compares to other solutions: <a className='text-blue-500 underline' href='/blog/blazing-fast-ci-with-microvms'>Read the announcement</a>
            </p>
          </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-6xl">
          <dl className="grid mx-5 md:mx-auto lg:mx-5 xl:mx-auto 2xl:mx-auto max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <KeyIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Secure CI that feels like hosted.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">Every job runs in an immutable microVM, just like hosted runners, but on your own servers.</p>
                  <p className="mb-2">That means you can run <code>sudo</code>, Docker and Kubernetes directly, just like you do during development, there's no need for Docker-in-Docker (DIND), Kaniko or complex user-namespaces.</p>
                  <p className="mb-2">What about management and scheduling? Provision a server with a minimal Operating System, then install the agent. We'll do the rest.</p>
                 
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <CpuChipIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Arm / M1 from Dev to Production.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">Apple Silicon is a new favourite for developer workstations. Did you know that when your team run Docker, they're using an Arm VM?</p>
                  <p>With actuated, those same builds can be performed on Arm servers during CI, and even deployed to production on more efficient Ampere or AWS Graviton servers.</p>
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <ServerStackIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Run directly within your datacenter.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">If you work with large container images or datasets, then you'll benefit from having your CI run with direct local network access to your internal network.</p>    
                  <p className="mb-2">This is not possible with hosted runners, and this is crucial for one of our customers who can regularly saturate a 10GbE link during GitHub Actions runs.</p>
                  <p className="mb-2">In contrast, VPNs are complex to manage, capped on speed, and incur costly egress charges.</p>
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <CommandLineIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Debug live over SSH
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                <p className="mb-2">We heard from many teams that they missed CircleCI's "debug this job" button, <a href="https://docs.actuated.dev/tasks/debug-ssh/" className='text-blue-500 underline'>so we built it for you.</a></p>
                  <p>We realise you won't debug your jobs on a regular basis, but when you are stuck, and have to wait 15-20 minutes to get to the line you've changed in a job, debugging with a terminal can save you hours.</p>
                  <p class="mt-2"><i>"How cool!!! you don't know how many hours I have lost on GitHub Actions without this." - Ivan Subotic, Swiss National Data and Service Center (DaSCH)</i></p>
                </dd>
              </div>
          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-xl px-4 lg:max-w-7xl lg:px-6">
            <p className='mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900'>
                Lower your costs, and keep them there.
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              Actuated is billed by the maximum amount of concurrent jobs you can run, so no matter how many build minutes your team requires, the charge will not increase with usage.
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              In a recent interview, a lead SRE at UK-based scale-up told us that their bill had increased 5x over the past 6 months. They are now paying 5000 GBP / month and we worked out that we could make their builds faster and at least half the costs.
            </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-6xl">
          <dl className="grid mx-5 md:mx-auto lg:mx-5 xl:mx-auto 2xl:mx-auto max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <BanknotesIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Lower management costs.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">Whenever your team has to manage self-hosted runners, or explain non-standard tools like Kaniko to developers, you're losing money.</p>
                  <p className="mb-2">With actuated, you bring your own servers, install our agent, and we do the rest. Our VM image is built with automation and kept up to date, so you don't have to manage packages.</p>
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <BanknotesIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Predictable billing.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                 <p className="mb-2">Most small teams we interviewed were spending at least 1000-1500 USD / mo for the standard, slower hosted runners.</p>
                  <p className="mb-2">That cost would only increase with GitHub's faster runners, but with actuated the cost is flat-rate, no matter how many minutes you use.</p>
                </dd>
              </div>

          </dl>
        </div>

      </div>
    )
  }
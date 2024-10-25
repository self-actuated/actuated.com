
import { KeyIcon} from '@heroicons/react/20/solid'
import { CommandLineIcon} from '@heroicons/react/20/solid'
import {CpuChipIcon, BanknotesIcon} from '@heroicons/react/20/solid'
import {ServerStackIcon} from '@heroicons/react/20/solid'
import {FireIcon} from '@heroicons/react/20/solid'

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
          <dl className="grid mx-5 md:mx-auto lg:mx-5 xl:mx-auto 2xl:mx-auto max-w-xl grid-cols-1 gap-y3 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-6">

           <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <FireIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Blazing fast builds & E2E.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">With safe access to the fastest hardware available, builds tend to be 2-3x faster.</p>    
                  <p className="mb-2">Our expert team can offer advise on how to save you additional time with caching and local network access.</p>
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <KeyIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Secure CI that feels like hosted.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">Every job runs in a clean, isolated microVM, just like a hosted runner.</p>
                  <p className="mb-2">That means you can run <code>sudo</code>, <code>insmod</code>, Docker and Kubernetes directly, just like you do during development, there's no need for Docker-in-Docker (DIND), Kaniko or complex user-namespaces.</p>
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <CpuChipIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Arm (Apple Silicon) from Dev to Production.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">Are you running Docker with Apple Silicon in an Arm VM, or are deploying to Graviton on AWS?</p>
                  <p>With actuated, dev and production can now share the same Arm-based Linux build environment without slow emulators like QEMU.</p>
                </dd>
              </div>


              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <ServerStackIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Instant local caching.
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  <p className="mb-2">Most self-hosted runners suffer from poor caching speed uploading to Azure's backbone.</p>
                  <p>Actuated comes with a built-in Docker cache and optional S3 cache for near-instant access.</p>
                </dd>
              </div>





{/* 
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <CommandLineIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Debug live over SSH
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                <p className="mb-2">We heard from many teams that they missed CircleCI's "debug this job" button, <a href="https://docs.actuated.com/tasks/debug-ssh/" className='text-blue-500 underline'>so we built it for you.</a></p>
                  <p>We realise you won't debug your jobs on a regular basis, but when you are stuck, and have to wait 15-20 minutes to get to the line you've changed in a job, debugging with a terminal can save you hours.</p>
                  <p className="mt-2"><i>"How cool!!! you don't know how many hours I have lost on GitHub Actions without this." - Ivan Subotic, Swiss National Data and Service Center (DaSCH)</i></p>
                </dd>
              </div> */}
          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-xl px-4 lg:max-w-7xl lg:px-6">
            <p className='mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900'>
                Lower your costs, and keep them there.
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
               All our plans include unlimited build minutes, just decide how many builds you want to run at the same time. <i>Burst Billing</i> can be enabled to go over your capacity for a short period of time.
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              In a recent interview, a lead SRE at UK-based scale-up told us that their bill had increased 5x over the past 6 months. They are now paying 5000 GBP / month and we worked out that we could make their builds faster and at least halve their costs.
            </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-6xl">
          <dl className="grid mx-5 md:mx-auto lg:mx-5 xl:mx-auto 2xl:mx-auto max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">

          <div className="relative pl-16">
            <dt className="text-base font-semibold leading-7 text-gray-900 text-lg">
              <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <BanknotesIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              Predictable billing.
            </dt>
            <dd className="mt-2 text-base leading-7 text-gray-600">
              <p className="mb-2">Most small teams we interviewed were spending at least 1000-1500 USD / mo for GitHub's slowest hosted runners.</p>
              <p className="mb-2">That cost would have multiplied with GitHub's "bigger runners". But with actuated the cost is flat-rate, no matter how many minutes you use, or what size builder you need.</p>
            </dd>
          </div>

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

          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-xl px-4 lg:max-w-7xl lg:px-6">
            <p className='mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900'>
                Get insights into your organisation
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              When you have more than a few teammates and a dozen repositories, it's near impossible to get insights into patterns of usage.
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              Inspired by Google Analytics, Actuated contrasts usage for the current period vs the previous period - for the whole organisation, each repository and each developer. 
            </p>

            <img
              className="rounded-lg shadow-lg object-cover object-center mt-4 mx-10 "
              src="https://docs.actuated.com/images/dashboard/org-usage.png"
              alt="Organisational level insights"
            />

          <p className="text-base text-gray-500 mt-10 mt-4 mx-10"><a href="https://docs.actuated.com/dashboard/" className='text-blue-500 underline' >Learn about the actuated dashboard</a></p>
          
        </div>

      </div>
    )
  }
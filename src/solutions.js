
import { KeyIcon} from '@heroicons/react/20/solid'
import { CommandLineIcon} from '@heroicons/react/20/solid'
import {FireIcon} from '@heroicons/react/20/solid'
import {CpuChipIcon,BanknotesIcon} from '@heroicons/react/20/solid'
  
export default function Solutions() {
    return (
        
      <div id='solutions' className="bg-white py-5 sm:py-5 lg:py-10">
       
          <div className="mx-auto mt-10 mb-10 max-w-xl px-6 lg:max-w-7xl lg:px-8">
            <p className='mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900'>
                All about speed and efficiency.
            </p>
            <p className='mt-6 mx-10 text-base leading-7 text-gray-600 text-justify'>
              Learn who we built actuated for and how it compares to other solutions: <a className='text-blue-500 underline' href='https://blog.alexellis.io/blazing-fast-ci-with-microvms/'>Read the announcement</a>
            </p>
            </div>

        <div className="mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8">
        
          <h2 className="sr-only">Blazing fast CI.</h2>
          <dl className="grid grid-cols-1 lg:grid-cols-1">
              <div className='mx-10' key="fast-feature">
                <dt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                    <FireIcon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Blazing fast CI</p>

                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 text-justify">
                    <p className="mb-2">Many teams that we interviewed told us that they have 5-30 people committing regularly throughout the day, with a 20-30 minute build team time. That delay made their team frustrated and distracted as they task switched.</p>
                    
                    <p className="mb-2">The first thing you'll notice when you switch to actuated, is just how fast your jobs launch, followed up by the processing power of bare-metal, which is several times faster than GitHub's hosted runners.</p>

                    <p>If you deal with large base images for Docker builds, then you'll benefit from our pull through cache solution, that'll mean common images can be pulled directly from localhost instead of the public Internet.</p>
                </dd>
              </div>
          </dl>
        </div>

        <div className="mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">ARM / M1 from Dev to Production.</h2>
          <dl className="grid grid-cols-1 lg:grid-cols-1">
            <div className='mx-10' key="arm-feature">
                <dt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                    <CpuChipIcon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">ARM from dev to production</p>

                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 text-justify">
                  <p className="mb-2">The Apple M1 has made local developers much more productive. Teams we interviewed told us their code builds in 1-2 minutes locally, but takes more than 30 minutes with GitHub's runners.</p>
                    
                    <p>When you develop with Apple's M1 locally using Docker, you're running a 64-bit ARM Linux VM, with actuated you can build in the same environment for CI. This reduces friction, but also opens the doors to deploy to more powerful machines in production like AWS Graviton and Ampere servers.</p>
                </dd>
              </div>
          </dl>
        </div>

        <div className="mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Completely private CI.</h2>
          <dl className="grid grid-cols-1 lg:grid-cols-1">
          <div className='mx-10' key="isolated-feature">
                <dt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                    <KeyIcon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Completely private CI</p>

                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 text-justify">
                  <p className="mb-2">Actuated uses a hybrid model that you bring bare-metal machines with a bare Operating System, and we do everything else.</p>
                    
                    <p>Your jobs run on either your own machines or cloud instances in your own account, isolated in speedy Firecracker MicroVMs and an immutable filesystem, that we keep up to date and rebuild regularly.</p>
                </dd>
              </div>
          </dl>
        </div>


        <div className="mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Live debugging via SSH.</h2>
          <dl className="grid grid-cols-1 lg:grid-cols-1">
          <div className='mx-10' key="debug-feature">
                <dt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                    <CommandLineIcon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Live debugging via SSH</p>

                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 text-justify">
                    <p className="mb-2">We heard from many teams that they missed CircleCI's "debug this job" button, so we built it for you.</p>
                    
                    <p>We realise you won't debug your jobs on a regular basis, but when you are stuck, and have to wait 15-20 minutes to get to the line you've changed in a job, debugging with a terminal can save you hours. Check if this feature is included in your tier.</p>
                </dd>
              </div>
          </dl>
        </div>


        <div className="mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Flat rate billing.</h2>
          <dl className="grid grid-cols-1 lg:grid-cols-1">
          <div className='mx-10' key="debug-feature">
                <dt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                    <BanknotesIcon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Flat rate billing</p>

                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 text-justify">
                  <p className="mb-2">Most small teams we spoke to were already spending 1000-1500 USD/mo on overage charges on GitHub Actions for the slower hosted runners.</p>
                  <p className="mb-2">This doesn't factor in the long delays that your team is facing, and with engineering salaries at an all time high, we're talking about 100-300 USD / hour for every hour wasted, per person within your team.</p>
                  <p>With actuated, you can use as many build minutes as you need, with a predictable flat-rate charge once per month. And there's no commitment beyond a month, so you can cancel at any time. On top of that, your team will be less distracted by task switching.</p>
                </dd>
              </div>
          </dl>
        </div>

      </div>
    )
  }
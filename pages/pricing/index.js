import { CheckIcon } from '@heroicons/react/20/solid'
import PriceCalculator from '../../components/PriceCalculator'

const includedFeatures = [
  'microVM isolation & security',
  'Linux x86_64 & Arm supported',
  'Managed base images with OTA updates',
  'Detailed usage metrics and reports',
  'Debug tricky builds via SSH',
  'Nested virtualisation x86_64',
  'Support via Slack/email'
]

const earlyAccess = [
  'GitLab CI (self-hosted)',
  'Access GPUs/PCI devices from jobs',
  'GitHub Enterprise Server (GHES)'
]

export default function Pricing({ posts }) {
  return (
    <>
      <div className="bg-white">
        <div className=" max-w-7xl mx-auto py-4 px-4 sm:py-2 sm:px-6">
          <div className="text-center">
            <h1 className="mt-2 text-3xl leading-10 font-extrabold text-gray-900 sm:text-3xl sm:leading-none sm:tracking-tight lg:text-4xl">
                Plans & Pricing
            </h1>
            <p className="max-w-l mt-5 mx-auto text-xl leading-7 text-gray-500">
              Blazing fast builds without the management overheads.{' '}
            </p>
          </div>
        </div>
      </div>

    <ul className="container max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 min-height-500 mb-10">
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PriceCalculator />
            <div className="mx-auto mt-16 max-w-2xl rounded-xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
              <div className="p-8 sm:p-10 lg:flex-auto">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Custom plans for GitHub Actions and GitLab CI</h3>

                <p className="mt-6 text-base leading-7 text-gray-600">
                  Everyone has different needs, so we'll come up with a custom plan based upon your usage and specific needs. Whether that's reducing management, increasing security, controlling costs, or speeding up builds.
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  The onboarding process is quick and easy: <a className='text-blue-500 underline' href="https://docs.actuated.com/register">learn more</a>.
                </p>
                {/* <div className="mt-6 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">In the base tier</h4>
                  <div className="h-px flex-auto bg-gray-100" />
                </div> */}
            
                <ul
                  role="list"
                  className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-2"
                >
                  {includedFeatures.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* <div className="mt-6 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">With higher concurrency</h4>
                  <div className="h-px flex-auto bg-gray-100" />
                </div>
            
                <ul
                  role="list"
                  className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-2"
                >
                  {upgradedFeatures.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>


                <div className="mt-6 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">Early access</h4>
                  <div className="h-px flex-auto bg-gray-100" />
                </div>

                <ul
                  role="list"
                  className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-2"
                >
                  {earlyAccess.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul> */}
              </div>
            </div>
          </div>
        </div>
      
      </ul>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h4 className="text-2xl font-bold tracking-tight text-gray-900">Find out if Actuated is right for you</h4>
        <p className="mt-2 text-lg text-gray-600">No sales, just a quick chat with our engineers.</p>
        <div className="mt-6">
          <a
            href="https://forms.gle/8XmpTTWXbZwWkfqT6"
            className="inline-block rounded-md bg-indigo-600 px-8 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Talk to us
          </a>
        </div>
      </div>

    </>
  );
}


import { CheckIcon } from '@heroicons/react/20/solid'

const includedFeatures = [
  'Unlimited build minutes',
  'Bring your own server',
  'Onboarding call with our engineers',
  'Linux x86_64 & Arm supported',
  'Reporting and usage metrics',
  'Support via email',
  'Shared Slack channel'
]

const upgradedFeatures = [
  'Unlimited advice for CI improvements',
  'White glove onboarding',
  'Debug tricky builds with SSH',
  'Private Prometheus metrics',
  'Private Slack channel',
  'Enhanced SLA'
]

const earlyAccess = [
  'GPU and PCIe support for builds',
  'GitHub Enterprise Server (GHES)',
  'GitLab CI (self-hosted)'
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
              You can get started with us the same day as your call.{' '}
            </p>
          </div>
        </div>
      </div>

      <ul className="container max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 min-height-500">

    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Simple, flat-rate pricing</h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Actuated plans are based upon the total number of concurrent builds needed for your team. All plans include unmetered minutes, with no additional charges.
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              The higher the concurrency level for your plan, the more benefits you'll receive.
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              The onboarding process is quick and easy: <a className='text-blue-500 underline' href="https://docs.actuated.dev/register">learn more</a>.
            </p>
            <div className="mt-6 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">In the base tier</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
        
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

            <div className="mt-6 flex items-center gap-x-4">
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
            </ul>

          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Pay monthly, for up to 3x faster CI</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">$100</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600"> / concurrent build</span>
                </p>
                <a
                  href="https://forms.gle/8XmpTTWXbZwWkfqT6"
                  className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Talk to us
                </a>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  You'll meet with our engineers to understand your needs and answer your questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
      </ul>
    </>
  );
}

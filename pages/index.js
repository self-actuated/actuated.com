import Link from 'next/link';

import Faq from '../components/faq'
import Solutions from '../components/solutions'
import Cta from '../components/cta'
import Testimonial from '../components/testimonial'
import GitHubQuote from '../components/GitHubQuote'

export default function Home() {
  return (
    <>
      <div>
        {/* Hero card */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
              <div className="absolute inset-0">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
                  alt="People working on laptops"
                />
                <div className="absolute inset-0 bg-indigo-700 mix-blend-multiply" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">Blazing fast build times</span>
                  <span className="block text-indigo-200">means a focused team.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-200 sm:max-w-3xl">
                  Task switching is a productivity killer, slash those 30 minute builds times for your 
                  repos by switching to actuated for blazing fast CI times.
                </p>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      href="https://docs.actuated.dev/register/"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8"
                    >
                      Get started
                    </Link>
                    <Link
                      href="https://www.youtube.com/watch?v=2o28iUC-J1w"
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                    >
                      Live demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="bg-gray-100">
      
          <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-base font-semibold text-gray-500 ">
              Trusted by a growing number of companies
            </p>
            <div className="mt-6 justify-center grid grid-cols-12 gap-8 md:grid-cols-12 lg:grid-cols-12">
              <div className="col-span-12 flex justify-center md:col-span-6 lg:col-span-6">
                <img className="h-12" src="./images/Riskfuel-logo-blue.png" alt="Riskfuel" />
              </div>
              <div className="col-span-12 flex justify-center md:col-span-6 lg:col-span-6">
                <img className="h-12" src="./images/openfaas_light.png" alt="OpenFaaS" />
              </div>
            </div>
          </div>
        </div>
      </div>

  
      {/* More main page content here... */}

      <Solutions></Solutions>

      <Testimonial></Testimonial>

      <Faq></Faq>

      <GitHubQuote></GitHubQuote>

      <Cta></Cta>
    </>
  )
}




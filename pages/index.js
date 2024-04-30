import Link from 'next/link';

import Faq from '../components/faq'
import Solutions from '../components/solutions'
import Cta from '../components/cta'
import Testimonial from '../components/testimonial'
import TestimonialPrimary from '../components/testimonial-primary'
import GitHubQuote from '../components/GitHubQuote'
import BlogRollup from '../components/rollup'
// import Subscribe from '../components/subscribe'


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
                  alt="The team working collaborating on a project"
                />
                <div className="absolute inset-0 bg-indigo-700 mix-blend-multiply" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">Fast and secure GitHub Actions</span>
                  <span className="block text-indigo-200">on your own infrastructure.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-200 sm:max-w-3xl">
                  Standard hosted runners are slow and expensive, larger runners cost even more.
                  </p>
                <p className="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-200 sm:max-w-3xl">
                  Actuated runs on your own infrastructure with a predictable cost, low management and secure isolation with Firecracker.
                </p>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      href="/pricing"
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
            <div className="mt-6 justify-center grid grid-cols-12 gap-8 md:grid-cols-12 lg:grid-cols-12 content-evenly">

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/balena-logo.png" alt="Balena.io" />
              </div>

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/calyptia.png" alt="Calyptia - Observability, simplified" />
              </div>

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/cncf.png" alt="Cloud Native Computing Foundation (CNCF)" />
              </div>

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/openfaas_light.png" alt="OpenFaaS Ltd" />
              </div>

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/kubiya-actuated.png" alt="Kubiya.ai" />
              </div>

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/thg-logo.png" alt="The Hut Group" />
              </div>


              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/toolpath.png" alt="Toolpath" />
              </div>

              <div className="col-span-12 flex justify-center md:col-span-3 lg:col-span-3">
                <img className="h-12" src="./images/waffle-labs.png" alt="Waffle Labs" />
              </div>

            </div>
          </div>
        </div>
      </div>
      <TestimonialPrimary></TestimonialPrimary>

      <Solutions></Solutions>

      <BlogRollup></BlogRollup>

      <Testimonial></Testimonial>

      <Faq></Faq>

      <GitHubQuote></GitHubQuote>

      <Cta></Cta>
    </>
  )
}




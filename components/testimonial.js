export default function Testimonial() {
  return (
    <section className="bg-indigo-800">

      <div className="mx-auto max-w-7xl md:grid md:grid-cols-2 md:px-6 lg:px-8">


        <div className="py-12 px-4 sm:px-6 md:flex md:flex-col md:border-r md:border-indigo-900 md:py-16 md:pl-0 md:pr-10 lg:pr-16">
          <div className="md:flex-shrink-0">
            <img className="h-12" src="/images/Riskfuel-logo-blue.png" alt="Tuple" />
          </div>
          <blockquote className="mt-6 md:flex md:flex-grow md:flex-col">
            <div className="relative text-lg font-medium text-white md:flex-grow">
              <svg
                className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-indigo-600"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="relative">
                We just switched from Actions Runtime Controller to Actuated. It only took 30s create 5x isolated VMs, run the jobs and tear them down again inside our on-prem environment (no Docker socket mounting shenanigans)! Pretty impressive stuff.
              </p>
            </div>
            <footer className="mt-8">
              <div className="flex items-start">
                <div className="inline-flex flex-shrink-0 rounded-full border-2 border-white">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="/images/addison.jpg"
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <div className="text-base font-medium text-white">Addison van den Hoeven</div>
                  <div className="text-base font-medium text-indigo-200">DevOps Lead, Riskfuel</div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>

        <div className="py-12 px-4 sm:px-6 md:flex md:flex-col md:border-r md:border-indigo-900 md:py-16 md:pl-0 md:pr-10 lg:pr-16">
          <div className="md:flex-shrink-0">
            <img className="h-12" src="/images/hedgehog-logo.png" alt="Githedgehog" />
          </div>
          <blockquote className="mt-6 md:flex md:flex-grow md:flex-col">
            <div className="relative text-lg font-medium text-white md:flex-grow">
              <svg
                className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-indigo-600"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="relative">
                From my time at Mirantis, I learned how slow and unreliable Docker In Docker can be. Compared to GitHub's 16 core runners, actuated is 2-3x faster for us.
              </p>
            </div>
            <footer className="mt-8">
              <div className="flex items-start">
                <div className="inline-flex flex-shrink-0 rounded-full border-2 border-white">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="/images/sergei.png"
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <div className="text-base font-medium text-white">Sergei Lukianov</div>
                  <div className="text-base font-medium text-indigo-200">Founding Engineer, Githedgehog</div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>

        {/* <div className="border-t-2 border-indigo-900 py-12 px-4 sm:px-6 md:border-t-0 md:border-l md:py-16 md:pr-0 md:pl-10 lg:pl-16">
          <div className="md:flex-shrink-0">
            <img
              className="h-12"
              src="/images/suse.png"
              alt="SUSE"
            />
          </div>
          <blockquote className="mt-6 md:flex md:flex-grow md:flex-col">
            <div className="relative text-lg font-medium text-white md:flex-grow">
              <svg
                className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-indigo-600"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="relative">
                This is great, perfect for jobs that take forever on normal GitHub runners. I love what Alex is doing here.
              </p>
            </div>
            <footer className="mt-8">
              <div className="flex items-start">
                <div className="inline-flex flex-shrink-0 rounded-full border-2 border-white">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="/images/richardcase.jpg"
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <div className="text-base font-medium text-white">Richard Case</div>
                  <div className="text-base font-medium text-indigo-200">Principal Engineer, SUSE</div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div> */}

      </div>
    </section>
  )
}
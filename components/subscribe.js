export default function Subscribe() {
    return (

          <div className="bg-gray-50">
            <div className="px-6 py-4 sm:px-6 sm:py-8 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900 tracking-tight">
                  Keep in touch with us
                  <br/>
                  For news and announcements
                </h2>
                <form className="w-full max-w-md mx-auto lg:col-span-5 lg:pt-2 listmonk-form" method="post" action="https://lists.openfaas.com/subscription/form">
            <div className="mt-5 flex items-center justify-center gap-x-6">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />

              <input id="69e71" hidden type="hidden" name="l" defaultChecked value="69e71c85-ff82-4d70-a9d8-2128de0289f2" />
 
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              We care about your data. Read our{' '}
              <a href="https://docs.actuated.dev/faq/#privacy-policy-data-security" className="font-semibold text-indigo-600 hover:text-indigo-500">
                privacy&nbsp;policy
              </a>
              .
            </p>
          </form>

              </div>
            </div>
          </div>
        )

  }
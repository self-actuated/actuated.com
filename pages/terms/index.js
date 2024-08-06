
export default function Terms({ posts }) {
  return (
    <>
      <div className="bg-white">
        <div className=" max-w-7xl mx-auto py-4 px-4 sm:py-2 sm:px-6">
          <div className="text-center">
            <h1 className="mt-2 text-3xl leading-10 font-extrabold text-gray-900 sm:text-3xl sm:leading-none sm:tracking-tight lg:text-4xl">
                Terms & Conditions
            </h1>
            <p className="max-w-l mt-5 mx-auto text-xl leading-7 text-gray-500">
              Understand the End User License Agreement (EULA), Privacy & Data Security policy.{' '}
            </p>
          </div>
        </div>
      </div>

    <ul className="container max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 min-height-500">
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
              <div className="p-8 sm:p-10 lg:flex-auto">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">1. Privacy Policy</h3>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Read the <a className='underline' href='https://docs.actuated.com/faq/#privacy-policy-data-security'>Privacy & Data Security Policy</a>
                </p>
                <h3 className="text-2xl mt-10 font-bold tracking-tight text-gray-900">2. End User License Agreement (EULA)</h3>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Read the <a className='underline' href='https://github.com/self-actuated/actuated/blob/master/EULA.md'>End User License Agreement.</a>
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    For additional questions or comments, <a className='underline' href="https://forms.gle/8XmpTTWXbZwWkfqT6">contact us via this form</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      
      </ul>
    </>
  );
}

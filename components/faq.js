import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What is Firecracker? Why is it better than a container?",
    answer:
      "Generally, any use of containers for CI means bypassing security, so that any job can take over a host or the cluster. Actuated uses Firecracker microVMs, a project built by AWS to fully isolate every job with an immutable VM.",
  },
  {
    question: "How do we try out actuated for our team?",
    answer:
      "Register using the link, and we'll book 30 mins to find your challenges, recommend a plan, and server hosting for your current usage.",
      link: "https://docs.actuated.dev/register/#sign-up-for-the-pilot"
  },
  {
    question: "How much does it cost? What is the right plan for our team?",
    answer: "For the pilot, we are offering unmetered billing with a flat-rate monthly subscription. You can use as many minutes as you like.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "For the pilot, every customer is invited to a Slack channel for collaboration and support. We have operational experience with GitHub Actions, Docker and Kubernetes and we're making time to help you tune your builds up to get the most out of them.",
  },
  {
    question: "What kinds of servers do I need?",
    answer:
      "You can use your own physical servers, nested virtualisation with cloud VMs or rent instances paid by the hour.",
    link: "https://docs.actuated.dev/provision-server/"
  },
  {
    question: "Doesn't GitHub already offer faster runners?",
    answer:
      "GitHub are in a beta phase for larger runners for their Team and Enterprises plans, these have an increased cost vs. standard runners and there is no Arm support. With actuated you get much faster speeds at a flat rate cost.",
  },
  {
    question: "What's the difference with Actions Runtime Controller?",
    answer:
      "actions-runtime-controller compromises the security of a Kubernetes cluster by using privileged containers or by mounting the Docker socket - both mean that code in a CI job can take over the host - or potentially the cluster.",
      link: "https://actuated.dev/blog/blazing-fast-ci-with-microvms"
  },
  {
    question: "How much faster is an Arm build than using hosted runners?",
    answer:
      "In our testing of the open source Parca project, we got the build time down from 33 minutes to 1 minute 26s simply by changing to an Arm runner instead of using QEMU.",
    link: '/blog/native-arm64-for-github-actions'
  },
  {
    question: "How do I launch jobs in parallel?",
    answer:
      "Have a look at the examples in our docs for matrix builds. Each job within the workflow will be launched in a separate, parallel VM.",
    link: 'https://docs.actuated.dev/'
  },
  {
    question: "How mature is actuated?",
    answer:
      "Actuated is built on battle tested technology that's run in production at huge scale by Amazon Web Services (AWS) and GitHub. Our solution launches thousands of VMs for customers already, without issue.",
  },
  {
    question: "Where can I find detailed information about actuated?",
    answer: "We cover most common questions in much more detail over in the FAQ in the docs.",
    link: 'https://docs.actuated.dev/faq'
  },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Faq() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl divide-y-2 divide-gray-200">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-400">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          <ChevronDownIcon
                            className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">

                      <p className="text-base text-gray-500">{faq.answer} {faq.link ? <a href={faq.link} className='text-blue-500 underline' >Learn more</a> : "" } </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
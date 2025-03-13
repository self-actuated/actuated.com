import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What is Firecracker? Why is it better than a container?",
    answer:
      "Generally, any use of containers for CI means bypassing security, so that any job can take over a host or the cluster. Actuated uses Firecracker, an open-source project built by AWS to fully isolate every job with an immutable microVM.",
      link: "https://www.youtube.com/watch?v=CYCsa5e2vqg",
      action: "Watch our Firecracker webinar"
  },
  {
    question: "Can we talk to you before signing up for a plan?",
    answer:
      "Just fill out the form for a call with our founder. If you think our solution is a good fit, you can be up and running on the same day.",
      link: "https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform",
      action: "Schedule a call"
  },
  {
    question: "How much does it cost? What is the right plan for our team?",
    answer: "We are offering unmetered billing with a flat-rate monthly subscription. You can use as many minutes as you like.",
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
    link: "https://docs.actuated.com/provision-server/",
    action: "Explore server options"
  },
  {
    question: "Doesn't GitHub already offer faster runners?",
    answer:
      "GitHub are in a beta phase for larger runners for their Team and Enterprises plans, these have an increased cost vs. standard runners and there is no Arm support. With actuated you get much faster speeds at a flat rate cost, with usage insights across your team and organisation.",
  },
  {
    question: "What are the differences vs. Actions Runtime Controller?",
    answer:
      "actions-runtime-controller compromises the security of a Kubernetes cluster by using privileged containers or by mounting the Docker socket - both mean that code in a CI job can take over the host - or potentially the cluster.",
      link: "/blog/blazing-fast-ci-with-microvms"
  },
  {
    question: "How much faster is an Arm build than using hosted runners?",
    answer:
      "In our testing of the open source Parca project, we got the build time down from 33 minutes to 1 minute 26s simply by changing to an Arm runner instead of using QEMU. For Network Service Mesh, Dasch Swiss and Calyptia - their builds couldn't complete within 6 hours, all complete in 4-20 minutes with actuated.",
    link: '/blog/native-arm64-for-github-actions',
    action: "Read a case study"
  },
  {
    question: "How do I launch jobs in parallel?",
    answer:
      "Have a look at the examples in our docs for matrix builds. Each job within the workflow will be launched in a separate, parallel VM.",
    link: 'https://docs.actuated.com/'
  },
  {
    question: "How mature is actuated?",
    answer:
      "Actuated is built on battle tested technology that's run in production at huge scale by Amazon Web Services (AWS) and GitHub. Our solution has launched over 25k VMs for customers already, without issue.",
  },
  {
    question: "Is GitLab CI supported?",
    answer:
      "Self-hosted GitLab is supported.",
      link: "/blog/secure-microvm-ci-gitlab",
      action: "Read the announcement"
  },
  {
    question: "Where can I find detailed information about actuated?",
    answer: "We cover most common questions in much more detail over in the FAQ in the docs.",
    link: 'https://docs.actuated.com/faq',
    action: "FAQ"
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

                      <p className="text-base text-gray-500">{faq.answer} {faq.link ? <a href={faq.link} className='text-blue-500 underline' >{faq.action ? faq.action : "Learn more"}</a> : "" } </p>
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
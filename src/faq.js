import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "How much time do I need to invest to try actuated?",
    answer:
      "You probably need to set aside 10-30 minutes to follow our quickstart guide and get your builds running on actuated. For regular Intel/AMD builds, edit your workflow YAML and change the runs-on field to either \"actuated\" or \"actuated-aarch64\".",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "For the pilot, every customer is invited to a Slack channel for collaboration and fast support. We have quite a bit of operational experience with GitHub Actions, Docker and Kubernetes and we're making time to help you tune your builds up to get the most out of them.",
  },
  {
    question: "What kinds of machines do I need?",
    answer:
      "You can use your own physical servers, nested virtualisation with cloud VMs or rent instances paid by the hour.",
    link: "https://docs.actuated.dev/add-agent/"
  },
  {
    question: "How does actuated compare to Actions Runtime Controller or the stand-alone self-hosted runner?",
    answer:
      "You can find a detailed comparison in the FAQ in the docs.",
      link: "https://docs.actuated.dev/faq",
  },
  {
    question: "How much faster is an ARM build than using hosted runners?",
    answer:
      "In our testing of the open source Parca project, we got the build time down from 33 minutes to 1 minute simply by changing to a real ARM runner instead of using QEMU.",
    link: 'https://twitter.com/alexellisuk/status/1583089248084729856?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1583089248084729856%7Ctwgr%5Ed0015583075c1d7969e167fa1e94c534bc0da4c4%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fblog.alexellis.io%2Fblazing-fast-ci-with-microvms%2F'
  },
  {
    question: "How do I launch jobs in parallel?",
    answer:
      "Have a look at the examples in our docs for matrix builds. Each job within the workflow will be launched in a separate, parallel VM.",
    link: 'https://docs.actuated.dev/'
  },
  {
    question: "How much does it cost? What is the right plan for our team?",
    answer: "For pilot customers, we have unmetered billing, which means you can use as many build minutes as you like, with one flat fee. The initial tier comes with 5 concurrent builds across one host, and as you increase, you get more RAM/CPU per job, more build agents and more parallel jobs.",
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
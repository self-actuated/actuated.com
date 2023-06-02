const testimonials = [
  {
    body: 'Our team loves actuated. It gave us a 3x speed increase on a Go repo that we build throughout the day. Alex and team are really responsive, and we\'re already happy customers of OpenFaaS and Inlets.',
    author: {
      name: 'Shaked Askayo',
      handle: 'CTO, Kubiya.ai',
      imageUrl:
        '/images/shaked-askayo.jpg',
    },
  },
  {
    body: 'We just switched from Actions Runtime Controller to Actuated. It only took 30s create 5x isolated VMs, run the jobs and tear them down again inside our on-prem environment (no Docker socket mounting shenanigans)! Pretty impressive stuff.',
    author: {
      name: 'Addison van den Hoeven',
      handle: 'DevOps Lead, Riskfuel',
      imageUrl:
        '/images/addison.jpg',
    },
  },
  {
    body: 'From my time at Mirantis, I learned how slow and unreliable Docker In Docker can be. Compared to GitHub\'s 16 core runners, actuated is 2-3x faster for us.',
    author: {
      name: 'Sergei Lukianov',
      handle: 'Founding Engineer, Githedgehog',
      imageUrl:
        '/images/sergei.jpg',
    },
  },
  {
    body: 'This is great, perfect for jobs that take forever on normal GitHub runners. I love what Alex is doing here.',
    author: {
      name: 'Richard Case',
      handle: 'Principal Engineer, SUSE',
      imageUrl:
        '/images/richardcase.jpg',
    },
  },
  {
    body: 'We needed to build public repos on Arm runners, but QEMU couldn\'t finish in 6 hours. Actuated now builds the same code in 4 minutes.',
    author: {
      name: 'Patrick Stephens',
      handle: 'Tech Lead of Infrastructure, Calyptia/Fluent Bit.',
      imageUrl:
        '/images/patrick-stephens.jpg',
    },
  },
  {
    body: 'We needed to build Arm containers for our customers to deploy to Graviton instances on AWS EC2. Hosted runners with QEMU failed to finish within the 6 hour limit. With actuated it takes 20 minutes - and thanks to Firecracker, each build is safely isolated for our open source repositories.',
    author: {
      name: 'Ivan Subotic',
      handle: 'Head of Engineering, Swiss National Data and Service Center for the Humanities',
      imageUrl:
        '/images/ivan-subotic.jpg',
    },
  },
]

export default function Testimonial() {
      return (
        <div className="bg-white py-10 sm:py-15">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <p className="mt-2 text-2xl  font-bold tracking-tight text-gray-900 sm:text-4xl">
                These are the results you've been waiting for
              </p>
            </div>

            <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
              <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-2">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                    <figure className="rounded-2xl bg-gray-50 p-8 text-base leading-6">
                      <blockquote className="text-gray-900">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" />
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                          <div className="text-gray-600">{`${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
  }

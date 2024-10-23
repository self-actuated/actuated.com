const posts = [
  {
    title: 'Run AI models with ollama in CI with GitHub Actions.',
    href: '/blog/ollama-in-github-actions',
    description: 'With the new GPU support for actuated, we\'ve been able to run models like llama2 from ollama in CI on consumer and datacenter grade Nvidia cards.',
    date: 'April 25, 2024',
  },
    {
      title: 'On Running Millions of Arm CI Minutes for the CNCF',
      href: '/blog/millions-of-cncf-minutes',
      description: 'We\'ve now run over 1.5 million minutes of CI time for various CNCF projects on Ampere hardware. Here\'s what we\'ve learned.',
      date: 'May 30, 2024',
    },
    {
      title: 'How Calyptia fixed its Arm builds whilst saving money',
      href: '/blog/calyptia-case-study-arm',
      description:
        'Learn how Calyptia fixed its failing Arm builds for open-source Fluent Bit and accelerated our commercial development by adopting Actuated and bare-metal runners.',
      date: 'August 11, 2023',
    }
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function BlogRollup() {
    return (
      <div className="bg-white px-6 lg:px-8 lg:pt-8 lg:pb-10">
        <div className="mx-auto mt-2 max-w-xl px-4 lg:max-w-7xl lg:px-6">
            <p className='mt-2 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900'>
                Improve your builds with our tips & tricks
            </p>
            <p className='mt-4 mx-10 text-base leading-7 text-gray-600 text-justify'>
              Learn how to improve the speed and efficiency your GitHub Actions with our examples and best practices.
            </p>
          
          <div className="mx-10 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
            {posts.map((post) => (
              <div key={post.title}>
                <a href={post.href} className="mt-4 block">
                  <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                  <p className="mt-3 text-base text-gray-500">{post.description}</p>
                </a>
                <div className="mt-6 flex items-center">
                  <div className="">
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span aria-hidden="true">&middot;</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
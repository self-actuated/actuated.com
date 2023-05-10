const posts = [
    {
      title: 'How to make GitHub Actions 22x faster with bare-metal Arm',
      href: '/blog/native-arm64-for-github-actions',
      description: 'GitHub doesn\'t provide hosted Arm runners, so how can you use native Arm runners safely & securely?',
      date: 'January 17, 2023',
    },
    {
      title: 'How to add a Software Bill of Materials (SBOM) to your containers',
      href: '/blog/sbom-in-github-actions',
      description:
        'Learn how to add a Software Bill of Materials (SBOM) to your containers with GitHub Actions in a few easy steps.',
      date: 'January 25, 2023',
    },
    {
      title: 'Make your builds run faster with Caching for GitHub Actions.',
      href: '/blog/caching-in-github-actions',
      description: 'Learn how we made a Golang project build 4x faster using GitHub\'s built-in caching mechanism.',
      date: 'February 10, 2023',
    },
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
  
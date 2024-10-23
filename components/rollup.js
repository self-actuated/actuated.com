export default function BlogRollup({posts}) {
  return (
    <div className="bg-white px-6 lg:px-8 lg:pt-4 lg:pb-6">
      <div className="mx-auto mt-2 max-w-xl px-4 lg:max-w-7xl lg:px-6">
        <p className="mt-2 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900">
          Improve your builds with our tips & tricks
        </p>
        <p className="mt-4 mx-10 text-base leading-7 text-gray-600 text-justify">
          Learn how to improve the speed and efficiency your GitHub Actions with
          our examples and best practices.
        </p>

        <div className="mx-10 grid gap-x-6 gap-y-2 pt-8 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.title}>
              <a href={`/blog/${post.slug}`} className="mt-4 block">
                <p className="text-xl font-semibold text-gray-900">
                  {post.title}
                </p>
                <p className="mt-3 text-base text-gray-500">
                  {post.description}
                </p>
              </a>
              <div className="mt-6 flex items-center">
                <div className="">
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


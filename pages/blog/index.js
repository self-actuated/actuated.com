import { getSortedPostsMetadata, generateRssFeed } from '../../lib/posts';

import Link from 'next/link';
import Date from '../../components/date';

export default function Blog({ posts }) {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto py-4 px-4 sm:py-2 sm:px-6">
          <div className="text-center">
            <h1 className="mt-2 text-3xl leading-10 font-extrabold text-gray-900 sm:text-3xl sm:leading-none sm:tracking-tight lg:text-4xl">
              Actuated Blog
            </h1>
            <p className="max-w-l mt-5 mx-auto text-xl leading-7 text-gray-500">
              The latest news, tutorials, case-studies, and announcements.{' '}
            </p>
          </div>
        </div>
      </div>

      <ul className="container mx-auto mt-4 px-4 sm:px-6 lg:px-8 min-height-500">
        {posts.map(({ slug, date, title, description, author, author_img }) => (
          <li key={slug} className="bg-white border-b border-gray-200">
            <div className="px-4 py-2 sm:px-6">
              <Link
                href={`/blog/${slug}`}
                className="block"
              >
                <h1 className="mt-2 text-2xl leading-7 font-bold text-gray-900 hover:text-blue-500">
                  {title}
                </h1>
              </Link>
            </div>
            <div className="flex-1 bg-white px-6 py-4 flex flex-col justify-between">
              <p className="mt-1 text-base leading-6 text-gray-600">
                { description }
              </p>

              <h4 className="text-blue-500">
                <Link href={`/blog/${slug}`}>
                  Read more...
                </Link>
              </h4>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`/images/${author_img}.jpg`}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm leading-5 font-medium text-gray-900">
                    { author }
                  </p>
                  <div className="flex text-sm leading-5 text-gray-500">
                    <Date dateString={date} />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getStaticProps() {
  await generateRssFeed()
  
  return {
    props: {
      posts: getSortedPostsMetadata()
    },
  };
}

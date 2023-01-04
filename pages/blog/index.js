import { getSortedPostsData, generateRssFeed } from '../../lib/posts';

import Link from 'next/link';
import Date from '../../components/date';

export default function Blog({ posts }) {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-base leading-6 font-semibold tracking-wide uppercase">
              Blog
            </h1>
            <p className="mt-2 text-3xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-4xl">
              Actuated Blog
            </p>
            <p className="max-w-l mt-5 mx-auto text-xl leading-7 text-gray-500">
              The latest news, tutorials, case-studies, and announcements.{' '}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-height-500">
        {posts.map(({ id, date, title, description, author, author_img }) => (
          <div>
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
              <Link
                href={`/blog/${id}`}
                className="block"
              >
                <h1 className="mt-2 text-2xl leading-7 font-bold text-gray-900">
                  {title}
                </h1>
              </Link>
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <p className="mt-2 text-base leading-6 text-gray-600">
                { description }
              </p>

              <h4 className="text-indigo-blue-700">
                <Link href={`/blog/${id}`}>
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
                    <span className="mx-1">·</span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export async function getStaticProps() {
  await generateRssFeed();

  const posts = getSortedPostsData();
  return {
    props: {
      posts,
    },
  };
}

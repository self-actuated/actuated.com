import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description} key="description" />

        <meta property="twitter:title" content={post.title} key="tw_title" />
        <meta
          property="twitter:description"
          content={post.description}
          key="tw_description"
        />

        <meta property="og:title" content={post.title} key="og_title" />
        <meta
          property="og:description"
          content={post.description}
          key="og_description"
        />
      </Head>
      <div className="container mx-auto max-w-4xl bg-white mt-4 px-4 sm:px-6">
        <h1 id="post_title" className="text-3xl mb-3 leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          {post.title}
        </h1>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="border-b border-gray-200 py-4 flex items-center text-gray-500 mx-auto">
          <div>
            <img
              className="h-10 w-10 rounded-full"
              src={`/images/${post.author_img}.jpg`}
              alt=""
            />
          </div>
          <div className="ml-3">
            <p id="post_author" className="text-sm leading-5 font-medium text-gray-900">
              {post.author}
            </p>
            <div className="flex text-sm leading-5 text-gray-500">
              <Date id="post_date" dateString={post.date} />
              <span className="mx-1"></span>
            </div>
          </div>
        </div>
        <div className="mt-6 prose sm:prose-lg max-w-none">
          <p id="post_description" className="mb-4">{post.description}</p>
        </div>
        <div
          id="post_content"
          className="mt-6 prose sm:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
      {/* <div className="mx-auto px-4 sm:px-6 lg:px-8 padding-bottom-10">
        <div className="bg-white overflow-hidden">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto mb-6">
              <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                {post.title}
              </h1>
            </div>
            
            <div className="container">
              
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostData(params.id);
  return {
    props: {
      post,
    },
  };
}

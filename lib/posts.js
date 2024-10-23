import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import { Feed } from "feed";

const postsDirectory = path.join(process.cwd(), "posts");
const publicDirectory = path.join(process.cwd(), "public");

export function getPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      slug: getSlug(fileName),
      fileName,
    };
  });
}

export function getPostBySlug(slug) {
  return getPosts().find((post) => post.slug === slug);
}

export function getSortedPostsMetadata() {
  const posts = getPosts().map((post) => {
    const metadata = getPostMetadata(post);

    return { ...post, ...metadata };
  });

  // Sort posts by date
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getRollupPosts(count) {
  const posts = getPosts()
    .map((post) => {
      const metadata = getPostMetadata(post);

      return { slug: post.slug, ...metadata };
    })
    .filter((post) => post.rollup == true)
    .sort((a, b) => {
      // Sort posts by datec
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    })
    .slice(0, count);

  return posts
}

export function getPostMetadata(post) {
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, post.fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  return matterResult.data;
}

export async function getPostData(post) {
  const fullPath = path.join(postsDirectory, post.fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    contentHtml,
    ...matterResult.data,
  };
}

export async function generateRssFeed() {
  const posts = getSortedPostsMetadata();

  const siteURL = process.env.PUBLIC_URL;

  const feed = new Feed({
    title: "Actuated - blog",
    description: "Keep your team productive &amp; focused with blazing fast CI",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/images/actuated.png`,
    updated: new Date(),
  });

  for (const post of posts) {
    const url = `${siteURL}/blog/${post.slug}`;
    const content = (await getPostData(post)).contentHtml;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content,
      author: post.author,
      date: new Date(post.date),
    });
  }

  fs.writeFileSync(path.join(publicDirectory, "rss.xml"), feed.rss2());
}

function getSlug(fileName) {
  return fileName.replace(/\.md$/, "").split("-").slice(3).join("-");
}

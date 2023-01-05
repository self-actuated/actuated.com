import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { Feed } from "feed";

const postsDirectory = path.join(process.cwd(), 'posts');
const publicDirectory = path.join(process.cwd(), 'public');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeHighlight)
    .use(rehypeStringify, {allowDangerousHtml: true})
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

export async function generateRssFeed() {
  const posts = getSortedPostsData()

  const siteURL = process.env.PUBLIC_URL

  const feed = new Feed({
    title: "Actuated - blog",
    description: "Keep your team productive &amp; focused with blazing fast CI",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/images/actuated.png`,
    updated: new Date(),

  })

  for (const post of posts) {
    const url = `${siteURL}/blog/${post.id}`
    const content = (await getPostData(post.id)).contentHtml

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content,
      author: post.author,
      date: new Date(post.date)
    })
  }

  fs.writeFileSync(path.join(publicDirectory, "rss.xml"), feed.rss2())
}

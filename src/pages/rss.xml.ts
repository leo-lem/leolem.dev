import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: URL }) {
  const posts = await getCollection("blog");

  return rss({
    title: "Leo Lemmermann",
    description: "Notes on software, freelancing, habits, and life.",
    site: context.site,
    items: posts
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.short,
        link: `/blog/${post.slug}/`,
      })),
  });
}
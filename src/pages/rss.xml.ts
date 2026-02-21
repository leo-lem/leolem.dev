import rss from "@astrojs/rss";

import { getBlog } from "../content";

export async function GET(context: { site: URL }) {
  const posts = await getBlog();

  return rss({
    title: "Leopold Lemmermann",
    description: "Notes on software, freelancing, habits, and life.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.short,
        link: `/blog/${post.slug}/`,
      })),
  });
}
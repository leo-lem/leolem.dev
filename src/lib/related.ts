export function categoriesFromTopics(topics: { data: { category: string } }[]): string[] {
  return [...new Set(topics.map((s) => s.data.category))];
}

export function relatedArticlesByTags<T extends { slug: string; data: { tags: string[] } }>(
  all: T[],
  slug: string,
  tags: string[],
  limit = 3
) {
  const tagSet = new Set(tags);

  return all
    .filter((e) => e.slug !== slug)
    .map((e) => ({
      e,
      score: e.data.tags.reduce((acc, t) => acc + (tagSet.has(t) ? 1 : 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.e)
    .slice(0, limit);
}

export function relatedProjectsFor(all: { data: { articles: string[] } }[], slug: string, limit = 3) {
  return all
    .filter(({ data: { articles } }) => articles.includes(slug))
    .slice(0, limit);
}

export function relatedArticlesFor(all: { slug: string }[], slugs: string[], limit = 3) {
  return all
    .filter(({ slug }) => slugs.includes(slug))
    .slice(0, limit);
}
export function categoriesFromTopics(topics: { data: { category: string } }[]): string[] {
  return [...new Set(topics.map((s) => s.data.category))];
}

export function relatedArticlesByTags<T extends { slug: string; data: { tags: string[]; date: Date } }>(
  all: T[],
  slug: string,
  tags: string[],
  limit = 3
) {
  const tagSet = new Set(tags);
  const pool = all.filter((e) => e.slug !== slug);

  const scored = pool
    .map((e) => ({
      e,
      score: e.data.tags.reduce((acc, t) => acc + (tagSet.has(t) ? 1 : 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.map((x) => x.e).slice(0, limit);

  if (picked.length < limit) {
    const pickedSlugs = new Set(picked.map((p) => p.slug));

    const fallback = pool
      .filter((e) => !pickedSlugs.has(e.slug))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .slice(0, limit - picked.length);

    picked.push(...fallback);
  }

  return picked;
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
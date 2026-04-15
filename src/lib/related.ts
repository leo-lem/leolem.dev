export function categoriesFromTopics(topics: { data: { category: string } }[]): string[] {
  return [...new Set(topics.map((s) => s.data.category))];
}

export function relatedArticlesByTags<T extends { id: string; data: { tags: string[]; date: Date } }>(
  all: T[],
  id: string,
  tags: string[],
  limit = 3
) {
  const tagSet = new Set(tags);
  const pool = all.filter((e) => e.id !== id);

  const scored = pool
    .map((e) => ({
      e,
      score: e.data.tags.reduce((acc, t) => acc + (tagSet.has(t) ? 1 : 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.map((x) => x.e).slice(0, limit);

  if (picked.length < limit) {
    const pickedIds = new Set(picked.map((p) => p.id));

    const fallback = pool
      .filter((e) => !pickedIds.has(e.id))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .slice(0, limit - picked.length);

    picked.push(...fallback);
  }

  return picked;
}

export function relatedProjectsFor(all: { id: string }[], ids: string[], limit = 3) {
  return all
    .filter(({ id }) => ids.includes(id))
    .slice(0, limit);
}

export function relatedArticlesFor(all: { data: { projects: string[] } }[], projectId: string, limit = 3) {
  return all
    .filter(({ data }) => data.projects.includes(projectId))
    .slice(0, limit);
}
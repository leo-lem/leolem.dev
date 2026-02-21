export function byDateDesc(a: { data: { date: Date } }, b: { data: { date: Date } }): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function byFeaturedThenTitle(a: { data: { featured: boolean; title: string } }, b: { data: { featured: boolean; title: string } }): number {
  if (a.data.featured && !b.data.featured) return -1;
  if (!a.data.featured && b.data.featured) return 1;
  return a.data.title.localeCompare(b.data.title, undefined, { sensitivity: "base" });
}

export function byFeaturedThenDateDesc(a: { data: { featured: boolean; date: Date } }, b: { data: { featured: boolean; date: Date } }): number {
  if (a.data.featured && !b.data.featured) return -1;
  if (!a.data.featured && b.data.featured) return 1;
  return byDateDesc(a, b);
}

export function byPriorityThenConfidence(a: { data: { isPriority?: boolean; confidence?: number } }, b: { data: { isPriority?: boolean; confidence?: number } }): number {
  if ((a.data.isPriority ?? false) && !(b.data.isPriority ?? false)) return -1;
  if (!(a.data.isPriority ?? false) && (b.data.isPriority ?? false)) return 1;

  const ac = a.data.confidence ?? 0;
  const bc = b.data.confidence ?? 0;
  return bc - ac;
}

export function onlyFeatured(item: { data: { featured: boolean } }): boolean {
  return item.data.featured;
}

export function onlyNonFeatured(item: { data: { featured: boolean } }): boolean {
  return !item.data.featured;
}

export function onlyPublished(item: { data: { date: Date } }): boolean {
  return import.meta.env.DEV || item.data.date <= new Date();;
}
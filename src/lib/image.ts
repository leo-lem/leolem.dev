import { type ImageMetadata } from "astro";

type GlobMap = Record<string, () => Promise<{ default: ImageMetadata }>>;

let images: GlobMap | null = null;

function getImages(): GlobMap {
  if (images) return images;

  const hasGlob = typeof (import.meta as unknown as { glob?: unknown }).glob === "function";
  images = hasGlob
    ? (import.meta.glob<{ default: ImageMetadata }>("/src/assets/**/*") as GlobMap)
    : ({} as GlobMap);

  return images;
}

export function pickThumbnailKey(keys: string[], src: string): string | null {
  const dir = src.includes("/") ? src.slice(0, src.lastIndexOf("/") + 1) : "";
  const base = src.includes("/") ? src.slice(src.lastIndexOf("/") + 1) : src;

  const exts = ["png", "jpg", "jpeg", "webp", "avif"];

  const direct = exts.map((ext) => `${dir}${base}.${ext}`);
  for (const c of direct) {
    const hit = keys.find((k) => k.endsWith(c));
    if (hit) return hit;
  }

  const fallback = exts.map((ext) => `${dir}default.${ext}`);
  for (const c of fallback) {
    const hit = keys.find((k) => k.endsWith(c));
    if (hit) return hit;
  }

  return null;
}

export async function thumbnail(src: string): Promise<ImageMetadata> {
  const map = getImages();
  const keys = Object.keys(map);
  const key = pickThumbnailKey(keys, src);
  if (!key) throw new Error(`Thumbnail not found for "${src}"`);

  const mod = await map[key]();
  return mod.default;
}
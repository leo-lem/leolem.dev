import { type ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>("/src/assets/**/*");

export async function thumbnail(src: string): Promise<ImageMetadata> {
  const dir = src.includes("/") ? src.slice(0, src.lastIndexOf("/") + 1) : "";
  const name = src.split("/").pop();

  const primary = Object.entries(images).find(([p]) =>
    p.startsWith(`/src/assets/${dir}${name}.`)
  )?.[1];

  if (primary) return (await primary()).default;

  const fallback = Object.entries(images).find(([p]) =>
    p.startsWith(`/src/assets/${dir}default.`)
  )?.[1];

  if (!fallback) throw new Error(`Image not found: ${src}`);

  return (await fallback()).default;
}
import { test, expect } from "@playwright/test";
import { pickThumbnailKey } from "../../src/lib/image";

test("pickThumbnailKey prefers exact match over default", async () => {
  const keys = [
    "/src/assets/blog/default.png",
    "/src/assets/blog/uni/exchange.jpg",
  ];

  expect(pickThumbnailKey(keys, "blog/uni/exchange")).toBe(
    "/src/assets/blog/uni/exchange.jpg"
  );
});

test("pickThumbnailKey falls back to directory default", async () => {
  const keys = ["/src/assets/blog/default.png"];

  expect(pickThumbnailKey(keys, "blog/nope")).toBe("/src/assets/blog/default.png");
});

test("pickThumbnailKey returns null when nothing matches", async () => {
  const keys: string[] = [];
  expect(pickThumbnailKey(keys, "blog/nope")).toBe(null);
});
import { test, expect } from "@playwright/test";
import {
  relatedArticlesByTags,
  relatedProjectsFor,
  relatedArticlesFor,
  categoriesFromTopics,
} from "../../src/lib";

test("relatedArticlesByTags excludes self, scores by tag overlap, limits output", async () => {
  const all = [
    { slug: "a", data: { tags: ["x", "y"] } },
    { slug: "b", data: { tags: ["y"] } },
    { slug: "c", data: { tags: ["y", "z"] } },
    { slug: "d", data: { tags: ["z"] } },
  ];

  const out = relatedArticlesByTags(all, "a", ["y"], 2);

  expect(out.some((x) => x.slug === "a")).toBe(false);
  expect(out.length).toBeLessThanOrEqual(2);
  expect(out.every((x) => x.data.tags.includes("y"))).toBe(true);
});

test("relatedProjectsFor returns projects that include the article slug", async () => {
  const all = [
    { data: { articles: ["vigil/framework"] } },
    { data: { articles: ["other"] } },
    { data: { articles: ["vigil/framework", "x"] } },
  ];

  const out = relatedProjectsFor(all, "vigil/framework", 10);
  expect(out.length).toBe(2);
});

test("relatedArticlesFor returns only articles in slug list and respects limit", async () => {
  const all = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];
  const out = relatedArticlesFor(all, ["b", "c"], 1);

  expect(out.length).toBe(1);
  expect(out[0].slug === "b" || out[0].slug === "c").toBe(true);
});

test("categoriesFromTopics returns unique categories", async () => {
  const topics = [
    { data: { category: "Backend" } },
    { data: { category: "Backend" } },
    { data: { category: "Infra" } },
  ];

  const out = categoriesFromTopics(topics);
  expect(out.includes("Backend")).toBe(true);
  expect(out.includes("Infra")).toBe(true);
  expect(out.length).toBe(2);
});
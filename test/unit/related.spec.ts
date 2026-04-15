import { test, expect } from "@playwright/test";
import {
  relatedArticlesByTags,
  relatedProjectsFor,
  relatedArticlesFor,
  categoriesFromTopics,
} from "../../src/lib";

test("relatedArticlesByTags excludes self, scores by tag overlap, limits output", async () => {
  const all = [
    { id: "a", data: { tags: ["x", "y"], date: new Date() } },
    { id: "b", data: { tags: ["y"], date: new Date() } },
    { id: "c", data: { tags: ["y", "z"], date: new Date() } },
    { id: "d", data: { tags: ["z"], date: new Date() } },
  ];

  const out = relatedArticlesByTags(all, "a", ["y"], 2);

  expect(out.some((x) => x.id === "a")).toBe(false);
  expect(out.length).toBeLessThanOrEqual(2);
  expect(out.every((x) => x.data.tags.includes("y"))).toBe(true);
});

test("relatedProjectsFor returns projects with the specified IDs", async () => {
  const all = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const out = relatedProjectsFor(all, new Set(["b", "c"]), 1);

  expect(out.length).toBe(1);
  expect(out[0].id === "b" || out[0].id === "c").toBe(true);
});

test("relatedArticlesFor returns articles related to the specified project", async () => {
  const all = [
    { data: { projects: ["vigil"] } },
    { data: { projects: ["other"] } },
    { data: { projects: ["vigil", "x"] } },
  ];

  const out = relatedArticlesFor(all, "vigil", 10);
  expect(out.length).toBe(2);
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
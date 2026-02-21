import { test, expect } from "@playwright/test";

import {
  byDateDesc,
  byFeaturedThenTitle,
  byFeaturedThenDateDesc,
  byPriorityThenConfidence,
  onlyFeatured,
  onlyNonFeatured,
  onlyPublished
} from "../../src/lib/sort";

function itemWithDate(iso: string) {
  return { data: { date: new Date(iso) } };
}

function itemWithFeaturedTitle(featured: boolean, title: string) {
  return { data: { featured, title } };
}

function itemWithFeaturedDate(featured: boolean, iso: string) {
  return { data: { featured, date: new Date(iso) } };
}

function itemWithPriorityConfidence(isPriority?: boolean, confidence?: number) {
  return { data: { isPriority, confidence } };
}

test("byDateDesc sorts newer first", async () => {
  const newer = itemWithDate("2026-02-10T00:00:00.000Z");
  const older = itemWithDate("2026-01-10T00:00:00.000Z");

  expect(byDateDesc(newer, older)).toBeLessThan(0);
  expect(byDateDesc(older, newer)).toBeGreaterThan(0);
  expect(byDateDesc(newer, newer)).toBe(0);

  const arr = [older, newer].sort(byDateDesc);
  expect(arr[0]).toBe(newer);
  expect(arr[1]).toBe(older);
});

test("byFeaturedThenTitle sorts featured first, then title (case-insensitive)", async () => {
  const fa = itemWithFeaturedTitle(true, "Beta");
  const fb = itemWithFeaturedTitle(true, "alpha");
  const na = itemWithFeaturedTitle(false, "A");
  const nb = itemWithFeaturedTitle(false, "b");

  expect(byFeaturedThenTitle(fa, na)).toBeLessThan(0);
  expect(byFeaturedThenTitle(na, fa)).toBeGreaterThan(0);

  const featuredSorted = [fa, fb].sort(byFeaturedThenTitle);
  expect(featuredSorted[0]).toBe(fb);
  expect(featuredSorted[1]).toBe(fa);

  const nonFeaturedSorted = [nb, na].sort(byFeaturedThenTitle);
  expect(nonFeaturedSorted[0]).toBe(na);
  expect(nonFeaturedSorted[1]).toBe(nb);

  const mixed = [na, fa, nb, fb].sort(byFeaturedThenTitle);
  expect(mixed.slice(0, 2).every((x) => x.data.featured)).toBe(true);
  expect(mixed.slice(2).every((x) => !x.data.featured)).toBe(true);
  expect(mixed[0]).toBe(fb);
  expect(mixed[1]).toBe(fa);
});

test("byFeaturedThenDateDesc sorts featured first, then date desc", async () => {
  const fOld = itemWithFeaturedDate(true, "2026-01-01T00:00:00.000Z");
  const fNew = itemWithFeaturedDate(true, "2026-02-01T00:00:00.000Z");
  const nOld = itemWithFeaturedDate(false, "2026-01-05T00:00:00.000Z");
  const nNew = itemWithFeaturedDate(false, "2026-02-05T00:00:00.000Z");

  expect(byFeaturedThenDateDesc(fNew, nNew)).toBeLessThan(0);
  expect(byFeaturedThenDateDesc(nNew, fNew)).toBeGreaterThan(0);

  const featuredSorted = [fOld, fNew].sort(byFeaturedThenDateDesc);
  expect(featuredSorted[0]).toBe(fNew);
  expect(featuredSorted[1]).toBe(fOld);

  const nonFeaturedSorted = [nOld, nNew].sort(byFeaturedThenDateDesc);
  expect(nonFeaturedSorted[0]).toBe(nNew);
  expect(nonFeaturedSorted[1]).toBe(nOld);

  const mixed = [nOld, fOld, nNew, fNew].sort(byFeaturedThenDateDesc);
  expect(mixed.slice(0, 2).every((x) => x.data.featured)).toBe(true);
  expect(mixed.slice(2).every((x) => !x.data.featured)).toBe(true);
  expect(mixed[0]).toBe(fNew);
  expect(mixed[1]).toBe(fOld);
  expect(mixed[2]).toBe(nNew);
  expect(mixed[3]).toBe(nOld);
});

test("byPriorityThenConfidence sorts priority first, then confidence desc (defaults)", async () => {
  const pLow = itemWithPriorityConfidence(true, 1);
  const pHigh = itemWithPriorityConfidence(true, 10);
  const nHigh = itemWithPriorityConfidence(false, 10);
  const nLow = itemWithPriorityConfidence(false, 1);
  const nDefault = itemWithPriorityConfidence(undefined, undefined);

  expect(byPriorityThenConfidence(pLow, nHigh)).toBeLessThan(0);
  expect(byPriorityThenConfidence(nHigh, pLow)).toBeGreaterThan(0);

  const prioSorted = [pLow, pHigh].sort(byPriorityThenConfidence);
  expect(prioSorted[0]).toBe(pHigh);
  expect(prioSorted[1]).toBe(pLow);

  const nonPrioSorted = [nLow, nHigh].sort(byPriorityThenConfidence);
  expect(nonPrioSorted[0]).toBe(nHigh);
  expect(nonPrioSorted[1]).toBe(nLow);

  const defaultsSorted = [nLow, nDefault].sort(byPriorityThenConfidence);
  expect(defaultsSorted[0]).toBe(nLow);
  expect(defaultsSorted[1]).toBe(nDefault);

  const mixed = [nLow, pLow, nHigh, pHigh, nDefault].sort(byPriorityThenConfidence);
  expect(mixed[0]).toBe(pHigh);
  expect(mixed[1]).toBe(pLow);
  expect(mixed[2]).toBe(nHigh);
  expect(mixed[3]).toBe(nLow);
  expect(mixed[4]).toBe(nDefault);
});

test("onlyFeatured / onlyNonFeatured behave correctly", async () => {
  const f = { data: { featured: true } };
  const n = { data: { featured: false } };

  expect(onlyFeatured(f)).toBe(true);
  expect(onlyFeatured(n)).toBe(false);

  expect(onlyNonFeatured(f)).toBe(false);
  expect(onlyNonFeatured(n)).toBe(true);
});


test("onlyPublished includes past and now, excludes future in non-dev runtime", () => {
  const now = new Date();
  const past = { data: { date: new Date(now.getTime() - 60_000) } };
  const future = { data: { date: new Date(now.getTime() + 60_000) } };

  expect(onlyPublished(past)).toBe(true);
  expect(onlyPublished({ data: { date: now } })).toBe(true);
  expect(onlyPublished(future)).toBe(false);
});
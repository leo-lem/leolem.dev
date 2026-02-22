import { test, expect } from "@playwright/test";
import { formatDate } from "../../src/lib/date";

test("formatDate returns a non-empty string and includes the year", async () => {
  const d = new Date("2026-02-15T12:00:00Z");
  const s = formatDate(d);

  expect(typeof s).toBe("string");
  expect(s.length).toBeGreaterThan(0);
  expect(s).toContain("2026");
});
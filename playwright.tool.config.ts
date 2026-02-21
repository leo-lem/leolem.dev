import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "test/tool",
  timeout: 10_000,
  fullyParallel: true
});
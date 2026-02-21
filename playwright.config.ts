import { devices, type Config } from "@playwright/test";

export default {
  testDir: "test",
  testIgnore: ["test/tool/**"],

  retries: process.env.CI ? 1 : 0,
  outputDir: "/tmp/playwright",
  reporter: process.env.CI ? "github" : "list",

  webServer: {
    url: process.env.BASE_URL || "http://localhost:4321",
    command: "npm start",
    reuseExistingServer: true
  },

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4321",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    { name: "Desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile", use: { ...devices["iPhone 16"] } },
  ],
} as Config;
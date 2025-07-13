import { devices, type Config } from "@playwright/test";

const config: Config = {
  testDir: "test",
  retries: 1,
  outputDir: "/tmp/playwright",
  reporter: process.env.CI ? "github" : "list",

  webServer: {
    url: process.env.BASE_URL || "http://localhost:3000",
    command: "npm start",
    reuseExistingServer: true
  },

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    { name: "Desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile", use: { ...devices["iPhone 16"] } },
  ],
};

export default config;
import { co2 as CO2 } from "@tgwf/co2";
import fetch from "node-fetch";
import { writeFileSync, readFileSync, existsSync } from "fs";
import Sitemap from "sitemapper";

const BASELINE_FILE = "baseline.co2";

function getBaselineCO2(): number | null {
  const { CO2_BASELINE } = process.env;

  let baseline = null;
  if (CO2_BASELINE)
    baseline = parseFloat(CO2_BASELINE);
  else if (existsSync(BASELINE_FILE))
    baseline = parseFloat(readFileSync(BASELINE_FILE, "utf-8"));

  if (!baseline || isNaN(baseline))
    console.warn("No valid baseline CO₂ found. Using null.");

  return baseline;
}

async function getUrls(): Promise<string[]> {
  const { TARGET_URL } = process.env;

  if (!TARGET_URL)
    throw new Error("Environment variable TARGET_URL must be set.");

  const sitemap = new Sitemap();
  const result = await sitemap.fetch(`${TARGET_URL}/sitemap.xml`);
  return result.sites;
}

async function checkCO2() {
  const calc = new CO2({});
  let totalCO2 = 0;

  for (const url of await getUrls()) {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch ${url}: ${response.status}`);

    const pageSize = parseInt(response.headers.get("content-length") || "0", 10);
    const co2 = calc.perByte(pageSize) as number;

    totalCO2 += co2;
  }

  const baseline = getBaselineCO2();
  const isRegression = baseline && totalCO2 > baseline;

  if (!isRegression)
    writeFileSync(BASELINE_FILE, totalCO2.toString(), "utf-8");

  if (process.env.GITHUB_STEP_SUMMARY)
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, `
### CO₂ Check Summary
| Metric   | Value         |
|----------|---------------|
| **Current CO₂** | ${totalCO2.toFixed(6)}g |
| **Baseline CO₂** | ${baseline ? baseline.toFixed(6) + "g" : "Not set"} |
| **Regression** | ${isRegression ? "⚠️ **YES**" : "✅ No"} |

`, { flag: "a" });

  console.log(isRegression && baseline
    ? `Regression detected! CO₂ increased from ${baseline.toFixed(6)}g to ${totalCO2.toFixed(6)}g`
    : `No CO₂ regression detected (${totalCO2.toFixed(6)}g).`);
  process.exit(isRegression ? 1 : 0);
}

checkCO2().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
import { co2 as CO2 } from "@tgwf/co2";
import fetch from "node-fetch";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { parseStringPromise } from 'xml2js';

const BASELINE_FILE = "baseline.co2";

function getBaselineCO2(): number | null {
  const { CO2_BASELINE } = process.env;

  let baseline = null;
  if (CO2_BASELINE)
    baseline = Number.parseFloat(CO2_BASELINE);
  else if (existsSync(BASELINE_FILE))
    baseline = Number.parseFloat(readFileSync(BASELINE_FILE, "utf-8"));

  if (baseline === null || Number.isNaN(baseline) || baseline < 0)
    console.warn(baseline === null ? "No CO₂ baseline found." : `CO₂ baseline '${baseline}' is invalid. Using null.`);

  return baseline;
}

export async function getUrlsFromSitemapIndex(): Promise<string[]> {
  const { BASE_URL } = process.env;

  if (!BASE_URL)
    throw new Error("Environment variable BASE_URL must be set.");

  const urls: string[] = [];

  const res = await fetch(`${BASE_URL}/sitemap-index.xml`);
  const xml = await res.text();
  const parsedIndex = await parseStringPromise(xml);

  const sitemapUrls = parsedIndex.sitemapindex.sitemap.map((s: any) => s.loc[0]);

  for (const sitemapUrl of sitemapUrls) {
    const res = await fetch(sitemapUrl);
    const xml = await res.text();
    try {
      const parsed = await parseStringPromise(xml);
      const pageUrls = parsed.urlset.url.map((u: any) => u.loc[0]);
      urls.push(...pageUrls);
    } catch (error) {
      throw new Error(`Failed to parse sitemap ${sitemapUrl}:\n\n${error}`);
    }
  }

  return urls;
}

async function checkCO2() {
  const calc = new CO2({ model: "swd", version: 4 });
  let totalCO2 = 0;

  for (const url of await getUrlsFromSitemapIndex()) {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    const contentLength = response.headers.get("content-length");
    const pageSize = contentLength ? Number.parseInt(contentLength, 10) : (await response.arrayBuffer()).byteLength;
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

try {
  await checkCO2();
} catch (error) {
  console.error("An error occurred:", error);
  process.exit(1);
}
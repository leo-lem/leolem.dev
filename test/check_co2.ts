import { co2 as CO2 } from "@tgwf/co2";
import fetch from "node-fetch";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { parseStringPromise } from 'xml2js';

const BASELINE_FILE = "baseline.co2";

function getBaselineCO2(): number | null {
  const { CO2_BASELINE } = process.env;

  let baseline = null;
  if (CO2_BASELINE)
    baseline = parseFloat(CO2_BASELINE);
  else if (existsSync(BASELINE_FILE))
    baseline = parseFloat(readFileSync(BASELINE_FILE, "utf-8"));

  if (baseline === null || isNaN(baseline) || baseline < 0)
    console.warn(baseline !== null ? `CO₂ baseline '${baseline}' is invalid. Using null.` : "No CO₂ baseline found.");

  return baseline;
}

export async function getUrlsFromSitemapIndex(): Promise<string[]> {
  const { TARGET_URL } = process.env;

  if (!TARGET_URL)
    throw new Error("Environment variable TARGET_URL must be set.");

  const urls: string[] = [];

  const res = await fetch(`${TARGET_URL}/sitemap-index.xml`);
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
  const calc = new CO2({});
  let totalCO2 = 0;

  for (const url of await getUrlsFromSitemapIndex()) {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    const contentLength = response.headers.get("content-length");
    const pageSize = contentLength ? parseInt(contentLength, 10) : (await response.arrayBuffer()).byteLength;
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
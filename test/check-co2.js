import { co2 } from '@tgwf/co2';
import fetch from 'node-fetch';
import { writeFileSync, readFileSync, existsSync } from 'fs';

async function main() {
  const url = process.env.TARGET_URL;
  const baselineFile = 'baseline-co2.txt';
  let baseline = 0;

  if (existsSync(baselineFile)) {
    baseline = parseFloat(readFileSync(baselineFile, 'utf-8')) || 0;
  }

  const response = await fetch(url);
  const pageSize = parseInt(response.headers.get('content-length'), 10) || 0;

  const co2calc = new co2();
  const newCo2 = co2calc.perByte(pageSize);

  const isRegression = baseline && newCo2 > baseline;

  console.log(`CO₂ for ${url}: ${newCo2.toFixed(6)} g`);

  // Build Markdown summary
  const summary = `
### 🌱 CO₂ Check Result

| Metric | Value |
|--------|-------|
| **URL** | ${url} |
| **Page Size** | ${(pageSize / 1024).toFixed(2)} KB |
| **Current CO₂** | ${newCo2.toFixed(6)} g |
| **Baseline CO₂** | ${baseline ? baseline.toFixed(6) + ' g' : 'Not set'} |
| **Regression** | ${isRegression ? '⚠️ **YES**' : '✅ No'} |

`;

  writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary, { flag: 'a' });

  if (isRegression) {
    console.error(`Regression detected! CO₂ increased from ${baseline.toFixed(6)} g to ${newCo2.toFixed(6)} g`);
    process.exit(1);
  } else {
    console.log('No CO₂ regression detected.');
  }

  // Save current CO₂ as new baseline
  writeFileSync(baselineFile, newCo2.toString(), 'utf-8');
}

main();
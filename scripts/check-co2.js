import { co2 } from '@tgwf/co2';
import fetch from 'node-fetch';

async function main() {
  const url = process.env.TARGET_URL;
  const baseline = parseFloat(process.env.BASELINE_CO2 || '0');

  const response = await fetch(url);
  const pageSize = parseInt(response.headers.get('content-length'), 10) || 0;

  const co2calc = new co2();
  const newCo2 = co2calc.perByte(pageSize);

  console.log(`CO2 for ${url}: ${newCo2.toFixed(6)} g`);

  if (baseline && newCo2 > baseline) {
    console.error(`Regression detected! CO2 increased from ${baseline.toFixed(6)} g to ${newCo2.toFixed(6)} g`);
    process.exit(1);
  } else {
    console.log('No CO2 regression detected.');
  }
}

main();
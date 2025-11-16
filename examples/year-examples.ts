import { CronFormat } from "../src/cron-format";

// Create formatters for English and Spanish
const formatterEn = new CronFormat("en");
const formatterEs = new CronFormat("es");

console.log("=== Year Field Examples ===\n");

// Example 1: Every 4th year
const cron1 = "2-7 4 5,7 4,6,10 3,5 */4";
console.log(`Expression: ${cron1}`);
console.log(`English: ${formatterEn.format(cron1)}`);
console.log(`Spanish: ${formatterEs.format(cron1)}`);
console.log();

// Example 2: Specific year (2025)
const cron2 = "2-7 4 5,7 4,6,10 3,5 2025";
console.log(`Expression: ${cron2}`);
console.log(`English: ${formatterEn.format(cron2)}`);
console.log(`Spanish: ${formatterEs.format(cron2)}`);
console.log();

// Example 3: Without year field (defaults to any year)
const cron3 = "0 9 * * MON-FRI";
console.log(`Expression: ${cron3}`);
console.log(`English: ${formatterEn.format(cron3)}`);
console.log(`Spanish: ${formatterEs.format(cron3)}`);

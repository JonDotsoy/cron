import { CronFormat } from "../src/cron-format";
import { ColloquialCronFormat } from "../src/idioms/colloquial-cron-format";
import { Cron } from "../src/cron";
import { randomSpec } from "../src/utils";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

// Load or generate 100 random examples
const memoPath = join(__dirname, "examples.memo.json");
let expresions: string[];

if (existsSync(memoPath)) {
  console.log(`✓ Loading examples from ${memoPath}`);
  const memoContent = readFileSync(memoPath, "utf-8");
  expresions = JSON.parse(memoContent);
} else {
  console.log(`✓ Generating 100 random examples using randomSpec()`);
  const uniqueExpressions = new Set<string>();

  // Generate until we have 100 unique expressions
  while (uniqueExpressions.size < 100) {
    const spec = randomSpec();
    const cron = Cron.fromSpec(spec);
    uniqueExpressions.add(cron.expression);
  }

  expresions = Array.from(uniqueExpressions);
  writeFileSync(memoPath, JSON.stringify(expresions, null, 2), "utf-8");
  console.log(`✓ Saved examples to ${memoPath}`);
}

const locales = ["en", "es"];

const idioms = ["es-CL-Flaite"];

function generateMarkdown(): string {
  let markdown = "# Cron Expression Examples\n\n";
  markdown += "This file is auto-generated from `examples/examples.ts`.\n\n";

  // Create formatters
  const formatters = new Map<string, CronFormat | ColloquialCronFormat>();
  for (const locale of locales) {
    formatters.set(locale, new CronFormat(locale));
  }
  for (const idiom of idioms) {
    formatters.set(idiom, new ColloquialCronFormat(idiom));
  }

  // Generate examples with all translations in a list
  for (const expression of expresions) {
    markdown += `- \`${expression}\`\n`;

    for (const locale of locales) {
      const formatter = formatters.get(locale)!;
      const description = formatter.format(expression);
      markdown += `  - **${locale}**: ${description}\n`;
    }

    for (const idiom of idioms) {
      const formatter = formatters.get(idiom)!;
      const description = formatter.format(expression);
      markdown += `  - **${idiom}**: ${description}\n`;
    }

    markdown += "\n";
  }

  return markdown;
}

// Generate and write the markdown file
const markdown = generateMarkdown();
const outputPath = join(__dirname, "examples.md");
writeFileSync(outputPath, markdown, "utf-8");
console.log(`✓ Generated ${outputPath}`);

// Format the generated file
const { spawnSync } = await import("child_process");
const result = spawnSync("bun", ["fmt", outputPath], { stdio: "inherit" });
if (result.status === 0) {
  console.log(`✓ Formatted ${outputPath}`);
}

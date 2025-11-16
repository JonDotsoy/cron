import { CronFormat } from "../src/cron-format";
import { IdiomsCronFormat } from "../src/idioms/idioms-cron-format";
import { writeFileSync } from "fs";
import { join } from "path";

const expresions = [
  "2-7 4 5,7 4,6/4 5,3",
  "0 4 8-14 * *",
  "0 0 1,15 * 3",
  "@weekly",
  "5 0 * 8 *",
  "0 22 * * 1-5",
  "0 0,12 1 */2 *",
  "0 4 8-14 * *",
  "0 0 1,15 * 3",
  "15 14 1 * *",
];

const locales = ["en", "es"];

const idioms = ["es-CL-Flaite"];

function generateMarkdown(): string {
  let markdown = "# Cron Expression Examples\n\n";
  markdown += "This file is auto-generated from `examples/examples.ts`.\n\n";

  // Generate examples for standard locales
  for (const locale of locales) {
    markdown += `## Locale: ${locale}\n\n`;
    const formatter = new CronFormat(locale);

    for (const expression of expresions) {
      const description = formatter.format(expression);
      markdown += `- \`${expression}\` → ${description}\n`;
    }
    markdown += "\n";
  }

  // Generate examples for idioms
  for (const idiom of idioms) {
    markdown += `## Idiom: ${idiom}\n\n`;
    const formatter = new IdiomsCronFormat(idiom);

    for (const expression of expresions) {
      const description = formatter.format(expression);
      markdown += `- \`${expression}\` → ${description}\n`;
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

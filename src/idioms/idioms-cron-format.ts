// src/idioms/idioms-cron-format.ts

import {
  CronFormat,
  type ICronFormatter,
  type CronExpression,
  type CronFormatPart,
} from "../cron-format";
import { Cron } from "../cron";
import { idiomsLocales } from "./idioms-locales";
import type { LocaleDictionary } from "../locales";

/**
 * Formateador de expresiones CRON a lenguaje natural con soporte para idiomas coloquiales.
 * Extiende CronFormat para incluir variantes como "es-CL-Flaite".
 */
export class IdiomsCronFormat implements ICronFormatter {
  private readonly localeString: string;
  private readonly localeDictionary: LocaleDictionary;
  private readonly baseFormatter: CronFormat;

  constructor(locale: string | Intl.Locale) {
    // Store the original locale string
    this.localeString = typeof locale === "string" ? locale : locale.toString();

    // Try to get idioms locale first using the full locale string
    this.localeDictionary =
      idiomsLocales[this.localeString] ?? idiomsLocales["en"]!;

    // Create base formatter with a simple locale (es for es-CL-Flaite)
    const baseLocale = this.localeString.split("-")[0] || "en";
    this.baseFormatter = new CronFormat(baseLocale);

    // Override the localeDictionary in the base formatter
    (this.baseFormatter as any).localeDictionary = this.localeDictionary;
  }

  format(cronExpression: Cron | CronExpression): string {
    let result = this.baseFormatter.format(cronExpression);

    // Post-process for es-CL-Flaite: fix formatting
    if (this.localeString === "es-CL-Flaite") {
      // Fix "días X o Y" to "días X y Y"
      result = result.replace(/días (\d+) o (\d+)/, "días $1 y $2");
      // Fix "en X o Y o Z" to "en X, Y y Z,"
      result = result.replace(
        / en ([\wáéíóú]+) o ([\wáéíóú]+) o ([\wáéíóú]+)/,
        " en $1, $2 y $3,",
      );
      // Remove double commas
      result = result.replace(/,,/g, ",");
      // Remove spaces before commas
      result = result.replace(/ ,/g, ",");
      // Remove extra spaces
      result = result.replace(/  +/g, " ");
    }

    return result;
  }

  formatToParts(cronExpression: Cron | CronExpression): CronFormatPart[] {
    return this.baseFormatter.formatToParts(cronExpression);
  }
}

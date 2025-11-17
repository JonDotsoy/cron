# Cron

Cron expression parser and scheduler that generates execution times based on cron syntax.

## Features

- Full cron syntax support with 5 or 6 fields
- Special expressions (@yearly, @monthly, @weekly, @daily, @hourly)
- Month and day names support
- Iterator-based API for generating execution times
- Built-in scheduler with `setInterval`
- Human-readable cron expression formatting with i18n support
- TypeScript support with full type definitions

## Installation

```bash
npm install @jondotsoy/cron
# or
bun install @jondotsoy/cron
```

## Usage

### Basic Usage

```typescript
import { Cron } from "@jondotsoy/cron";

// Create a cron instance with an expression
const cron = new Cron("0 22 * * 1-5");

// Iterate over the next execution times
let count = 0;
for (const datetime of cron) {
  console.log(datetime.toString());
  // Break after getting the first 5 occurrences
  if (count++ >= 4) break;
}
```

### Get Next Execution Time

```typescript
import { Cron } from "@jondotsoy/cron";

const cron = new Cron("0 9 * * MON-FRI");
const nextExecution = Cron.next(cron);
console.log(`Next execution: ${nextExecution.toString()}`);
```

### Schedule with setInterval

```typescript
import { Cron } from "@jondotsoy/cron";

const cron = new Cron("*/5 * * * *"); // Every 5 minutes

const { promise, abort } = Cron.setInterval(() => {
  console.log("Task executed at:", new Date().toISOString());
}, cron);

// Stop the scheduler after some time
setTimeout(() => {
  abort();
  console.log("Scheduler stopped");
}, 60000);

// Wait for the scheduler to complete
await promise;
```

### Using the `using` keyword (TypeScript 5.2+)

The `setInterval` return value supports the `using` keyword for automatic resource disposal:

```typescript
import { Cron } from "@jondotsoy/cron";

{
  using cronInterval = Cron.setInterval(() => {
    console.log("Task executed at:", new Date().toISOString());
  }, new Cron("*/5 * * * *"));

  // The interval will automatically be aborted when exiting this scope
}
// Scheduler is automatically stopped here
```

### Using the `await using` keyword (TypeScript 5.2+)

For async disposal that waits for the scheduler to fully complete:

```typescript
import { Cron } from "@jondotsoy/cron";

{
  await using cronInterval = Cron.setInterval(() => {
    console.log("Task executed at:", new Date().toISOString());
  }, new Cron("@reboot")); // Executes once immediately

  // The interval will automatically be aborted and awaited when exiting this scope
}
// Scheduler is fully stopped and cleaned up here
```

### Format Cron Expressions to Human-Readable Text

Convert cron expressions into natural language descriptions:

```typescript
import { CronFormat } from "@jondotsoy/cron";

// Create a formatter with a locale
const formatter = new CronFormat("en");

// Format a cron expression
console.log(formatter.format("0 22 * * 1-5"));
// Output: "At 22:00 on every day-of-week from Monday through Friday."

console.log(formatter.format("*/5 * * * *"));
// Output: "At every minute."

console.log(formatter.format("@weekly"));
// Output: "At 00:00 on Sunday."
```

### Format to Parts for Custom Rendering

Get structured parts of the formatted expression for custom styling or rendering:

```typescript
import { CronFormat } from "@jondotsoy/cron";

const formatter = new CronFormat("en");
const parts = formatter.formatToParts("0 22 * * 1-5");

// Returns an array of parts with type and value:
// [
//   { type: "literal", value: "At " },
//   { type: "hour", value: "22" },
//   { type: "literal", value: ":" },
//   { type: "minute", value: "00" },
//   { type: "literal", value: " " },
//   { type: "weekday", value: "on every day-of-week from Monday through Friday" },
//   { type: "literal", value: "." }
// ]

// Use parts for custom rendering (e.g., with colors or styles)
parts.forEach((part) => {
  if (part.type === "hour" || part.type === "minute") {
    console.log(`\x1b[36m${part.value}\x1b[0m`); // Cyan for time
  } else if (part.type === "weekday") {
    console.log(`\x1b[33m${part.value}\x1b[0m`); // Yellow for weekday
  } else {
    console.log(part.value);
  }
});
```

### Internationalization Support

CronFormat supports multiple locales:

```typescript
import { CronFormat } from "@jondotsoy/cron";

// English
const formatterEn = new CronFormat("en");
console.log(formatterEn.format("0 22 * * 1-5"));
// Output: "At 22:00 on every day-of-week from Monday through Friday."

// Spanish
const formatterEs = new CronFormat("es");
console.log(formatterEs.format("0 22 * * 1-5"));
// Output: "A las 22:00 cada día de la semana del lunes al viernes."

// Using Intl.Locale
const formatter = new CronFormat(new Intl.Locale("es"));
console.log(formatter.format("@daily"));
// Output: "A las 00:00."
```

Supported locales:

- `en` - English
- `es` - Spanish

## Supported Cron Syntax

### Standard Format

```
* * * * * [year]
│ │ │ │ │
│ │ │ │ └─── day of week (0-7, 0 and 7 are Sunday)
│ │ │ └───── month (1-12 or JAN-DEC)
│ │ └─────── day of month (1-31)
│ └───────── hour (0-23)
└─────────── minute (0-59)
```

The year field is optional.

### Special Characters

- `*` - Any value (matches all)
- `,` - List separator (e.g., `1,3,5`)
- `-` - Range (e.g., `1-5`)
- `/` - Step values (e.g., `*/2` or `1-10/2`)

### Special Expressions

- `@yearly` or `@annually` - Run once a year at midnight on January 1st
- `@monthly` - Run once a month at midnight on the first day
- `@weekly` - Run once a week at midnight on Sunday
- `@daily` or `@midnight` - Run once a day at midnight
- `@hourly` - Run once an hour at the beginning of the hour
- `@reboot` - Run at startup (special case, not iterable)

### Month Names

Months can be specified as numbers (1-12) or names (case-insensitive):
`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`

### Day Names

Days of week can be specified as numbers (0-7, where 0 and 7 are Sunday) or names (case-insensitive):
`SUN`, `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`

## Examples

```typescript
import { Cron } from "@jondotsoy/cron";

// Every minute
new Cron("* * * * *");

// At 22:00 on weekdays (Monday through Friday)
new Cron("0 22 * * 1-5");

// At minute 23 past every 2nd hour from 0 through 20
new Cron("23 0-20/2 * * *");

// At 04:05 on Sunday
new Cron("5 4 * * sun");

// At midnight on the 1st and 15th of each month
new Cron("0 0 1,15 * *");

// Every 2 minutes
new Cron("*/2 * * * *");

// At 04:00 on every day from 8th through 14th
new Cron("0 4 8-14 * *");

// In June, July, and August
new Cron("* * * jun-aug *");

// With specific year
new Cron("0 0 1 1 * 2025");
```

## Testing

Run the test suite:

```bash
bun test
```

## API

### Cron Class

#### `new Cron(rule: string, now?: Temporal.PlainDateTime)`

Creates a new Cron instance.

- `rule`: Cron expression string (5 or 6 fields, or special expression)
- `now`: Optional starting date/time (defaults to current time using `Temporal.Now.plainDateTimeISO()`)

**Properties:**

- `rule`: The original cron expression string
- `now`: The starting date/time
- `spec`: The parsed cron specification (read-only)

### `Cron.next(cron: Cron): Temporal.PlainDateTime`

Returns the next execution time for the given cron instance.

**Parameters:**

- `cron`: The Cron instance to get the next execution time from

**Returns:** The next `Temporal.PlainDateTime` when the cron expression will match

**Throws:** Error if the cron expression is `@reboot` or no next datetime is found

**Example:**

```typescript
const cron = new Cron("0 12 * * *"); // Daily at noon
const nextRun = Cron.next(cron);
console.log(nextRun.toString()); // Next occurrence at 12:00
```

### `Cron.take(cron: Cron, limit?: number): Temporal.PlainDateTime[]`

Returns an array of the next N execution times for the given cron expression.

**Parameters:**

- `cron`: The Cron instance to get execution times from
- `limit`: The number of execution times to return (default: 1)

**Returns:** An array of `Temporal.PlainDateTime` objects when the cron expression will match

**Throws:** Error if the cron expression is `@reboot`

**Example:**

```typescript
const cron = new Cron("0 */6 * * *"); // Every 6 hours
const next5Runs = Cron.take(cron, 5);
next5Runs.forEach((dt) => console.log(dt.toString()));
```

### `Cron.setInterval(callback: () => void, cron: Cron)`

Schedules a callback to run at times matching the cron expression.

**Special behavior for `@reboot`:** Executes the callback immediately once and returns.

Returns an object with:

- `promise`: Promise that resolves when the scheduler is aborted or completes
- `abort()`: Function to stop the scheduler
- `[Symbol.dispose]()`: Function for automatic resource disposal (same as `abort()`)
- `[Symbol.asyncDispose]()`: Async function that aborts and waits for the promise to complete

The returned object implements both the Disposable and AsyncDisposable protocols, allowing it to be used with the `using` and `await using` keywords in TypeScript 5.2+.

#### `cron[Symbol.iterator]()`

Makes the Cron instance iterable, yielding execution times indefinitely.

**Note:** Cannot iterate over `@reboot` expressions (throws an error).

### CronFormat Class

#### `new CronFormat(locale: string | Intl.Locale)`

Creates a new CronFormat instance for formatting cron expressions into human-readable text.

- `locale`: Locale string (e.g., "en", "es") or Intl.Locale object

**Supported locales:** `en` (English), `es` (Spanish)

#### `format(cronExpression: Cron | string): string`

Converts a cron expression into a human-readable description.

- `cronExpression`: Cron instance or cron expression string
- Returns: Human-readable string describing the cron schedule

**Examples:**

```typescript
const formatter = new CronFormat("en");
formatter.format("0 22 * * 1-5"); // "At 22:00 on every day-of-week from Monday through Friday."
formatter.format("*/5 * * * *"); // "At every minute."
formatter.format("@weekly"); // "At 00:00 on Sunday."
```

#### `formatToParts(cronExpression: Cron | string): CronFormatPart[]`

Converts a cron expression into an array of parts with type and value information. Useful for custom rendering or styling.

- `cronExpression`: Cron instance or cron expression string
- Returns: Array of `CronFormatPart` objects

**Part types:**

- `literal` - Static text (e.g., "At ", " on ")
- `time` - General time description
- `minute` - Minute component
- `hour` - Hour component
- `day` - Day of month component
- `weekday` - Day of week component
- `month` - Month component

**Example:**

```typescript
const formatter = new CronFormat("en");
const parts = formatter.formatToParts("5 4 * * *");
// [
//   { type: "literal", value: "At " },
//   { type: "hour", value: "04" },
//   { type: "literal", value: ":" },
//   { type: "minute", value: "05" },
//   { type: "literal", value: "." }
// ]
```

## Dependencies

- [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill) - Polyfill for the Temporal API for date/time handling

The `Temporal` object is also exported from this package for convenience:

```typescript
import { Cron, Temporal } from "@jondotsoy/cron";
```

## Internationalization (i18n)

The `CronFormat` class provides optional internationalization support for formatting cron expressions into human-readable text in different languages.

### Supported Languages

Currently, the following locales are supported:

| Locale Code | Language | Example Output                                              |
| ----------- | -------- | ----------------------------------------------------------- |
| `en`        | English  | "At 22:00 on every day-of-week from Monday through Friday." |
| `es`        | Spanish  | "A las 22:00 cada día de la semana del lunes al viernes."   |

### Usage

```typescript
import { CronFormat } from "@jondotsoy/cron";

// Using locale string
const formatterEn = new CronFormat("en");
const formatterEs = new CronFormat("es");

// Using Intl.Locale object
const formatter = new CronFormat(new Intl.Locale("es"));

// Format the same expression in different languages
const expression = "0 9 * * MON-FRI";

console.log(formatterEn.format(expression));
// Output: "At 09:00 on every day-of-week from Monday through Friday."

console.log(formatterEs.format(expression));
// Output: "A las 09:00 cada día de la semana del lunes al viernes."
```

### Contributing New Languages

To add support for a new language, you can contribute by creating a new locale file following the existing pattern. Check the project repository for contribution guidelines.

### Colloquial Language Support

For colloquial or regional language variants, you can use the `@jondotsoy/cron/colloquial-cron-format` export:

```typescript
import { ColloquialCronFormat } from "@jondotsoy/cron/colloquial-cron-format";

// Chilean slang variant
const formatter = new ColloquialCronFormat("es-CL-Flaite");

console.log(formatter.format("0 9 * * MON-FRI"));
// Output: "La weá corre a las 09:00 del lunes al viernes."

console.log(formatter.format("*/15 * * * *"));
// Output: "La weá corre cada 15 minutos."
```

The `ColloquialCronFormat` class extends the standard `CronFormat` functionality to support regional and colloquial language variants. It implements the same interface, so you can use it as a drop-in replacement:

```typescript
import { ColloquialCronFormat } from "@jondotsoy/cron/colloquial-cron-format";

const formatter = new ColloquialCronFormat("es-CL-Flaite");

// Same methods as CronFormat
const text = formatter.format("0 22 * * 1-5");
const parts = formatter.formatToParts("0 22 * * 1-5");
```

## License

[MIT](./LICENSE) © 2025 Jonathan Delgado

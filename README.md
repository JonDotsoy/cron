# Cron

Cron expression parser and scheduler that generates execution times based on cron syntax.

## Features

- Full cron syntax support with 5 or 6 fields
- Special expressions (@yearly, @monthly, @weekly, @daily, @hourly)
- Month and day names support
- Iterator-based API for generating execution times
- Built-in scheduler with `setInterval`
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

### `new Cron(rule: string, now?: Temporal.PlainDateTime)`

Creates a new Cron instance.

- `rule`: Cron expression string (5 or 6 fields, or special expression)
- `now`: Optional starting date/time (defaults to current time using `Temporal.Now.plainDateTimeISO()`)

**Properties:**
- `rule`: The original cron expression string
- `now`: The starting date/time
- `spec`: The parsed cron specification (read-only)

### `Cron.next(cron: Cron): Temporal.PlainDateTime`

Returns the next execution time for the given cron instance.

**Throws:** Error if no next datetime is found (shouldn't happen for valid cron expressions)

### `Cron.setInterval(callback: () => void, cron: Cron)`

Schedules a callback to run at times matching the cron expression.

**Special behavior for `@reboot`:** Executes the callback immediately once and returns.

Returns an object with:
- `promise`: Promise that resolves when the scheduler is aborted or completes
- `abort()`: Function to stop the scheduler

### `cron[Symbol.iterator]()`

Makes the Cron instance iterable, yielding execution times indefinitely.

**Note:** Cannot iterate over `@reboot` expressions (throws an error).

## Dependencies

- [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill) - Polyfill for the Temporal API for date/time handling

The `Temporal` object is also exported from this package for convenience:

```typescript
import { Cron, Temporal } from "@jondotsoy/cron";
```

## License

[MIT](./LICENSE) © 2025 Jonathan Delgado

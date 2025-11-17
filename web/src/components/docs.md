## Installation

```bash
npm install @jondotsoy/cron
```

## Schedule Tasks with Cron

Use `Cron.setInterval` to schedule tasks based on cron expressions:

```typescript
import { Cron } from "@jondotsoy/cron";

const cron = new Cron("*/5 * * * *"); // Every 5 minutes

const { promise, abort } = Cron.setInterval(() => {
  console.log("Task executed at:", new Date().toISOString());
}, cron);

// Stop the scheduler when needed
setTimeout(() => {
  abort();
  console.log("Scheduler stopped");
}, 60000);

// Wait for the scheduler to complete
await promise;
```

### Using `using` keyword (TypeScript 5.2+)

Automatic resource disposal with the `using` keyword:

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

### Using `await using` keyword

For async disposal that waits for the scheduler to fully complete:

```typescript
import { Cron } from "@jondotsoy/cron";

{
  await using cronInterval = Cron.setInterval(() => {
    console.log("Task executed at:", new Date().toISOString());
  }, new Cron("@daily"));

  // The interval will automatically be aborted and awaited when exiting this scope
}
// Scheduler is fully stopped and cleaned up here
```

## Format Cron Expressions

```typescript
import { CronFormat } from "@jondotsoy/cron";

const formatter = new CronFormat("en");
console.log(formatter.format("0 22 * * 1-5"));
// Output: "At 22:00 on every day-of-week from Monday through Friday."
```

## Colloquial Language Support

Use cron expressions in colloquial and regional language variants:

```typescript
import { ColloquialCronFormat } from "@jondotsoy/cron/colloquial-cron-format";

// Variante chilena coloquial
const formatter = new ColloquialCronFormat("es-CL-Flaite");

console.log(formatter.format("0 9 * * MON-FRI"));
// Output: "La weá corre a las 09:00 del lunes al viernes."

console.log(formatter.format("*/15 * * * *"));
// Output: "La weá corre cada 15 minutos."

console.log(formatter.format("@weekly"));
// Output: "La weá corre a las 00:00 el domingo. Una vez a la semana."
```

### Language Examples

**English (en)**

```typescript
const formatter = new CronFormat("en");
formatter.format("0 22 * * 1-5");
// "At 22:00 on every day-of-week from Monday through Friday."
```

**Spanish (es)**

```typescript
const formatter = new CronFormat("es");
formatter.format("0 22 * * 1-5");
// "A las 22:00 cada día de la semana del lunes al viernes."
```

**Chilean Colloquial (es-CL-Flaite)**

```typescript
const formatter = new ColloquialCronFormat("es-CL-Flaite");
formatter.format("0 22 * * 1-5");
// "La weá corre a las 22:00 del lunes al viernes."
```

### More Examples

| Expression     | English                                           | Spanish                                   | Chilean Colloquial                                                          |
| -------------- | ------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| `@weekly`      | At 00:00 on Sunday.                               | A las 00:00 los domingos.                 | La weá corre a las 00:00 el domingo. Una vez a la semana.                   |
| `*/15 * * * *` | At every 15th minute.                             | Cada 15 minutos.                          | La weá corre cada 15 minutos.                                               |
| `0 4 8-14 * *` | At 04:00 on every day-of-month from 8 through 14. | A las 04:00 cada día del mes del 8 al 14. | La weá corre a las 04:00 cada día del mes del 8 al 14, terrible específico. |
| `5 0 * 8 *`    | At 00:05 in August.                               | A las 00:05 de agosto.                    | La weá corre a las 00:05 en agosto.                                         |

## Complete API

### CronFormat

Format cron expressions to natural language:

```typescript
const formatter = new CronFormat("en");
formatter.format("0 9 * * MON-FRI");
```

### ColloquialCronFormat

Extends `CronFormat` with support for colloquial variants:

```typescript
const formatter = new ColloquialCronFormat("es-CL-Flaite");
formatter.format("0 9 * * MON-FRI");
```

Both classes implement the same interface:

- `format(cronExpression)` - Returns string with description
- `formatToParts(cronExpression)` - Returns array of parts for custom rendering

### Supported Languages

**Standard:**

- `en` - English
- `es` - Spanish

**Coloquial:**

- `es-CL-Flaite` - Chilean slang variant

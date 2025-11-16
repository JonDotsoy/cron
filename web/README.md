# Cron Format Demo

Interactive web demo for the Cron Format library with human-readable cron expression formatting.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 🔗 URL Hash Parameters

The demo supports URL hash parameters to share specific cron expressions and configurations:

### Parameters

- `cron` - The cron expression to display
- `danger` - Enable "Danger Mode" to unlock the "Español Flaite 🇨🇱" language option (set to `true`)

### Examples

**Basic cron expression:**

```
http://localhost:4321/#cron=0%2012%20*%20*%20*
```

This displays: `0 12 * * *` (runs at 12:00 PM every day)

**With Danger Mode enabled:**

```
http://localhost:4321/#cron=*/5%20*%20*%20*%20*&danger=true
```

This displays: `*/5 * * * *` with Danger Mode checkbox enabled

**Complex expression:**

```
http://localhost:4321/#cron=0-30/5%2014%201-15%20*%20MON-FRI
```

This displays: `0-30/5 14 1-15 * MON-FRI` (every 5 minutes from 0-30, at 2 PM, on days 1-15, Monday through Friday)

### URL Encoding

Cron expressions contain special characters that need to be URL-encoded:

- Space (` `) → `%20`
- Slash (`/`) → `%2F`
- Comma (`,`) → `%2C`
- Dash (`-`) → `%2D` (optional, usually works without encoding)

### Behavior

- If no `cron` parameter is provided, a random cron expression is generated
- The URL hash updates automatically when:
  - You click the random button
  - You modify the cron expression in the input
  - You toggle Danger Mode
- Changes to the URL hash (e.g., browser back/forward) automatically update the display

## 🎨 Features

- **Multi-language support**: English, Español, and Español Flaite 🇨🇱 (with Danger Mode)
- **Interactive selection**: Click on different parts of the cron expression to highlight the corresponding field
- **Visual badges**: Color-coded badges show which part of the cron expression is selected
- **Random generation**: Generate random cron expressions with the shuffle button
- **URL sharing**: Share specific cron expressions via URL hash parameters

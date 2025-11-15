# Contributing to Cron

Thank you for your interest in contributing to this project! Your contributions are greatly appreciated.

## Development Setup

This project uses [Bun](https://bun.sh) as the JavaScript runtime and package manager.

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

### Installation

```bash
bun install
```

## Project Structure

```
src/
├── cron.ts       # Core cron parser and scheduler implementation
└── cron.spec.ts  # Test suite
lib/
├── esm/          # Compiled ESM modules (generated)
└── types/        # TypeScript type definitions (generated)
```

## Development Workflow

### Building

The project uses TypeScript and generates both ESM modules and type definitions:

```bash
bun run build
```

This will:

- Compile TypeScript to ESM format in `lib/esm/`
- Generate type definitions in `lib/types/`

### Testing

Run the test suite:

```bash
bun test
```

The test suite includes:
- Cron expression parsing tests
- Date generation tests for various cron patterns
- Special expression tests (@yearly, @monthly, @reboot, etc.)
- Scheduler tests (setInterval behavior)

Make sure all tests pass before submitting a pull request.

## Making Changes

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes in `src/cron.ts` or add new files as needed
4. Add or update tests in `src/cron.spec.ts` to cover your changes
5. Run `bun test` to ensure all tests pass
6. Run `bun run build` to verify the build works
7. Run `bun run lint` to check code formatting
8. Format your code with `bun run fmt` before committing
9. Commit your changes with a clear commit message
10. Push to your fork and submit a pull request

## Code Style

This project uses [Prettier](https://prettier.io/) for code formatting.

- Follow the existing code style
- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Keep functions focused and testable
- Run `bun run fmt` to format your code before committing
- Run `bun run lint` to check formatting

### Formatting Commands

```bash
# Check formatting
bun run lint

# Auto-format code
bun run fmt
```

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub with:

- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (Bun version, OS, etc.)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

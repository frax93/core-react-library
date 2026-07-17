# Contributing

Thanks for taking the time to contribute!

## Getting started

1. Make sure you are on **Node.js >= 18**.
2. Install dependencies: `npm install`.
3. Build the library: `npm run build`.
4. Run the tests: `npm test`.

## Development workflow

- Source lives in `src/`. The public API is re-exported from `src/index.ts` — anything
  you want consumers to use must be exported there.
- Keep changes typed and covered by tests where it makes sense. Tests are colocated
  with the code as `*.test.ts` / `*.test.tsx` and run with Vitest.
- Lint before committing: `npm run lint` (a pre-commit hook runs `lint-staged` automatically).
- Follow the existing code style; formatting is handled by Prettier.

## Commits & pull requests

- Write clear, focused commits.
- Open a pull request against the default branch and describe the motivation for the change.
- Please open an issue first for large or breaking changes so we can discuss the approach.

## Releasing

The published manifest (`dist/package.json`) is generated from the root `package.json`
at build time, so bump the version in a single place. Then:

```bash
npm run build
cd dist && npm publish
```

`prepublishOnly` also runs the build, so the published bundle is always fresh.

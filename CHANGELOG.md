# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-07-17

### Changed

- Add CI status badge to the README. First release published through the automated
  GitHub Actions pipeline.

## [0.2.0] - 2026-07-17

### Added

- Conditional `exports` map, `engines`, `keywords`, `homepage` and `bugs` metadata.
- Comprehensive test suite based on Vitest (utils, hooks, HTTP layer, components).
- `CONTRIBUTING.md` and this changelog.

### Changed

- The published `dist/package.json` is now generated from the root `package.json` at
  build time (single source of truth for version and metadata).
- Documentation rewritten in English with working examples.
- **BREAKING:** removed all project-specific coupling so the library is reusable:
  - `AuthData` / `useUserProfile` are now generic (`useUserProfile<TUser>()`); the
    proprietary user/profile schema was removed.
  - `StyleLoaderService.loadStyles(baseUrl)` takes the base URL as an argument
    instead of reading a project-specific `REACT_APP_MFSHARED_REMOTE_URL` env var.
  - `useNavbarHeight(elementId, eventName?)` takes the DOM element id (previously the
    hardcoded `navigation-menu`).
  - `useGraphQLFetch` / `useGraphQLClient` accept a configurable `endpoint`
    (defaults to `/graphql` instead of the hardcoded `/api/graphql`).

### Fixed

- License is now a proper MIT license, consistent with the `license` field.
- Removed a stale `browser.crypto` mapping to an undeclared dependency.
- The CommonJS build is now emitted as `.cjs` so `require()` resolves it correctly
  under `"type": "module"` (previously `require()` returned no exports).
- `useElementScrollWidthObserver` no longer reads `window` at module load time, so
  importing the library in Node/SSR environments no longer throws.
- `StyleLoaderService` reads `process.env` lazily and safely, so importing the library
  in a browser bundle no longer throws `process is not defined`.
- `usePromises().clearPendingPromises()` now cancels pending promises via `.cancel()`
  instead of calling `.then()` on them (which threw `promise.then is not a function`).
  This makes `usePreventionDoubleClick`'s click-cancellation actually work.

### Removed

- `useBtcRate` hook (out of scope for a general-purpose React toolbox).

## [0.1.0]

- Initial release.

# Testing And Tooling Reference

Use this to choose validation commands after implementation.

## Environment And Workspace

- Node version is `22.15.0` in `.node-version` and `.github/min.node-version`.
- Package manager is `pnpm@10.33.2` in root `package.json`.
- Install with `pnpm i --frozen-lockfile` when dependencies are missing.
- Workspace packages are defined by root `package.json` and `pnpm-workspace.yaml`.
- There is no `turbo.json` or Turborepo workflow; use `pnpm --filter ...` and `pnpm -r ...`.
- `packages/shared/package.json` exists but is not part of the pnpm workspace.

## Common Commands

- Repo build: `pnpm build` runs `build-pre`, `pnpm -r build`, then `build-assets`.
- Repo lint: `pnpm lint` runs `pnpm --no-bail -r lint`.
- Repo tests: `pnpm test` runs workspace tests.
- Backend typecheck/lint: `pnpm --filter backend run typecheck`, `pnpm --filter backend run eslint`, or `pnpm --filter backend run lint`.
- Frontend typecheck/lint: `pnpm --filter frontend run typecheck`, `pnpm --filter frontend run eslint`, or `pnpm --filter frontend run lint`.
- Backend unit tests: `pnpm --filter backend test`.
- Backend e2e tests: `pnpm --filter backend test:e2e`.
- Backend federation tests: `pnpm --filter backend test:fed`.
- Frontend tests: `pnpm --filter frontend test`.
- Cypress e2e from root: `pnpm e2e`.

## Backend Validation

- Backend unit tests include `packages/backend/test/unit/**/*.ts` and `packages/backend/src/**/*.test.ts`.
- Backend unit command internally runs `build:unit`, `NODE_ENV=test compile-config`, and `vitest --config vitest.config.unit.ts`.
- Backend e2e tests are in `packages/backend/test/e2e/**/*.ts`; they need Postgres on `54312`, Redis on `56312`, and `.github/misskey/test.yml`.
- Backend federation tests are in `packages/backend/test-federation/test/**/*.test.ts` and use `vitest.config.fed.ts`.
- For backend API/service changes, usually run:
  - `pnpm --filter backend run typecheck`
  - `pnpm --filter backend run eslint`
  - `pnpm --filter backend test`

## Frontend Validation

- Frontend unit tests are mostly in `packages/frontend/test/**/*.test.ts`.
- Frontend Vitest uses `happy-dom`.
- For frontend changes, usually run:
  - `pnpm --filter frontend run typecheck`
  - `pnpm --filter frontend run eslint`
  - `pnpm --filter frontend test`

## Migrations And Generated API

- Root `pnpm migrate` delegates to backend `compile-config && typeorm migration:run -d ormconfig.js`.
- Root `pnpm revert` delegates to backend migration revert.
- Migration clean check: `MISSKEY_CONFIG_YML=test.yml pnpm --filter backend check-migrations`.
- CI migration flow copies `.github/misskey/test.yml` into `.config`, runs `pnpm build`, runs migrations with `MISSKEY_CONFIG_YML=test.yml`, then runs `check-migrations`.
- Generate a migration from `packages/backend` with `pnpm dlx typeorm migration:generate -d ormconfig.js -o <migration name>`, then move it under `migration/` and remove accidental noise.
- Backend API JSON generation: `pnpm --filter backend generate-api-json`.
- Full misskey-js API type regeneration from root: `pnpm build-misskey-js-with-types`.

## Choosing Validation Scope

- Backend service/API only: backend typecheck, backend eslint, backend unit tests.
- Backend endpoint shape used by frontend: backend validation plus API JSON/misskey-js generation and frontend typecheck.
- DB entity or migration: backend validation plus `pnpm build` and migration clean check.
- Frontend UI/client-only: frontend typecheck, frontend eslint, frontend tests.
- ActivityPub/federation: backend validation plus targeted e2e or federation tests when environment is available.
- Cross-workspace or upstream merge: `pnpm build`, `pnpm lint`, and `pnpm test`; add `pnpm e2e` only when the local services and Cypress are available.

---
name: misskey
description: Misskey codebase implementation guide for this repository. Use when Codex needs to implement, modify, debug, or review Misskey backend, frontend, ActivityPub, API, database, queue, testing, or ugfv fork-specific behavior in /Users/uboar/Repo/ugfv.
---

# Misskey Implementation

Use this skill to reduce broad rediscovery in the ugfv Misskey fork. Start by narrowing the requested change to one or more implementation surfaces, then load only the matching reference files.

## First Steps

1. Read `/Users/uboar/Repo/ugfv/AGENTS.md` before changing code.
2. Run `git status --short --branch` and preserve unrelated local changes.
3. Identify the surface:
   - Backend API, services, entities, queues, or ActivityPub: read `references/backend.md`.
   - Frontend pages, components, state, i18n, or API client use: read `references/frontend.md`.
   - Validation, test selection, migrations, generated API types: read `references/testing.md`.
4. Use `rg` with the reference search strings before opening large file trees.
5. Prefer existing local patterns over new abstractions.

## Implementation Rules

- Keep changes scoped to the touched domain and its generated/types/test surface.
- When adding or changing backend endpoints, check endpoint registration, OpenAPI generation, misskey-js generated types, and frontend callers together.
- When changing database entities, include migration and migration-clean validation planning.
- When changing federation or note visibility behavior, read `references/backend.md` and confirm fork-specific differences in `/Users/uboar/Repo/ugfv/AGENTS.md`.
- When adding a new ugfv fork-specific behavior, update `/Users/uboar/Repo/ugfv/AGENTS.md` in the same change.
- Do not use Turborepo commands; this repo validates through pnpm workspace scripts.

## Reference Map

- `references/backend.md`: NestJS/Fastify backend, API endpoint pattern, DI, TypeORM models, queues, ActivityPub, backend tests.
- `references/frontend.md`: Vue frontend routing, components, UI shell, state/preferences, API client, i18n, styles, frontend tests.
- `references/testing.md`: Node/pnpm prerequisites, workspace scripts, backend/frontend/e2e/federation validation, migrations, API schema generation.

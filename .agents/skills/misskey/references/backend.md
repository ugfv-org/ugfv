# Backend Reference

Use this for backend API, service, entity, queue, ActivityPub, or backend test work.

## API Endpoints

- Put endpoints under `packages/backend/src/server/api/endpoints/**/*.ts`.
- Match the common shape: `export const meta`, `export const paramDef`, `@Injectable() export default class extends Endpoint<typeof meta, typeof paramDef>`, with logic in `super(meta, paramDef, async (ps, me) => ...)`.
- Good examples: `packages/backend/src/server/api/endpoints/notes/create.ts`, `packages/backend/src/server/api/endpoints/admin/emoji/add.ts`.
- Register new endpoints in `packages/backend/src/server/api/endpoint-list.ts` using the existing `export * as 'path/name' from './endpoints/...js'` pattern.
- `packages/backend/src/server/api/EndpointsModule.ts` converts entries into `ep:<path>` providers; `packages/backend/src/server/api/ApiServerService.ts` registers `/api/<path>` routes.
- API metadata/options live around `packages/backend/src/server/api/endpoints.ts` and `packages/backend/src/server/api/endpoint-base.ts`: check `requireCredential`, `requireAdmin`, `requiredRolePolicy`, `kind`, `limit`, `requireFile`, `allowGet`, `res`, and `errors`.
- Search:
  - `rg "extends Endpoint|export const meta|export const paramDef" packages/backend/src/server/api/endpoints`
  - `rg "endpoint-list|ep:|fastify.all" packages/backend/src/server/api`
  - `rg "requiredRolePolicy|requireFile|allowGet|kind:" packages/backend/src/server/api/endpoints`

## Server And DI

- Fastify registration starts in `packages/backend/src/server/ServerService.ts`; it wires `/api`, OpenAPI, file, ActivityPub, well-known, OAuth, and health routes.
- ActivityPub raw body handling is registered through Fastify in the server layer.
- Dependency injection uses NestJS. Shared provider tokens are in `packages/backend/src/di-symbols.ts`.
- Global DB/Redis/config/meta providers are in `packages/backend/src/GlobalModule.ts`.
- Core services are registered in `packages/backend/src/core/CoreModule.ts`; some circular dependencies use string providers.
- Search:
  - `rg "fastify.register|rawBody|prefix: '/api'" packages/backend/src/server`
  - `rg "@Injectable\\(|@Inject\\(DI\\.|provide: '.*Service'|useExisting" packages/backend/src`

## Domain Services And Entities

- Domain logic usually belongs in `packages/backend/src/core/*Service.ts`.
- API response packing usually belongs in `packages/backend/src/core/entities/*EntityService.ts`.
- Example pattern: note creation endpoint calls `NoteCreateService`, response uses `NoteEntityService.pack()`.
- TypeORM entities are in `packages/backend/src/models/*.ts`.
- Aggregate model exports and repository types are in `packages/backend/src/models/_.ts`.
- Repository providers are in `packages/backend/src/models/RepositoryModule.ts`.
- DB connection and entity/migration registration are in `packages/backend/src/postgres.ts`.
- Inject repositories as `@Inject(DI.notesRepository) private notesRepository: NotesRepository`; inject raw DB as `@Inject(DI.db) private db: DataSource`.
- Migrations are in `packages/backend/migration/*.js`.
- Search:
  - `rg "private .*Service|EntityService|\\.pack\\(" packages/backend/src/core packages/backend/src/server/api/endpoints`
  - `rg "@Entity\\(|@Column\\(|getRepository\\(|insertOne|createPostgresDataSource" packages/backend/src/models packages/backend/src/postgres.ts`
  - `rg "DI\\..*Repository|DataSource|\\.transaction\\(|createQueryBuilder" packages/backend/src`

## Queue

- Enqueue-side queue wiring is in `packages/backend/src/core/QueueModule.ts` and `packages/backend/src/core/QueueService.ts`.
- BullMQ queue tokens include `queue:system`, `queue:deliver`, `queue:inbox`, and `queue:db`.
- Federation delivery usually goes through `QueueService.deliver`, `deliverMany`, or `inbox`.
- Worker-side processing is in `packages/backend/src/queue/QueueProcessorModule.ts`, `packages/backend/src/queue/QueueProcessorService.ts`, and `packages/backend/src/queue/processors/*ProcessorService.ts`.
- Job-name dispatch is centralized in `QueueProcessorService`.
- Search:
  - `rg "queue:|deliverMany|inbox\\(|dbQueue.add|systemQueue.add" packages/backend/src/core`
  - `rg "new Bull.Worker|case '.*': return|process\\(job" packages/backend/src/queue`

## ActivityPub

- HTTP routes are in `packages/backend/src/server/ActivityPubServerService.ts`.
- Important routes include `POST /inbox`, `POST /users/:user/inbox`, `GET /notes/:note`, `GET /users/:user`, and `GET /@:acct`.
- Inbound inbox requests validate digest/signature and enqueue work.
- Core AP code is under `packages/backend/src/core/activitypub/`.
- Outbound activities are rendered by `ApRendererService` and queued via `ApDeliverManagerService`.
- Inbound queue processing starts in `InboxProcessorService`, then calls `ApInboxService.performActivity()`.
- Remote Note/User resolving touches `ApNoteService`, `ApPersonService`, `ApResolverService`, and `ApDbResolverService`.
- In this fork, `packages/backend/src/core/NoteCreateService.ts` has ugfv-specific ActivityPub visibility behavior. Confirm the current fork-specific differences in `/Users/uboar/Repo/ugfv/AGENTS.md` before changing it.
- Search:
  - `rg "fastify\\.(get|post)|parseRequest|queueService.inbox|application/activity\\+json" packages/backend/src/server/ActivityPubServerService.ts`
  - `rg "ApDeliverManagerService|renderCreate|renderNote|performActivity|resolvePerson|createNote|getAuthUserFromKeyId" packages/backend/src/core packages/backend/src/queue`
  - `rg "visibility|localOnly|renderNoteOrRenoteActivity|deliverToFollowers" packages/backend/src/core/NoteCreateService.ts`

## Backend Tests

- Unit/e2e tests live in `packages/backend/test/unit/**/*.ts`, `packages/backend/test/e2e/**/*.ts`, and some `packages/backend/src/**/*.test.ts`.
- Federation tests live in `packages/backend/test-federation/test/**/*.test.ts`.
- Vitest configs are `packages/backend/vitest.config.unit.ts`, `packages/backend/vitest.config.e2e.ts`, and `packages/backend/vitest.config.fed.ts`.
- Helpers are in `packages/backend/test/utils.ts`: common helpers include `api()`, `successfulApiCall()`, `failedApiCall()`, `signup()`, and `post()`.
- Queue-related e2e tests commonly use `startJobQueue()`.
- Search:
  - `rg "describe\\(|Test\\.createTestingModule|startServer|startJobQueue|api\\(|successfulApiCall|failedApiCall" packages/backend/test packages/backend/src`
  - `rg "startJobQueue|signup\\(|post\\(|api\\(" packages/backend/test`

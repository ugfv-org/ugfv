# Frontend Reference

Use this for Vue frontend pages, components, state, API clients, i18n, styles, or frontend tests.

## Entry, Routing, And UI Shell

- Frontend entry starts at `packages/frontend/src/_boot_.ts`, which imports `@/style.scss` and dispatches to `boot/main-boot.ts` or `boot/sub-boot.ts`.
- Main UI root selection is in `packages/frontend/src/boot/main-boot.ts`.
- Pages live under `packages/frontend/src/pages/**/*.vue`.
- Route-to-page mapping is centralized in `packages/frontend/src/router.definition.ts`; the router/history instance is in `packages/frontend/src/router.ts`.
- UI shells are under `packages/frontend/src/ui/`: `universal.vue`, `deck.vue`, `visitor.vue`, and `zen.vue`.
- Shared shell parts are in `packages/frontend/src/ui/_common_/`; deck-specific code is in `packages/frontend/src/ui/deck/`.
- Search:
  - `rg -n "mainBoot|subBoot|createApp|uiStyle" packages/frontend/src`
  - `rg -n "path:|component: page|loginRequired|children:" packages/frontend/src/router.definition.ts`
  - `rg -n "navbar|mobile-footer|deckStore|RouterView" packages/frontend/src/ui`

## Components And Utilities

- Global/shared component registration is in `packages/frontend/src/components/index.ts`.
- Reusable components are usually `packages/frontend/src/components/Mk*.vue`.
- Global wrappers are in `packages/frontend/src/components/global/`; form parts are in `components/form/`; page layout parts are in `components/page/`.
- Common composables are in `packages/frontend/src/composables/`: examples include `use-tooltip`, `use-uploader`, `use-loading`, `use-form`, `use-note-capture`, and `use-scroll-position-keeper`.
- Frequently reused helpers are in `packages/frontend/src/utility/`: examples include `drive.ts`, `please-login.ts`, `hotkey.ts`, `reaction-picker.ts`, `emoji-picker.ts`, `media-proxy.ts`, `time.ts`, `is-birthday.ts`, and `get-appear-note.ts`.
- Search:
  - `rg -n "app.component|GlobalComponents|export const components" packages/frontend/src/components`
  - `rg -n "useTooltip|useUploader|useLoading|useForm|useInterval|useDocumentVisibility" packages/frontend/src packages/frontend-shared`
  - `rg -n "pleaseLogin|makeHotkey|reactionPicker|emojiPicker|mediaProxy|getAppearNote|isBirthday" packages/frontend/src`

## State, Preferences, And Plugins

- Runtime state store is `packages/frontend/src/store.ts` using Pizzax.
- User preferences are split across `packages/frontend/src/preferences.ts`, `packages/frontend/src/preferences/def.ts`, and `packages/frontend/src/preferences/manager.ts`.
- Client-side plugins are handled by `packages/frontend/src/plugin.ts`.
- Plugin install/manage pages are `packages/frontend/src/pages/settings/plugin.install.vue` and `packages/frontend/src/pages/settings/plugin.vue`.
- Search:
  - `rg -n "store\\.s|store\\.r|store\\.set|prefer\\.s|prefer\\.r|prefer\\.commit" packages/frontend/src`
  - `rg -n "parsePluginMeta|installPlugin|launchPlugin|pluginContexts|AiScript" packages/frontend/src`

## API Client And Types

- Frontend API calls should usually use `misskeyApi` or `misskeyApiGet` from `packages/frontend/src/utility/misskey-api.ts`.
- UI dialog/error helpers are in `packages/frontend/src/os.ts`: look for `apiWithDialog`, `promiseDialog`, `popup`, `alert`, and `confirm`.
- API endpoint/entity types come from `packages/misskey-js/src/autogen/endpoint.ts`, `packages/misskey-js/src/autogen/entities.ts`, and exports in `packages/misskey-js/src/index.ts`.
- Streaming client code is in `packages/misskey-js/src/streaming.ts`; the frontend wrapper is `packages/frontend/src/stream.ts`.
- If backend endpoint shape changes, check misskey-js generation and frontend consumers together.
- Search:
  - `rg -n "misskeyApi\\(|apiWithDialog\\(|popup\\(|alert\\(|confirm\\(" packages/frontend/src`
  - `rg -n "Misskey\\.Endpoints|Misskey\\.entities|useStream\\(|useChannel\\(" packages/frontend/src packages/misskey-js/src`

## I18n And Styles

- UI strings use `i18n.ts.key` from `packages/frontend/src/i18n.ts`.
- Locale source files are `locales/*.yml`.
- Generated locale TS types are in `packages/i18n/src/autogen/locale.ts`.
- Vite watches locale files through `packages/frontend/vite.config.ts`.
- Global styles and CSS variables are in `packages/frontend/src/style.scss`.
- Theme logic is in `packages/frontend/src/theme.ts`.
- Shared bundled themes are under `packages/frontend-shared/themes/*.json5`.
- Vite aliases: `@/` maps to `packages/frontend/src/`, and `@@/` maps to `packages/frontend-shared/`; see `packages/frontend/vite.config.ts`.
- Search:
  - `rg -n "i18n\\.ts\\.|_LANGS_|pluginWatchLocales|Locale" packages/frontend packages/i18n locales`
  - `rg -n "--MI-|MI_THEME|applyTheme|\\$style|<style" packages/frontend/src packages/frontend-shared`
  - `rg -n "alias:|@@/|@/" packages/frontend/vite.config.ts packages/frontend/src`

## Frontend Tests

- Frontend tests live in `packages/frontend/test/**/*.test.ts`.
- Vitest config is embedded in `packages/frontend/vite.config.ts`.
- Main commands: `pnpm --filter frontend test`, `pnpm --filter frontend test-and-coverage`, `pnpm --filter frontend typecheck`, `pnpm --filter frontend eslint`, and `pnpm --filter frontend lint`.
- Search:
  - `rg -n "describe\\(|it\\(|render\\(|vi\\." packages/frontend/test`
  - `rg -n "\"typecheck\"|\"eslint\"|\"lint\"|\"build\"|\"test\"" package.json packages/frontend/package.json`

# AGENTS.md

## 作業方針

fork 固有差分を追加した場合は、必ず `AGENTS.md` にその差分を記録する。

## upstream Misskey との差分

このリポジトリは upstream Misskey をベースにした ug4v 用 fork である。

### バージョン表記

- root `package.json` の version は upstream version に `-ug4v` suffix を付けて維持する。

### ActivityPub 配信挙動

- `packages/backend/src/core/NoteCreateService.ts` で、local-only ではない outbound public note はリモート配送時に `home` visibility として扱う。
- `packages/backend/src/server/ActivityPubServerService.ts` で、リモートサーバーから local-only ではないローカル public note またはその activity を照会された場合も、ActivityPub 上は `home` visibility として扱う。

### welcome page の年齢確認

- `packages/frontend/src/pages/welcome.vue` は、通常の entrance/setup UI の前に 18 歳以上確認を必ず表示する。

### Docker image 公開

- `.github/workflows/docker-main.yml` は `main` push と `workflow_dispatch` で `nicomedkey/ugfv` を publish する ugfv 固有 workflow。

### repo-local update workflow

- `.agents/skills/update-ug4v/` と `.claude/commands/update-ug4v.md` は upstream Misskey release 追従用の repo-local 手順。

### repo-local implementation skill

- `.agents/skills/misskey/` は Misskey 実装時の調査範囲を絞るための repo-local 手引き。

### semantic ではない差分

- `CHANGELOG.md` の 2026.5.1 entries trailing spaces 除去は挙動差分ではない。

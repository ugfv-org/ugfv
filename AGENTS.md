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

### 未ログイン UI の年齢確認

- `packages/frontend/src/ui/_common_/common.vue` は、未ログイン時にページにかかわらず 18 歳以上確認 overlay を表示し、確認前はページ内容を操作できないようにする。

### Docker image 公開

- `.github/workflows/docker-main.yml` は `main` push と `workflow_dispatch` で `nicomedkey/ugfv` を publish する ugfv 固有 workflow。

### repo-local update workflow

- `.agents/skills/update-ug4v/` と `.claude/commands/update-ug4v.md` は upstream Misskey release 追従用の repo-local 手順。

### repo-local implementation skill

- `.agents/skills/misskey/` は Misskey 実装時の調査範囲を絞るための repo-local 手引き。

### semantic ではない差分

- `CHANGELOG.md` の 2026.5.1 entries trailing spaces 除去は挙動差分ではない。

---

# Misskey – AI Agent Guide

このファイルは Misskey リポジトリで動く AI コーディングエージェント (Claude Code / OpenAI Codex / GitHub Copilot 等) が共通で参照する **絶対禁止事項と最低限のチェック** を集めた索引。次の 3 経路から参照・読み込みされる:

- **Claude Code**: ルート `CLAUDE.md` から `@AGENTS.md` で取り込まれる。詳細手順・規約は `.claude/skills/` (description で自動索引)
- **OpenAI Codex**: ルート `AGENTS.md` を直接読み込む (skill エントリは `.agents/skills/`、実体は `.claude/skills/` を指す)
- **GitHub Copilot**: `.github/copilot-instructions.md` (本ファイルの規約を Copilot code review 向けに再掲) 経由で参照する

人間 contributor 向けの一般規約 (Issue / PR の出し方、ActivityPub 拡張など) は [CONTRIBUTING.md](CONTRIBUTING.md) を参照。本ファイルは AI が **コードを書く・直す・出す** 際に踏み外してはいけない事項に絞る。

---

## 絶対にやってはいけない事

違反すると CI 失敗 / 本番事故 / 共有環境破壊 になる。順守すること。

### コード・データ関連

1. **SPDX ヘッダー欠落のまま AGPL 管轄ディレクトリへ新規ファイルを追加しない**
   - 対象: 新規 `.ts` / `.js` / `.cjs` / `.mjs` / `.vue` / `.scss` / `.html` ファイル
   - 対象と判定は [scripts/check-spdx.mjs](scripts/check-spdx.mjs) が一元管理する
   - `node scripts/check-spdx.mjs` を 1 回実行し、欠落は `--fix` で補う。
     `SPDX: OK` なら追加の目視確認はしない
   - `packages/misskey-js` は MIT ライセンスのサブパッケージなので、この AGPL ヘッダーを一律に付けない (サブパッケージ固有の `package.json` / `LICENSE` / 既存ファイルのヘッダーに従う)

2. **`locales/ja-JP.yml` 以外の locale YAML を手動編集しない**
   - 他言語ファイル (`en-US.yml` など `ja-JP.yml` 以外すべて) は Crowdin の自動配信先。手動編集すると次の同期で上書き喪失する
   - 根拠: [locales/README.md](locales/README.md) と [crowdin.yml](crowdin.yml) (`ja-JP.yml` → `locales/%locale%.yml` の同期設定)

3. **マージ済 migration ファイルを編集しない**
   - 対象: `packages/backend/migration/{unixMs}-{name}.js` のうち、既に `develop` / `master` にマージされたもの
   - 本番環境で履歴改変が起きると深刻なデータ不整合を引き起こす
   - スキーマ変更が必要な場合は **新しいタイムスタンプで新規ファイル** を作成する (`node -e "console.log(Date.now())"` でタイムスタンプ取得)
   - 新規 migration は `up()` と `down()` の両方を実装し、`pnpm --filter backend check-migrations` を通すこと (TypeORM schema builder で pending DDL を検出)

### Git / リポジトリ操作

4. **`git push --force` / `--force-with-lease` を `main` / `develop` / `master` にしない** (他人の作業を消す可能性)
5. **`git commit --no-verify` で hook をスキップしない**
6. **マージ済 / プッシュ済コミットを `git commit --amend` で書き換えない** (履歴の整合性が壊れる)
7. **他人のブランチを `git reset --hard` / `git branch -D` で破壊しない**
8. **`git config` をユーザーに無断で書き換えない** (特に `user.name` / `user.email` / `commit.gpgsign`)

### Issue / PR / 外部送信

9. **ユーザーの明示指示なしに PR を merge / close / force-push しない**
10. **ユーザーの明示指示なしに external service (GitHub comments / Slack / メール 等) へ送信しない**
11. **secrets / 認証情報をリポジトリにコミットしない** (`.config/*.yml` の本番値、`.env` ファイル、API token、private key 等)
12. **脆弱性報告を通常の Issue / PR 経由で行わない** (脆弱性報告を行う場合のルールは `creating-issues-and-prs` スキルを参照すること)

### スキル呼び出し

上流スキルの実行・事前知識・memory の内容に関わらず免除されない。

13. **`working-on-backend` スキルを参照せずに `packages/backend/` 配下のファイルを編集・追加しない**
14. **`working-on-frontend` スキルを参照せずに `packages/frontend/` 配下のファイルを編集・追加しない**
15. **`shipping-misskey-change` スキルを参照せずに commit / PR 作成 / 作業をユーザーに返さない**
16. **`creating-issues-and-prs` スキルを参照せずに Issue / PR を起票しない** (脆弱性報告のルールも含む)

---

## 変更を出す前の最低チェック

各エージェントは [shipping-misskey-change スキル](.claude/skills/shipping-misskey-change/SKILL.md) を参照すること。スキルが利用できない環境でも、以下のチェックは必ず実施すること:

1. **lint / test**: ESLint 対象の変更ファイルへ package root から `eslint --quiet` を最後に 1 回実行し、実装変更には最も近い test を選んで実行する。
   package / repo 全体 lint と広域 test は任意
2. **backend API 変更時**: `pnpm build-misskey-js-with-types` を実行し `packages/misskey-js/src/autogen/` の差分も commit に含めた
3. **entity / migration 変更時**: `pnpm --filter backend check-migrations` が pending DDL 0 件で通る / 新規 migration は `up()` と `down()` 両方実装済
4. **SPDX**: `node scripts/check-spdx.mjs` が `SPDX: OK` を返すことを確認する
5. **locale safety**: commit 済み・未commit・untracked の変更集合に `locales/ja-JP.yml` 以外の locale YAML が無いことを確認する
6. **[CHANGELOG](.claude/skills/shipping-misskey-change/references/tasks/changelog-update.md)**: ユーザーが明示しない限り編集しない。
   ユーザー影響がある変更では引き継ぎに候補を 1 行だけ示す

### Validation commands

各チェックで使う pnpm コマンド一覧。状況に応じて最も近いコマンドから検証する。

| 用途 | コマンド |
| --- | --- |
| 全体 lint (任意) | `pnpm lint` |
| Backend unit test | `pnpm --filter backend test` |
| Backend e2e test | `pnpm --filter backend test:e2e` |
| Backend federation test | `pnpm --filter backend test:fed` |
| Frontend unit test | `pnpm --filter frontend test` |
| Migration 差分検査 (pending DDL) | `pnpm --filter backend check-migrations` |
| `misskey-js` 再生成 (API 変更後必須) | `pnpm build-misskey-js-with-types` |
| 全体ビルド | `pnpm build` |
| 開発サーバー (backend + frontend watch) | `pnpm dev` |

**注意:** backend テスト (`test` / `test:e2e` / `test:fed`) 実行前に `.config/test.yml` が必要 (`ncp .github/misskey/test.yml .config/test.yml` または `cp .github/misskey/test.yml .config/test.yml` で作成)。

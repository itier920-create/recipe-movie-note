# レシピムービー帳

YouTube の料理動画をレシピとして保存し、動画を見ながら料理して、材料を人数分の買い物リストにまとめられるアプリです。

> README は開発の進行に合わせて更新します（画面写真・構成図・工夫した点は 1.0 完成時に追加予定）。

## 技術スタック

- フロント：Next.js（App Router）、TypeScript、Tailwind CSS、shadcn/ui
- サーバー：Next.js Route Handlers（REST API）、Prisma 7、MySQL 8.4
- 開発環境：Docker Compose（MySQL）

## 開発環境のセットアップ

必要なもの：Node.js（LTS）、Docker Desktop、Git

```bash
# 1. 依存パッケージをインストール（Prisma Client の生成も自動で行われる）
npm install

# 2. 環境変数ファイルを作成
cp .env.example .env

# 3. MySQL を起動
npm run db:up

# 4. テーブルを作成
npm run db:migrate

# 5. 開発サーバーを起動 → http://localhost:3000
npm run dev
```

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run lint` | コードの書き方チェック |
| `npm run typecheck` | 型チェック |
| `npm run db:up` / `npm run db:down` | MySQL の起動 / 停止 |
| `npm run db:migrate` | テーブル定義の変更を DB に反映 |
| `npm run db:studio` | DB の中身をブラウザで確認 |

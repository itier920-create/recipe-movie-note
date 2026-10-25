# 本番用のアプリの箱（Docker イメージ）を作る手順書
# 段階（stage）を分けて、最後の箱には動かすのに必要なものだけを入れる

# ===== 1. 共通の土台 =====
FROM node:24-slim AS base
# Prisma のマイグレーション用プログラムが OpenSSL を使うため入れておく
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ===== 2. 依存パッケージのインストール =====
FROM base AS deps
COPY package.json package-lock.json ./
# postinstall で prisma generate が動くため、スキーマと設定ファイルも先にコピーする
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# ===== 3. アプリのビルド =====
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ===== 4. マイグレーション用（DB のテーブルを最新にして終了する）=====
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts package.json ./
CMD ["npx", "prisma", "migrate", "deploy"]

# ===== 5. 本番で動かす箱 =====
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 管理者権限のない専用ユーザーで動かす（乗っ取られたときの被害を小さくするため）
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

#!/usr/bin/env bash
# 本番サーバーで実行する：最新のコードを取ってきて、本番用の構成で作り直す
# 使い方：bash deploy.sh
set -euo pipefail

cd "$(dirname "$0")"

COMPOSE="docker compose -f compose.prod.yml --env-file .env.production"

git pull
$COMPOSE up -d --build
$COMPOSE ps

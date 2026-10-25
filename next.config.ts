import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本番用の Docker イメージを小さくするため、動かすのに必要なファイルだけを .next/standalone にまとめる
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

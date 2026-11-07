import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/server/db";

// Auth.js の設定。ここで作った auth・signIn などをアプリ全体で使う
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Google でログインした人の User と Account を DB に保存する
  providers: [Google], // 使うログイン方法の一覧（ゲストログインは後で追加する）
  session: { strategy: "jwt" }, // ゲストログイン(Credentials)はJWT方式でしか使えないため
});

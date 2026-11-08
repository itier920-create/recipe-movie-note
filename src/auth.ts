import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/server/db";
import Credentials from "next-auth/providers/credentials";

// Auth.js の設定。ここで作った auth・signIn などをアプリ全体で使う
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Google でログインした人の User と Account を DB に保存する
  providers: [
    Google,
    Credentials({
      id: "guest",
      name: "ゲスト",
      credentials: {},
      authorize: async () => {
        // 1.期限の日時を作る（今から7日後。アプリを一通り試すには十分で、使われないデータを長く残さない日数）
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // 2.ゲスト用のUserをDBに作る
        const user = await prisma.user.create({
          data: { name: "ゲスト", isGuest: true, guestExpiresAt: expiresAt },
        });

        // 3.作ったUserを返す(ログイン成功)
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" }, // ゲストログイン(Credentials)はJWT方式でしか使えないため
});

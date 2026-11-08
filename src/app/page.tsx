import { Suspense } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, signIn, signOut } from "@/auth";

// 環境構築の確認用トップページ（ログイン機能を作るときに置き換える）
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-orange-600 text-white">
          <Play className="size-6 fill-current" aria-hidden />
        </div>
        <span className="text-xl font-medium">レシピムービー帳</span>
      </div>
      <Suspense>
        <UserName />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>動画を見ながら、料理しよう</CardTitle>
          <CardDescription>
            YouTubeの料理動画をレシピとして保存し、材料を買い物リストにまとめられます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginButtons />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

// ログイン中のユーザー名とログアウトボタンを表示する（Cookie を読むので <Suspense> の中に置く）
async function UserName() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm">{session.user.name}さんでログイン中</p>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button size="sm" variant="outline">
          ログアウト
        </Button>
      </form>
    </div>
  );
}

// ログインしていない人にだけログインボタンを表示する（Cookie を読むので <Suspense> の中に置く）
async function LoginButtons() {
  const session = await auth();

  if (session?.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button className="w-full" size="lg">
          Google でログイン
        </Button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("guest");
        }}
      >
        <Button className="w-full" size="lg" variant="outline">
          お試しで使う
        </Button>
      </form>
    </div>
  );
}

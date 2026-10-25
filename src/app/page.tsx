import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

      <Card>
        <CardHeader>
          <CardTitle>動画を見ながら、料理しよう</CardTitle>
          <CardDescription>
            YouTubeの料理動画をレシピとして保存し、材料を買い物リストにまとめられます。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button size="lg">Google でログイン</Button>
          <Button size="lg" variant="outline">
            お試しで使う
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

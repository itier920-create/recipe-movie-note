import { auth } from "@/auth";
import { extractVideoId } from "@/lib/youtube";
import { prisma } from "@/server/db";
import { extractRecipe, RecipeExtraction } from "@/server/recipeExtraction";
import { fetchVideoSnippet } from "@/server/youtube";

type ExtractRecipeBody = {
  url?: string;
};

type SavedResult = RecipeExtraction & { title: string };

const DAILY_LIMIT = 10;
const GUEST_DAILY_LIMIT = 3;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { error: "ログインしてください" },
      {
        status: 401,
      },
    );
  }

  const userId = session.user.id;

  const body: ExtractRecipeBody = await request.json();
  const videoId =
    typeof body.url === "string" ? extractVideoId(body.url) : null;
  if (!videoId) {
    return Response.json(
      { error: "YouTube の動画の URL を入力してください" },
      { status: 400 },
    );
  }

  const saved = await prisma.aiExtraction.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });
  if (saved) {
    return Response.json({ videoId, ...(saved.result as SavedResult) });
  }

  const usedCount = await prisma.aiExtraction.count({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  const limit = session.user.isGuest ? GUEST_DAILY_LIMIT : DAILY_LIMIT;
  if (usedCount >= limit) {
    return Response.json(
      { error: "今日の AI 取り出しの回数を使い切りました" },
      { status: 429 },
    );
  }

  try {
    const video = await fetchVideoSnippet(videoId);
    if (!video) {
      return Response.json(
        { error: "動画が見つかりませんでした" },
        { status: 404 },
      );
    }

    const recipe = await extractRecipe(video.description);

    const result: SavedResult = { title: video.title, ...recipe };
    await prisma.aiExtraction.create({
      data: { userId, videoId, result },
    });
    return Response.json({ videoId, ...result });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "レシピの取り出しに失敗しました" },
      { status: 502 },
    );
  }
}

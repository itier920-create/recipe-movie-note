import { auth } from "@/auth";
import { extractVideoId } from "@/lib/youtube";
import { extractRecipe } from "@/server/recipeExtraction";
import { fetchVideoSnippet } from "@/server/youtube";

type ExtractRecipeBody = {
  url?: string;
};

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
  const body: ExtractRecipeBody = await request.json();
  const videoId =
    typeof body.url === "string" ? extractVideoId(body.url) : null;
  if (!videoId) {
    return Response.json(
      { error: "YouTube の動画の URL を入力してください" },
      { status: 400 },
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
    return Response.json({ videoId, title: video.title, ...recipe });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "レシピの取り出しに失敗しました" },
      { status: 502 },
    );
  }
}

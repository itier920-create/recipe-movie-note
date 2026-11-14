import { auth } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db";

type CreateRecipeBody = {
  title: string;
  videoId?: string;
  ingredients: {
    name: string;
    amountText: string;
    quantity?: number;
    unit?: string;
    isSeasoning: boolean;
  }[];
  steps: {
    text: string;
    startSeconds?: number;
  }[];
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }

  const body: CreateRecipeBody = await request.json();
  if (!body.title) {
    return Response.json(
      { error: "タイトルを入力してください" },
      { status: 400 },
    );
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        userId: session.user.id,
        title: body.title,
        videoId: body.videoId,
        ingredients: {
          create: body.ingredients.map((item, index) => ({
            ...item,
            sortOrder: index,
          })),
        },
        steps: {
          create: body.steps.map((item, index) => ({
            ...item,
            sortOrder: index,
          })),
        },
      },
      include: { ingredients: true, steps: true },
    });
    return Response.json(recipe, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "この動画はすでに登録されています" },
        { status: 409 },
      );
    }
    throw error;
  }
}

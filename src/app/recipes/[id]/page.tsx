import { Suspense } from "react";

import { auth } from "@/auth";
import { prisma } from "@/server/db";

export default function Page({ params }: PageProps<"/recipes/[id]">) {
  return (
    <main>
      <Suspense>
        <RecipeDetail params={params} />
      </Suspense>
    </main>
  );
}

async function RecipeDetail({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const recipe = await prisma.recipe.findFirst({
    where: { id: id, userId: session.user.id },
  });
  if (!recipe) {
    return null;
  }

  return <p>{recipe.title}</p>;
}

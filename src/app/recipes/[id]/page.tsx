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
    include: {
      ingredients: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!recipe) {
    return null;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>

      <h2>材料</h2>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} {ingredient.amountText}
          </li>
        ))}
      </ul>

      <h2>手順</h2>
      <ol>
        {recipe.steps.map((step) => (
          <li key={step.id}>{step.text}</li>
        ))}
      </ol>
    </div>
  );
}

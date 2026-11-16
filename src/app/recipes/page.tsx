import { Suspense } from "react";

import { auth } from "@/auth";
import { prisma } from "@/server/db";

export default function Page() {
  return (
    <main>
      <Suspense>
        <RecipeList />
      </Suspense>
    </main>
  );
}

// ログイン中の人のレシピを新しい順に並べる(Cookieを読むので<Suspense>の中に書く)
async function RecipeList() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const recipes = await prisma.recipe.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ul>
      {recipes.map((recipe) => (
        <li key={recipe.id}>{recipe.title}</li>
      ))}
    </ul>
  );
}

import Image from "next/image";
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
    <ul className="grid grid-cols-2 gap-3 p-4">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="overflow-hidden rounded-lg border">
          <div className="relative aspect-video bg-muted">
            {recipe.videoId && (
              <Image
                src={`https://i.ytimg.com/vi/${recipe.videoId}/hqdefault.jpg`}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
              />
            )}
          </div>
          <p className="p-2 text-sm font-medium">{recipe.title}</p>
        </li>
      ))}
    </ul>
  );
}

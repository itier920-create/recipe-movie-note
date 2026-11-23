import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";

import RecipeForm from "./RecipeForm";

export default function Page() {
  return (
    <main>
      <Suspense>
        <LoginGuard />
      </Suspense>
    </main>
  );
}

async function LoginGuard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }
  return <RecipeForm />;
}

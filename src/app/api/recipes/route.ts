import { auth } from "@/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }
  return Response.json({ userId: session.user.id });
}

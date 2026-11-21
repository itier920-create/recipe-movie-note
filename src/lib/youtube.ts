const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
export function extractVideoId(input: string): string | null {
  let id: string | null = null;
  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^(www\.|m\.)/, "");

    if (host === "youtu.be") {
      id = url.pathname.slice(1);
    } else if (host === "youtube.com") {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/shorts/")) {
        id = url.pathname.split("/")[2];
      }
    }
  } catch {
    return null;
  }
  if (id && VIDEO_ID_PATTERN.test(id)) {
    return id;
  }
  return null;
}

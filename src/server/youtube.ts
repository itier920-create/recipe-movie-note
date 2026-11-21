type YouTubeVideosResponse = {
  items: {
    snippet: {
      title: string;
      description: string;
    };
  }[];
};

export async function fetchVideoSnippet(
  videoId: string,
): Promise<{ title: string; description: string } | null> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`YouTube API の呼び出しに失敗しました: ${res.status}`);
  }

  const data: YouTubeVideosResponse = await res.json();
  const item = data.items[0];
  if (!item) {
    return null;
  }
  return {
    title: item.snippet.title,
    description: item.snippet.description,
  };
}

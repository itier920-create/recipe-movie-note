const TIME_PATTERN = /^(\d+):([0-5]\d)$/;

export function parseTime(input: string): number | null {
  const match = input.normalize("NFKC").trim().match(TIME_PATTERN);
  if (!match) {
    return null;
  }
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  return minutes * 60 + seconds;
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

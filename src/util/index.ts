export function formatTimeElapsed(
  timeElapsed: number | null | undefined
): string {
  if (!timeElapsed) return "00:00";

  const seconds = timeElapsed % 60;

  const minutes = Math.floor(timeElapsed / 60);

  return `${minutes === 0 ? "00" : minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
}

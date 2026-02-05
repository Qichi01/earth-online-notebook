export function formatDate(input: string): string {
  const [year, month, day] = input.split("-");
  return `${year}年${month}月${day}日`;
}

export function today(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime(input: Date): string {
  const hours = String(input.getHours()).padStart(2, "0");
  const minutes = String(input.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function nowTime(): string {
  return formatTime(new Date());
}

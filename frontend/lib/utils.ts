export function formatDate(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const API_BASE_URL = `http://${process.env.NEXT_PUBLIC_API_URL || 'localhost:8000'}`;

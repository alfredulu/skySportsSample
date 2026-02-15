export type Article = {
  id: number;
  title: string;
  summary: string | null;
  sport: string;
  source: string | null;
  image_url: string | null;
  created_at: string;
};

export async function getArticles(): Promise<Article[]> {
  const res = await fetch("http://127.0.0.1:8000/v1/articles", {
    // Avoid caching during dev
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`);
  }

  return res.json();
}

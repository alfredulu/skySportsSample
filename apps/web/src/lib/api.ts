function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  opts?: RequestInit,
  tries = 10,
  delayMs = 300
) {
  let lastErr: unknown;

  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, opts);
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(delayMs);
    }
  }

  throw lastErr;
}

export type Article = {
  id: number;
  title: string;
  summary: string | null;
  sport: string;
  source: string | null;
  image_url: string | null;
  created_at: string;
};

export type ArticlesPage = {
  items: Article[];
  total: number;
  limit: number;
  offset: number;
};

export async function getArticles(params?: {
  sport?: string;
  limit?: number;
  offset?: number;
}): Promise<ArticlesPage> {
  const qs = new URLSearchParams();
  if (params?.sport) qs.set("sport", params.sport);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));

  const url = `http://localhost:8000/v1/articles${
    qs.toString() ? `?${qs}` : ""
  }`;

  const res = await fetchWithRetry(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);

  return res.json();
}

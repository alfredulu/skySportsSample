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
  body?: string | null; // ✅ add this
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
  q?: string; // ✅ add this
  limit?: number;
  offset?: number;
}): Promise<ArticlesPage> {
  const qs = new URLSearchParams();

  if (params?.sport) qs.set("sport", params.sport);
  if (params?.q) qs.set("q", params.q); // ✅ backend expects q
  if (params?.limit !== undefined) qs.set("limit", String(params.limit));
  if (params?.offset !== undefined) qs.set("offset", String(params.offset));

  const url = `http://localhost:8000/v1/articles${
    qs.toString() ? `?${qs}` : ""
  }`;

  const res = await fetchWithRetry(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`);
  }

  return res.json();
}

export async function getArticle(id: number): Promise<Article> {
  const res = await fetchWithRetry(`http://localhost:8000/v1/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article: ${res.status}`);
  }

  return res.json();
}

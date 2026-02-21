import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isFinite(articleId)) notFound();

  try {
    const a = await getArticle(articleId);

    return (
      <main className="mx-auto max-w-5xl p-6 space-y-6">
        <Link
          href="/"
          className="text-sm underline opacity-80 hover:opacity-100"
        >
          ← Back
        </Link>

        <header className="space-y-2">
          <div className="text-xs uppercase tracking-wide opacity-70">
            {a.sport} {a.source ? `• ${a.source}` : ""}
          </div>
          <h1 className="text-3xl font-bold">{a.title}</h1>
          {a.summary ? <p className="opacity-80">{a.summary}</p> : null}
        </header>
      </main>
    );
  } catch {
    // If API returns 404 (or is down), show 404 page
    notFound();
  }
}

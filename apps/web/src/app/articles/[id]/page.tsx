import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";

export default async function ArticlePage(props: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Next 16 can pass params as a Promise
  const p = await Promise.resolve(props.params);

  const id = Number(p.id);
  if (!Number.isFinite(id)) notFound();

  let article;
  try {
    article = await getArticle(id);
  } catch {
    notFound();
  }

  const bodyText =
    article.body?.trim() ||
    article.summary?.trim() ||
    "No article body available yet.";

  // Split into paragraphs on blank lines
  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-muted transition"
        >
          ← Back
        </Link>

        <div className="text-xs text-muted-foreground">
          {article.sport.toUpperCase()} • {article.source ?? "SkySportsSample"}
        </div>
      </div>

      <article className="rounded-2xl border p-6">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          {article.title}
        </h1>

        <div className="mt-3 text-xs text-muted-foreground">
          {new Date(article.created_at).toLocaleString()}
        </div>

        {article.summary ? (
          <p className="mt-4 rounded-xl border p-4 text-sm text-muted-foreground">
            {article.summary}
          </p>
        ) : null}

        <div className="mt-6 space-y-4">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-7 text-sm sm:text-base">
              {para}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}

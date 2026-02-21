import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/api";

function sportLabel(s: string) {
  if (s === "football") return "Football";
  if (s === "f1") return "F1";
  return s.toUpperCase();
}

function sportPillClass(s: string) {
  if (s === "football")
    return "bg-emerald-600/15 text-emerald-200 border-emerald-500/30";
  if (s === "f1") return "bg-red-600/15 text-red-200 border-red-500/30";
  return "bg-sky-600/15 text-sky-200 border-sky-500/30";
}

function SportPill({ sport }: { sport: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        sportPillClass(sport),
      ].join(" ")}
    >
      {sportLabel(sport)}
    </span>
  );
}

function HeroMedia({ sport }: { sport: string }) {
  const tint =
    sport === "football"
      ? "from-emerald-500/20 via-slate-900 to-slate-950"
      : sport === "f1"
      ? "from-red-500/20 via-slate-900 to-slate-950"
      : "from-sky-500/20 via-slate-900 to-slate-950";

  return (
    <div
      className={[
        "relative h-64 w-full overflow-hidden rounded-2xl border",
        "bg-gradient-to-br",
        tint,
      ].join(" ")}
    >
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <div className="text-xs text-slate-200/90">SkySportsSample • Story</div>
        <div className="text-xs text-slate-200/70">Details</div>
      </div>
    </div>
  );
}

export default async function ArticleDetailsPage(props: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const p = await Promise.resolve(props.params);
  const id = Number(p.id);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  let article;
  try {
    article = await getArticle(id);
  } catch {
    notFound();
  }

  const relatedPage = await getArticles({
    sport: article.sport,
    limit: 4,
    offset: 0,
  });
  const related = relatedPage.items
    .filter((x) => x.id !== article.id)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Top actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-muted transition"
        >
          ← Back to homepage
        </Link>

        <div className="text-xs text-muted-foreground">
          Article ID: <span className="font-medium">{article.id}</span>
        </div>
      </div>

      {/* Main article */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <HeroMedia sport={article.sport} />

        <div className="rounded-2xl border p-6">
          <div className="flex items-center justify-between gap-3">
            <SportPill sport={article.sport} />
            <span className="text-xs text-muted-foreground">
              {article.source ?? "SkySportsSample"}
            </span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">
            {article.title}
          </h1>

          <div className="mt-3 text-sm text-muted-foreground">
            Published: {new Date(article.created_at).toLocaleString()}
          </div>

          {article.summary ? (
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {article.summary}
            </p>
          ) : null}

          {/* Placeholder body for v1 */}
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            {article.body ? (
              article.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <>
                <p>This article does not yet have full body content.</p>
                <p>
                  Add a <code>body</code> field in the backend seed data to
                  render full story text here.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Related stories */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            More {sportLabel(article.sport)} stories
          </h2>
          <Link
            href={`/?sport=${encodeURIComponent(article.sport)}&limit=6`}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            View all →
          </Link>
        </div>

        {related.length === 0 ? (
          <div className="rounded-2xl border p-5 text-sm text-muted-foreground">
            No related stories yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <article key={a.id} className="rounded-2xl border p-5">
                <div className="flex items-center justify-between gap-3">
                  <SportPill sport={a.sport} />
                  <span className="text-xs text-muted-foreground">
                    {a.source ?? "SkySportsSample"}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold leading-snug">
                  {a.title}
                </h3>

                {a.summary ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {a.summary}
                  </p>
                ) : null}

                <div className="mt-4">
                  <Link
                    href={`/articles/${a.id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted transition"
                  >
                    Read
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

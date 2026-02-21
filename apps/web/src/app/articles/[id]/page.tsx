import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/api";

type PageParams = {
  id: string;
};

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

export default async function ArticlePage(props: {
  params: Promise<PageParams> | PageParams;
}) {
  const { id } = await Promise.resolve(props.params);

  const articleId = Number(id);
  if (!Number.isInteger(articleId) || articleId <= 0) {
    notFound();
  }

  let article;
  try {
    article = await getArticleById(articleId);
  } catch (err) {
    // If backend returns 404, show Next's 404 page
    if (err instanceof Error && err.message.includes("404")) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted transition"
        >
          ← Back
        </Link>

        <Link
          href="/v1/articles"
          className="hidden sm:inline-block rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition"
        >
          API /v1/articles
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border">
        {/* Hero-ish banner */}
        <div
          className={[
            "relative h-56 w-full border-b bg-gradient-to-br",
            article.sport === "football"
              ? "from-emerald-500/20 via-slate-900 to-slate-950"
              : article.sport === "f1"
              ? "from-red-500/20 via-slate-900 to-slate-950"
              : "from-sky-500/20 via-slate-900 to-slate-950",
          ].join(" ")}
        >
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-xs text-slate-200/85">
            <span>{article.source ?? "SkySportsSample"}</span>
            <span>{new Date(article.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={[
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                sportPillClass(article.sport),
              ].join(" ")}
            >
              {sportLabel(article.sport)}
            </span>

            <span className="text-xs text-muted-foreground">
              ID: {article.id}
            </span>
          </div>

          <h1 className="text-2xl font-bold leading-tight sm:text-4xl">
            {article.title}
          </h1>

          {article.summary ? (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {article.summary}
            </p>
          ) : null}

          {/* Placeholder body so it feels like a full article page for now */}
          <div className="mt-8 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              This is the article detail page wired to the backend endpoint:
              <span className="ml-1 font-medium text-foreground">
                /v1/articles/{article.id}
              </span>
              .
            </p>
            <p>
              Next, we can add a real body/content field to the database and API
              so this page shows full story text instead of summary-only
              content.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}

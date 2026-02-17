import Link from "next/link";
import { getArticles } from "@/lib/api";

type SearchParams = {
  sport?: string;
  offset?: string;
  limit?: string;
};

function toInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function makeHref(params: { sport?: string; offset?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params.sport) qs.set("sport", params.sport);
  if (typeof params.offset === "number")
    qs.set("offset", String(params.offset));
  if (typeof params.limit === "number") qs.set("limit", String(params.limit));
  const q = qs.toString();
  return q ? `/?${q}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sport = searchParams?.sport?.trim() || undefined;
  const limit = toInt(searchParams?.limit, 20);
  const offset = toInt(searchParams?.offset, 0);

  try {
    const page = await getArticles({ sport, limit, offset });

    const hasMore = offset + page.items.length < page.total;

    const filters = [
      { label: "All", sport: undefined },
      { label: "Football", sport: "football" },
      { label: "F1", sport: "f1" },
    ] as const;

    return (
      <main className="mx-auto max-w-5xl p-6">
        <header className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold">SkySportsSample</h1>
          <p className="text-sm text-muted-foreground">
            Showing {page.items.length} of {page.total} • limit {page.limit} •
            offset {page.offset}
          </p>

          <nav className="flex flex-wrap gap-2 pt-2">
            {filters.map((f) => {
              const active = (sport ?? "") === (f.sport ?? "");
              return (
                <Link
                  key={f.label}
                  href={makeHref({ sport: f.sport, offset: 0, limit })}
                  className={[
                    "rounded-full border px-3 py-1 text-sm transition",
                    active ? "bg-foreground text-background" : "hover:bg-muted",
                  ].join(" ")}
                >
                  {f.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {page.items.map((a) => (
            <article
              key={a.id}
              className="rounded-xl border p-4 transition hover:shadow-sm"
            >
              <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                {a.sport} {a.source ? `• ${a.source}` : ""}
              </div>
              <h2 className="text-lg font-semibold">{a.title}</h2>
              {a.summary ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {a.summary}
                </p>
              ) : null}
            </article>
          ))}
        </section>

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Page starts at <span className="font-medium">{offset}</span>
          </div>

          {hasMore ? (
            <Link
              href={makeHref({ sport, offset: offset + limit, limit })}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-muted transition"
            >
              Load more
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">
              No more articles
            </span>
          )}
        </div>
      </main>
    );
  } catch {
    // If API is still starting (or down), don’t crash the whole page.
    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">SkySportsSample</h1>
        <p className="mt-3 rounded-lg border p-4 text-sm">
          API is starting… refresh in a few seconds.
        </p>
      </main>
    );
  }
}

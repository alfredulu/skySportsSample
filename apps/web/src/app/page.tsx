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

function sportLabel(s: string) {
  if (s === "football") return "Football";
  if (s === "f1") return "F1";
  return s.toUpperCase();
}

function sportPillClass(s: string) {
  // Sky-ish feel without overdoing it
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
  // Placeholder “thumbnail” that still looks premium
  const tint =
    sport === "football"
      ? "from-emerald-500/20 via-slate-900 to-slate-950"
      : sport === "f1"
      ? "from-red-500/20 via-slate-900 to-slate-950"
      : "from-sky-500/20 via-slate-900 to-slate-950";

  return (
    <div
      className={[
        "relative h-56 w-full overflow-hidden rounded-2xl border",
        "bg-gradient-to-br",
        tint,
      ].join(" ")}
    >
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <div className="text-xs text-slate-200/90">SkySportsSample • Live</div>
        <div className="text-xs text-slate-200/70">Today</div>
      </div>
    </div>
  );
}

export default async function Home(props: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  // ✅ Next 16 sometimes passes searchParams as a Promise
  const sp = props.searchParams
    ? await Promise.resolve(props.searchParams)
    : undefined;

  const PAGE_SIZE = 6; // we’ll keep it modest for “Load more”
  const sport = sp?.sport?.trim() || undefined;

  // ✅ Append-style load more: offset stays 0, limit grows
  const limit = toInt(sp?.limit, PAGE_SIZE);
  const offset = 0;

  const page = await getArticles({ sport, limit, offset });
  const items = page.items;

  const hasMore = items.length < page.total;

  const filters = [
    { label: "All", sport: undefined },
    { label: "Football", sport: "football" },
    { label: "F1", sport: "f1" },
  ] as const;

  const hero = items[0];
  const rest = items.slice(1);

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Top Bar */}
      <header className="mb-6 flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              SkySportsSample
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {items.length} of {page.total} • limit {limit}
            </p>
          </div>

          <div className="hidden sm:block rounded-xl border px-3 py-2 text-xs text-muted-foreground">
            API: <span className="font-medium">/v1/articles</span>
          </div>
        </div>

        {/* Filters */}
        <nav className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = (sport ?? "") === (f.sport ?? "");
            return (
              <Link
                key={f.label}
                href={makeHref({ sport: f.sport, offset: 0, limit: PAGE_SIZE })}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  active ? "bg-foreground text-background" : "hover:bg-muted",
                ].join(" ")}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center">
          <div className="text-lg font-semibold">No stories found</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Try switching the sport filter.
          </div>
        </div>
      ) : (
        <>
          {/* HERO */}
          {hero ? (
            <section className="mb-8 grid gap-5 lg:grid-cols-2">
              <HeroMedia sport={hero.sport} />

              <div className="flex flex-col justify-between rounded-2xl border p-6">
                <div className="flex items-center justify-between gap-3">
                  <SportPill sport={hero.sport} />
                  <span className="text-xs text-muted-foreground">
                    {hero.source ?? "SkySportsSample"}
                  </span>
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold leading-tight clamp-2">
                    {hero.title}
                  </h2>
                  {hero.summary ? (
                    <p className="mt-3 text-sm text-muted-foreground clamp-3">
                      {hero.summary}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Top story</span>
                  <Link
                    href={`/articles/${hero.id}`}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-white/10 transition"
                  >
                    Read
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          {/* GRID */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <article
                key={a.id}
                className="group rounded-2xl border p-5 transition hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <SportPill sport={a.sport} />
                  <span className="text-xs text-muted-foreground">
                    {a.source ?? "SkySportsSample"}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold leading-snug clamp-2 group-hover:underline">
                  {a.title}
                </h3>

                {a.summary ? (
                  <p className="mt-2 text-sm text-muted-foreground clamp-3">
                    {a.summary}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString()}
                  </div>

                  <Link
                    href={`/articles/${a.id}`}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-muted transition"
                  >
                    Read
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {/* LOAD MORE */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Loaded <span className="font-medium">{items.length}</span> /{" "}
              <span className="font-medium">{page.total}</span>
            </div>

            {hasMore ? (
              <Link
                href={makeHref({ sport, offset: 0, limit: limit + PAGE_SIZE })}
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
        </>
      )}
    </main>
  );
}

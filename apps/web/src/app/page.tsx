import { getArticles } from "@/lib/api";

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">SkySportsSample</h1>
        <p className="text-muted-foreground">
          Modern rebuild — Next.js + FastAPI + Postgres
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {articles.map((a) => (
          <article
            key={a.id}
            className="rounded-xl border p-4 hover:shadow-sm transition"
          >
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {a.sport} {a.source ? `• ${a.source}` : ""}
            </div>
            <h2 className="text-lg font-semibold">{a.title}</h2>
            {a.summary ? (
              <p className="mt-2 text-sm text-muted-foreground">{a.summary}</p>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}

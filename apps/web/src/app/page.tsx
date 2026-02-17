import { getArticles } from "@/lib/api";

export default async function Home() {
  try {
    const page = await getArticles({ limit: 20, offset: 0 });

    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">SkySportsSample</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Showing {page.items.length} of {page.total}
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {page.items.map((a) => (
            <article key={a.id} className="rounded-xl border p-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                {a.sport}
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
      </main>
    );
  } catch {
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

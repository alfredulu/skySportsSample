export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 space-y-3">
        <div className="h-8 w-64 rounded-lg border animate-pulse" />
        <div className="h-4 w-80 rounded-lg border animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 w-20 rounded-full border animate-pulse" />
          <div className="h-9 w-24 rounded-full border animate-pulse" />
          <div className="h-9 w-16 rounded-full border animate-pulse" />
        </div>
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        <div className="h-56 rounded-2xl border animate-pulse" />
        <div className="rounded-2xl border p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-7 w-24 rounded-full border animate-pulse" />
            <div className="h-4 w-24 rounded-lg border animate-pulse" />
          </div>
          <div className="h-7 w-full rounded-lg border animate-pulse" />
          <div className="h-7 w-5/6 rounded-lg border animate-pulse" />
          <div className="h-4 w-full rounded-lg border animate-pulse" />
          <div className="h-4 w-4/5 rounded-lg border animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-7 w-20 rounded-full border animate-pulse" />
              <div className="h-4 w-20 rounded-lg border animate-pulse" />
            </div>
            <div className="h-5 w-full rounded-lg border animate-pulse" />
            <div className="h-5 w-5/6 rounded-lg border animate-pulse" />
            <div className="h-4 w-full rounded-lg border animate-pulse" />
            <div className="h-4 w-4/5 rounded-lg border animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}

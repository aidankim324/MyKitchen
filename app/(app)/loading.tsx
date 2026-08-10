function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-gray-200" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />

        <div className="space-y-2 pt-3">
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function AppLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading application"
      className="mx-auto max-w-[110rem] px-4 py-7 sm:px-6 lg:px-8"
    >
      <div className="space-y-3">
        <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-gray-100" />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="mt-4 h-9 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    </main>
  );
}

import Link from "next/link";

export default function AppNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border bg-white p-7 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          404
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          The page or inventory item may have been removed, or the
          address may be incorrect.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/inventory"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View inventory
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

type AppErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function AppError({
  error,
  reset,
}: AppErrorProps) {
  useEffect(() => {
    console.error("Protected application error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border bg-white p-7 text-center shadow-sm sm:p-10">
        <div
          aria-hidden="true"
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-2xl"
        >
          !
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          The application could not complete this request. Your
          inventory data has not been changed.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try again
          </button>

          <Link
            href="/inventory"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Return to inventory
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-6 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}

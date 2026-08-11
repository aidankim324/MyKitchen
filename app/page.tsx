import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
      <div className="absolute right-6 top-6">
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
        Home inventory
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
        MyKitchen
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
        Track what is in your fridge,
        freezer, and pantry.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/guest"
          className="inline-flex min-h-11 items-center rounded-control border border-line bg-surface px-4 text-sm font-medium text-ink shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:border-line-strong hover:bg-surface-subtle"
        >
          View guest demo
        </Link>

        <Show when="signed-out">
          <SignInButton>
            <button className="inline-flex min-h-11 items-center rounded-control border border-line bg-surface px-4 text-sm font-medium text-muted shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:border-line-strong hover:text-ink">
              Sign in
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="inline-flex min-h-11 items-center rounded-control bg-accent px-4 text-sm font-medium text-accent-foreground shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-accent-hover">
              Create account
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center rounded-control bg-accent px-4 text-sm font-medium text-accent-foreground shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-accent-hover"
          >
            Go to dashboard
          </Link>
        </Show>
      </div>
    </main>
  );
}

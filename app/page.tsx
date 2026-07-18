import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
      <div className="absolute right-6 top-6">
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      <h1 className="text-4xl font-bold tracking-tight">MyKitchen</h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        Track what is in your fridge, freezer, and pantry.
      </p>

      <div className="mt-8 flex gap-3">
        <Show when="signed-out">
          <SignInButton>
            <button className="rounded-md border px-4 py-2 text-sm font-medium">
              Sign in
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
              Create account
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Go to dashboard
          </Link>
        </Show>
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { GuestInventoryBrowser } from "@/components/guest/GuestInventoryBrowser";
import { formatUtcDateOnly } from "@/lib/dates";
import { getGuestInventory } from "@/lib/guest-inventory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest Inventory",
  description:
    "Explore a read-only sample MyKitchen inventory.",
};

export default function GuestInventoryPage() {
  const today = formatUtcDateOnly();
  const items = getGuestInventory(today);

  return (
    <main className="mx-auto max-w-[110rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Guest preview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            Inventory
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Explore a sample kitchen using the
            same search, filtering, sorting,
            and expiration tracking available
            in MyKitchen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex min-h-8 items-center gap-2 rounded-control border border-line bg-surface px-3 text-xs font-medium text-muted shadow-soft">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            Read-only preview
          </span>

          <span className="inline-flex min-h-8 items-center rounded-control border border-line bg-surface px-3 text-xs font-medium text-muted shadow-soft">
            {items.length} items
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-accent/20 bg-accent-soft/60 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm font-medium text-accent-active">
            Sample data only
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            Search, filter, and sort freely.
            Editing and inventory mutations
            are disabled in guest mode.
          </p>
        </div>

        <Link
          href="/sign-up"
          className="mt-3 inline-flex min-h-9 shrink-0 items-center rounded-control bg-surface px-3 text-xs font-medium text-accent shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-background sm:mt-0"
        >
          Create your own kitchen
        </Link>
      </div>

      <div className="mt-6">
        <GuestInventoryBrowser
          items={items}
          today={today}
        />
      </div>
    </main>
  );
}

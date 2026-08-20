import { auth } from "@clerk/nextjs/server";
import { InventoryBrowser } from "@/components/inventory/InventoryBrowser";
import { formatUtcDateOnly } from "@/lib/dates";
import { getKitchenItemsForUser } from "@/lib/items/queries";

export default async function InventoryPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const items = await getKitchenItemsForUser(userId);
  const today = formatUtcDateOnly();

  return (
    <main className="mx-auto max-w-[110rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <header className="mb-7 border-b border-line pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Kitchen overview
        </p>

        <div className="mt-2">
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-[2.15rem]">
            Inventory
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Search, organize, and keep track of everything
            stored across your kitchen.
          </p>
        </div>
      </header>

      <InventoryBrowser
        items={items}
        today={today}
      />
    </main>
  );
}

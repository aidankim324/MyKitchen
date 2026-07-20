import Link from "next/link";
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
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Everything currently in your kitchen.
          </p>
        </div>

        <Link
          href="/inventory/new"
          className="shrink-0 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
        >
          Add item
        </Link>
      </div>

      <InventoryBrowser items={items} today={today} />
    </main>
  );
}

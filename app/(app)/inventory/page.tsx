import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { InventoryList } from "@/components/inventory/InventoryList";
import { getKitchenItemsForUser } from "@/lib/items/queries";

export default async function InventoryPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const items = await getKitchenItemsForUser(userId);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="mt-1 text-sm text-gray-600">
            View what is currently in your fridge, freezer, and pantry.
          </p>
        </div>

        <Link
          href="/inventory/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Add item
        </Link>
      </div>

      <InventoryList items={items} />
    </main>
  );
}

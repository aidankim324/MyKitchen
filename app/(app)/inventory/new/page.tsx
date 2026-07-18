import Link from "next/link";
import { ItemForm } from "@/components/inventory/ItemForm";

export default function NewInventoryItemPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <Link href="/inventory" className="text-sm text-gray-600 hover:text-black">
          ← Back to inventory
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">Add item</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a food or kitchen item to your fridge, freezer, or pantry.
        </p>
      </div>

      <ItemForm mode="create" />
    </main>
  );
}

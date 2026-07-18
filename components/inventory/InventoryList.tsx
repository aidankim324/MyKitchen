import type { KitchenItem } from "@/types/inventory";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";

type InventoryListProps = {
  items: KitchenItem[];
};

export function InventoryList({ items }: InventoryListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">No kitchen items yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Add your first item to start tracking your fridge, freezer, and pantry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <InventoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

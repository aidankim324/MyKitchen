import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import type { KitchenItem } from "@/types/inventory";

type InventoryListProps = {
  items: KitchenItem[];
  today: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function InventoryList({
  items,
  today,
  emptyTitle = "No kitchen items",
  emptyDescription = "Add an item to begin tracking your kitchen.",
}: InventoryListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-gray-50 px-6 py-14 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
          +
        </div>
        <h2 className="mt-4 text-lg font-semibold">
          {emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <InventoryItemCard
          key={item.id}
          item={item}
          today={today}
        />
      ))}
    </div>
  );
}

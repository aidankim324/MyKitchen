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
      <div className="rounded-card border border-dashed border-line-strong bg-surface px-6 py-14 text-center shadow-soft sm:py-16">
        <div className="mx-auto flex size-12 items-center justify-center rounded-card bg-accent-soft text-accent">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 8.5H19"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M7 8.5L8 19H16L17 8.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 8.5V6.75C9 5.78 9.78 5 10.75 5H13.25C14.22 5 15 5.78 15 6.75V8.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M10 12V16"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M14 12V16"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-ink">
          {emptyTitle}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

import Link from "next/link";
import { getExpirationStatus } from "@/lib/dates";
import type { KitchenItem } from "@/types/inventory";

type InventoryItemCardProps = {
  item: KitchenItem;
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getExpirationLabel(expirationDate: string | null) {
  const status = getExpirationStatus(expirationDate);

  if (status === "expired") return "Expired";
  if (status === "expiring_soon") return "Expiring soon";
  if (status === "fresh") return "Fresh";
  return "No date";
}

export function InventoryItemCard({ item }: InventoryItemCardProps) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {formatLabel(item.storageLocation)} · {formatLabel(item.category)}
          </p>
        </div>

        <span className="rounded-full border px-3 py-1 text-xs font-medium">
          {getExpirationLabel(item.expirationDate)}
        </span>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        <p>
          Quantity: {item.quantity} {formatLabel(item.unit)}
        </p>
        <p>
          Expiration: {item.expirationDate ?? "No expiration date"}
        </p>
        {item.notes ? <p className="mt-2">Notes: {item.notes}</p> : null}
      </div>

      <div className="mt-4">
        <Link
          href={`/inventory/${item.id}/edit`}
          className="text-sm font-medium text-gray-700 hover:text-black"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}

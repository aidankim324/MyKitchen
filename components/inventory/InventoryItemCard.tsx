import Image from "next/image";
import Link from "next/link";
import { DeleteItemButton } from "@/components/inventory/DeleteItemButton";
import { QuickItemActions } from "@/components/inventory/QuickItemActions";
import { getExpirationStatus } from "@/lib/dates";
import { getSuggestedItemImage } from "@/lib/item-images";
import type {
  ExpirationStatus,
  KitchenItem,
} from "@/types/inventory";

type InventoryItemCardProps = {
  item: KitchenItem;
  today: string;
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

function formatDate(dateOnly: string) {
  const [year, month, day] = dateOnly
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getCategoryIcon(
  category: KitchenItem["category"]
) {
  const icons: Partial<
    Record<KitchenItem["category"], string>
  > = {
    produce: "🥬",
    dairy: "🥛",
    meat: "🥩",
    seafood: "🐟",
    frozen: "❄️",
    grains: "🌾",
    canned_goods: "🥫",
    snacks: "🍿",
    beverages: "🥤",
    condiments: "🫙",
    spices: "🌶️",
    baking: "🧁",
    household: "🧻",
    leftovers: "🍱",
  };

  return icons[category] ?? "🍽️";
}

function getStatusDisplay(
  status: ExpirationStatus
) {
  if (status === "expired") {
    return {
      label: "Expired",
      classes: "bg-red-100 text-red-800",
    };
  }

  if (status === "expiring_soon") {
    return {
      label: "Expiring soon",
      classes:
        "bg-amber-100 text-amber-800",
    };
  }

  if (status === "fresh") {
    return {
      label: "Fresh",
      classes:
        "bg-green-100 text-green-800",
    };
  }

  return {
    label: "No expiration",
    classes: "bg-white/95 text-gray-700",
  };
}

export function InventoryItemCard({
  item,
  today,
}: InventoryItemCardProps) {
  const now = new Date(
    `${today}T00:00:00.000Z`
  );

  const expirationStatus =
    getExpirationStatus(
      item.expirationDate,
      now
    );

  const status =
    getStatusDisplay(expirationStatus);

  const suggestedImage =
    getSuggestedItemImage(item.name);

  const titleId = `item-${item.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-100">
        {suggestedImage ? (
          <Image
            src={suggestedImage.src}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-6xl transition group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          >
            {getCategoryIcon(item.category)}
          </span>
        )}

        <span
          aria-label={`Expiration status: ${status.label}`}
          className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${status.classes}`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <div>
          <h2
            id={titleId}
            title={item.name}
            className="line-clamp-2 min-h-14 break-words text-lg font-semibold leading-7"
          >
            {item.name}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {formatLabel(
              item.storageLocation
            )}
            {" · "}
            {formatLabel(item.category)}
          </p>
        </div>

        <div className="mt-4">
          <p className="font-medium">
            {item.quantity}{" "}
            {formatLabel(item.unit)}
          </p>

          <QuickItemActions
            itemId={item.id}
            itemName={item.name}
            quantity={item.quantity}
            openedDate={item.openedDate}
          />
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">
              Bought
            </dt>
            <dd className="text-right">
              {formatDate(item.dateBought)}
            </dd>
          </div>

          {item.openedDate ? (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">
                Opened
              </dt>
              <dd className="text-right">
                {formatDate(item.openedDate)}
              </dd>
            </div>
          ) : null}

          {item.expirationDate ? (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">
                Expires
              </dt>
              <dd className="text-right">
                {formatDate(
                  item.expirationDate
                )}
              </dd>
            </div>
          ) : null}
        </dl>

        <div
          aria-label={`Actions for ${item.name}`}
          className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3"
        >
          <Link
            href={`/inventory/${item.id}/edit`}
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            Edit
          </Link>

          <DeleteItemButton
            itemId={item.id}
            itemName={item.name}
          />
        </div>
      </div>
    </article>
  );
}

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
        part.charAt(0).toUpperCase() + part.slice(1)
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

function getStatusDisplay(status: ExpirationStatus) {
  if (status === "expired") {
    return {
      label: "Expired",
      classes: "bg-red-100 text-red-700",
    };
  }

  if (status === "expiring_soon") {
    return {
      label: "Expiring soon",
      classes: "bg-amber-100 text-amber-700",
    };
  }

  if (status === "fresh") {
    return {
      label: "Fresh",
      classes: "bg-green-100 text-green-700",
    };
  }

  return {
    label: "No expiration",
    classes: "bg-white/90 text-gray-600",
  };
}

export function InventoryItemCard({
  item,
  today,
}: InventoryItemCardProps) {
  const now = new Date(`${today}T00:00:00.000Z`);

  const expirationStatus = getExpirationStatus(
    item.expirationDate,
    now
  );

  const status = getStatusDisplay(expirationStatus);
  const suggestedImage = getSuggestedItemImage(item.name);

  return (
    <article className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-100">
        {suggestedImage ? (
          <Image
            src={suggestedImage.src}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-6xl transition group-hover:scale-105"
          >
            {getCategoryIcon(item.category)}
          </span>
        )}

        <span
          className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${status.classes}`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <div>
          <h2 className="truncate text-lg font-semibold">
            {item.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {formatLabel(item.storageLocation)}
            {" · "}
            {formatLabel(item.category)}
          </p>
        </div>

        <div className="mt-4">
          <p className="font-medium">
            {item.quantity} {formatLabel(item.unit)}
          </p>

          <QuickItemActions
            itemId={item.id}
            itemName={item.name}
            quantity={item.quantity}
            openedDate={item.openedDate}
          />
        </div>

        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Bought</dt>
            <dd className="text-right">
              {formatDate(item.dateBought)}
            </dd>
          </div>

          {item.openedDate ? (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Opened</dt>
              <dd className="text-right">
                {formatDate(item.openedDate)}
              </dd>
            </div>
          ) : null}

          {item.expirationDate ? (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">
                Expires
              </dt>
              <dd className="text-right">
                {formatDate(item.expirationDate)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-5 flex items-center gap-4 border-t pt-4">
          <Link
            href={`/inventory/${item.id}/edit`}
            className="text-sm font-medium text-gray-700 hover:text-black"
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

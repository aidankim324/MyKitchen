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
      dotClasses: "bg-danger",
      labelClasses:
        "bg-danger-soft text-danger",
    };
  }

  if (status === "expiring_soon") {
    return {
      label: "Expiring soon",
      dotClasses: "bg-warning",
      labelClasses:
        "bg-warning-soft text-warning",
    };
  }

  if (status === "fresh") {
    return {
      label: "Fresh",
      dotClasses: "bg-success",
      labelClasses:
        "bg-success-soft text-success",
    };
  }

  return {
    label: "No expiration",
    dotClasses: "bg-muted-light",
    labelClasses:
      "bg-surface-subtle text-muted",
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
      className={[
        "group overflow-hidden rounded-card border border-line bg-surface",
        "shadow-soft transition duration-[var(--duration-standard)] ease-standard",
        "hover:-translate-y-px hover:border-line-strong hover:shadow-raised",
        "motion-reduce:transform-none motion-reduce:transition-none",
      ].join(" ")}
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-surface-subtle sm:h-40">
        {suggestedImage ? (
          <Image
            src={suggestedImage.src}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-5xl transition-transform duration-[var(--duration-standard)] ease-standard group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          >
            {getCategoryIcon(item.category)}
          </span>
        )}

        <span
          aria-label={`Expiration status: ${status.label}`}
          className={[
            "absolute right-3 top-3 z-10 inline-flex min-h-7 items-center gap-1.5",
            "rounded-control px-2.5 text-[0.7rem] font-semibold shadow-sm",
            status.labelClasses,
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${status.dotClasses}`}
          />

          {status.label}
        </span>
      </div>

      <div className="p-4">
        <div className="min-w-0">
          <h2
            id={titleId}
            title={item.name}
            className="truncate text-base font-semibold tracking-[-0.015em] text-ink"
          >
            {item.name}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>
              {formatLabel(
                item.storageLocation
              )}
            </span>

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-line-strong"
            />

            <span>
              {formatLabel(item.category)}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-light">
                Quantity
              </p>

              <p className="mt-1 text-base font-semibold text-ink">
                {item.quantity}{" "}
                <span className="text-sm font-medium text-muted">
                  {formatLabel(item.unit)}
                </span>
              </p>
            </div>

            <QuickItemActions
              itemId={item.id}
              itemName={item.name}
              quantity={item.quantity}
              openedDate={item.openedDate}
            />
          </div>
        </div>

        <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-xs">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">
              Bought
            </dt>
            <dd className="font-medium text-ink">
              {formatDate(item.dateBought)}
            </dd>
          </div>

          {item.openedDate ? (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">
                Opened
              </dt>
              <dd className="font-medium text-ink">
                {formatDate(item.openedDate)}
              </dd>
            </div>
          ) : null}

          {item.expirationDate ? (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">
                Expires
              </dt>
              <dd className="font-medium text-ink">
                {formatDate(
                  item.expirationDate
                )}
              </dd>
            </div>
          ) : null}
        </dl>

        <div
          aria-label={`Actions for ${item.name}`}
          className="mt-3 flex items-center justify-end gap-1 border-t border-line pt-2"
        >
          <Link
            href={`/inventory/${item.id}/edit`}
            className="inline-flex min-h-9 items-center rounded-control px-2.5 text-xs font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
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

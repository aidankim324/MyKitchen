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
  readOnly?: boolean;
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

function getCategoryVisual(
  category: KitchenItem["category"]
) {
  const visuals: Partial<
    Record<
      KitchenItem["category"],
      {
        icon: string;
        backgroundClasses: string;
      }
    >
  > = {
    produce: {
      icon: "\u{1F96C}",
      backgroundClasses: "bg-[#edf3e8]",
    },
    dairy: {
      icon: "\u{1F95B}",
      backgroundClasses: "bg-[#edf3f6]",
    },
    meat: {
      icon: "\u{1F969}",
      backgroundClasses: "bg-[#f5ece8]",
    },
    seafood: {
      icon: "\u{1F41F}",
      backgroundClasses: "bg-[#eaf2f3]",
    },
    frozen: {
      icon: "\u{2744}\u{FE0F}",
      backgroundClasses: "bg-[#edf4f7]",
    },
    grains: {
      icon: "\u{1F33E}",
      backgroundClasses: "bg-[#f3efe5]",
    },
    canned_goods: {
      icon: "\u{1F96B}",
      backgroundClasses: "bg-[#f2eee7]",
    },
    snacks: {
      icon: "\u{1F37F}",
      backgroundClasses: "bg-[#f5efe6]",
    },
    beverages: {
      icon: "\u{1F964}",
      backgroundClasses: "bg-[#edf2f3]",
    },
    condiments: {
      icon: "\u{1FAD9}",
      backgroundClasses: "bg-[#f3ede7]",
    },
    spices: {
      icon: "\u{1F336}\u{FE0F}",
      backgroundClasses: "bg-[#f5eee2]",
    },
    baking: {
      icon: "\u{1F9C1}",
      backgroundClasses: "bg-[#f4ece8]",
    },
    household: {
      icon: "\u{1F9FB}",
      backgroundClasses: "bg-[#eff1ed]",
    },
    leftovers: {
      icon: "\u{1F371}",
      backgroundClasses: "bg-[#f2eee8]",
    },
  };

  return (
    visuals[category] ?? {
      icon: "\u{1F37D}\u{FE0F}",
      backgroundClasses:
        "bg-surface-subtle",
    }
  );
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
  readOnly = false,
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

  const categoryVisual =
    getCategoryVisual(item.category);

  const titleId = `item-${item.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={[
        "group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface",
        "shadow-soft transition duration-[var(--duration-standard)] ease-standard",
        "hover:-translate-y-px hover:border-line-strong hover:shadow-raised",
        "motion-reduce:transform-none motion-reduce:transition-none",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-36 shrink-0 items-center justify-center overflow-hidden sm:h-40",
          categoryVisual.backgroundClasses,
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className="absolute -right-8 -top-8 size-28 rounded-full bg-white/35"
        />

        <span
          aria-hidden="true"
          className="absolute -bottom-10 -left-8 size-32 rounded-full bg-white/30"
        />

        <div className="relative z-[1] flex size-20 items-center justify-center rounded-[1.35rem] bg-surface/75 shadow-soft transition-transform duration-[var(--duration-standard)] ease-standard group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none">
          {suggestedImage ? (
            <Image
              src={suggestedImage.src}
              alt=""
              width={64}
              height={64}
              unoptimized
              className="size-16 object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="select-none text-5xl leading-none"
            >
              {categoryVisual.icon}
            </span>
          )}
        </div>

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

      <div className="flex flex-1 flex-col p-4">
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

            {!readOnly ? (
              <QuickItemActions
                itemId={item.id}
                itemName={item.name}
                quantity={item.quantity}
                openedDate={item.openedDate}
              />
            ) : null}
          </div>
        </div>

        <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-xs">
          <div className="flex min-h-5 items-center justify-between gap-4">
            <dt className="text-muted">
              Bought
            </dt>

            <dd className="font-medium text-ink">
              {formatDate(item.dateBought)}
            </dd>
          </div>

          <div className="flex min-h-5 items-center justify-between gap-4">
            <dt className="text-muted">
              Opened
            </dt>

            <dd
              className={
                item.openedDate
                  ? "font-medium text-ink"
                  : "font-medium text-muted-light"
              }
            >
              {item.openedDate
                ? formatDate(item.openedDate)
                : "Not set"}
            </dd>
          </div>

          <div className="flex min-h-5 items-center justify-between gap-4">
            <dt className="text-muted">
              Expires
            </dt>

            <dd
              className={
                item.expirationDate
                  ? "font-medium text-ink"
                  : "font-medium text-muted-light"
              }
            >
              {item.expirationDate
                ? formatDate(
                    item.expirationDate
                  )
                : "Not set"}
            </dd>
          </div>
        </dl>

        {!readOnly ? (
          <div
            aria-label={`Actions for ${item.name}`}
            className="mt-auto flex items-center justify-end gap-1 border-t border-line pt-2"
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
        ) : null}
      </div>
    </article>
  );
}

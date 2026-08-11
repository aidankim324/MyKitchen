import type { Metadata } from "next";
import Link from "next/link";
import {
  formatUtcDateOnly,
  getExpirationStatus,
} from "@/lib/dates";
import { getGuestInventory } from "@/lib/guest-inventory";
import type {
  ExpirationStatus,
  KitchenItem,
} from "@/types/inventory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest Dashboard",
  description:
    "Explore the MyKitchen guest dashboard.",
};

function formatDate(dateOnly: string) {
  const [year, month, day] = dateOnly
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(
    new Date(
      Date.UTC(year, month - 1, day)
    )
  );
}

function getStatusDisplay(
  status: ExpirationStatus
) {
  if (status === "expired") {
    return {
      label: "Expired",
      classes:
        "bg-danger-soft text-danger",
    };
  }

  if (status === "expiring_soon") {
    return {
      label: "Expiring soon",
      classes:
        "bg-warning-soft text-warning",
    };
  }

  return {
    label: "Fresh",
    classes:
      "bg-success-soft text-success",
  };
}

function compareExpirationDates(
  first: KitchenItem,
  second: KitchenItem
) {
  if (!first.expirationDate) {
    return 1;
  }

  if (!second.expirationDate) {
    return -1;
  }

  return first.expirationDate.localeCompare(
    second.expirationDate
  );
}

export default function GuestDashboardPage() {
  const today = formatUtcDateOnly();
  const items = getGuestInventory(today);
  const now = new Date(
    `${today}T00:00:00.000Z`
  );

  const fridgeCount = items.filter(
    (item) =>
      item.storageLocation === "fridge"
  ).length;

  const freezerCount = items.filter(
    (item) =>
      item.storageLocation === "freezer"
  ).length;

  const pantryCount = items.filter(
    (item) =>
      item.storageLocation === "pantry"
  ).length;

  const itemsWithStatuses = items.map(
    (item) => ({
      item,
      status: getExpirationStatus(
        item.expirationDate,
        now
      ),
    })
  );

  const expiredCount =
    itemsWithStatuses.filter(
      ({ status }) =>
        status === "expired"
    ).length;

  const expiringSoonCount =
    itemsWithStatuses.filter(
      ({ status }) =>
        status === "expiring_soon"
    ).length;

  const attentionItems =
    itemsWithStatuses
      .filter(
        ({ status }) =>
          status === "expired" ||
          status === "expiring_soon"
      )
      .sort((first, second) =>
        compareExpirationDates(
          first.item,
          second.item
        )
      )
      .slice(0, 5);

  const recentItems = [...items]
    .sort(
      (first, second) =>
        new Date(
          second.createdAt
        ).getTime() -
        new Date(
          first.createdAt
        ).getTime()
    )
    .slice(0, 5);

  const metrics = [
    {
      label: "Total items",
      value: items.length,
    },
    {
      label: "Fridge",
      value: fridgeCount,
    },
    {
      label: "Freezer",
      value: freezerCount,
    },
    {
      label: "Pantry",
      value: pantryCount,
    },
  ];

  return (
    <main className="mx-auto max-w-[110rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Guest preview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            A sample overview of a kitchen
            inventory and the items that need
            attention.
          </p>
        </div>

        <Link
          href="/guest/inventory"
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-control bg-accent px-4 text-sm font-medium text-accent-foreground shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-accent-hover"
        >
          View inventory
        </Link>
      </div>

      <section
        aria-label="Guest inventory summary"
        className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-card border border-line bg-surface p-5 shadow-soft"
          >
            <p className="text-xs font-medium text-muted">
              {metric.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-card border border-line bg-surface px-5 py-4 shadow-soft">
          <div>
            <p className="text-xs font-medium text-muted">
              Expired
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-danger">
              {expiredCount}
            </p>
          </div>

          <span className="flex size-10 items-center justify-center rounded-control bg-danger-soft text-danger">
            !
          </span>
        </div>

        <div className="flex items-center justify-between rounded-card border border-line bg-surface px-5 py-4 shadow-soft">
          <div>
            <p className="text-xs font-medium text-muted">
              Expiring soon
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-warning">
              {expiringSoonCount}
            </p>
          </div>

          <span className="flex size-10 items-center justify-center rounded-control bg-warning-soft text-warning">
            !
          </span>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">
                Needs attention
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Expired or expiring soon
              </p>
            </div>

            <Link
              href="/guest/inventory"
              className="rounded-control px-2.5 py-1.5 text-xs font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-line">
            {attentionItems.map(
              ({ item, status }) => {
                const display =
                  getStatusDisplay(status);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {item.expirationDate
                          ? `Expires ${formatDate(
                              item.expirationDate
                            )}`
                          : "No expiration date"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-control px-2.5 py-1 text-[0.68rem] font-semibold ${display.classes}`}
                    >
                      {display.label}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">
                Recently added
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Latest sample inventory
              </p>
            </div>

            <Link
              href="/guest/inventory"
              className="rounded-control px-2.5 py-1.5 text-xs font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
            >
              Inventory
            </Link>
          </div>

          <div className="divide-y divide-line">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {item.storageLocation
                      .charAt(0)
                      .toUpperCase() +
                      item.storageLocation.slice(
                        1
                      )}
                  </p>
                </div>

                <p className="shrink-0 text-xs font-medium text-muted">
                  {item.quantity} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-card border border-accent/20 bg-accent-soft/60 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm font-medium text-accent-active">
            Read-only guest experience
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            This dashboard uses sample data.
            Create an account to manage a real
            kitchen inventory.
          </p>
        </div>

        <Link
          href="/sign-up"
          className="mt-3 inline-flex min-h-9 shrink-0 items-center rounded-control bg-surface px-3 text-xs font-medium text-accent shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-background sm:mt-0"
        >
          Create your own kitchen
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  formatUtcDateOnly,
  getExpirationStatus,
} from "@/lib/dates";
import { getKitchenItemsForUser } from "@/lib/items/queries";
import type {
  ExpirationStatus,
  KitchenItem,
} from "@/types/inventory";

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

  return {
    label: "Fresh",
    dotClasses: "bg-success",
    labelClasses:
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

export default async function DashboardPage() {
  const { userId, redirectToSignIn } =
    await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const items =
    await getKitchenItemsForUser(userId);

  const today = formatUtcDateOnly();
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

  const storageSummary = [
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

  const attentionCount =
    expiredCount + expiringSoonCount;

  const attentionItems = itemsWithStatuses
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

  return (
    <main className="mx-auto max-w-[110rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Kitchen overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-[2.15rem]">
            Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            A quick read on what you have,
            where it is stored, and what needs
            attention.
          </p>
        </div>

        <Link
          href="/inventory"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-control border border-line bg-surface px-3.5 text-sm font-medium text-muted shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:border-line-strong hover:bg-surface-subtle hover:text-ink"
        >
          View inventory

          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M14 7L19 12L14 17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </header>

      <section
        aria-label="Kitchen summary"
        className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]"
      >
        <div className="rounded-card border border-line bg-surface shadow-soft">
          <div className="border-b border-line px-5 py-5 sm:px-6">
            <p className="text-sm font-medium text-muted">
              Inventory overview
            </p>

            <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-ink">
              {items.length}
            </p>
          </div>

          <dl className="divide-y divide-line">
            {storageSummary.map(
              (location) => (
                <div
                  key={location.label}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6"
                >
                  <dt className="flex items-center gap-3 text-sm font-medium text-ink">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-accent/65"
                    />

                    {location.label}
                  </dt>

                  <dd className="flex items-baseline gap-1.5">
                    <span className="text-lg font-semibold tracking-[-0.02em] text-ink">
                      {location.value}
                    </span>

                    <span className="text-xs text-muted">
                      items
                    </span>
                  </dd>
                </div>
              )
            )}
          </dl>
        </div>

        <div className="rounded-card border border-line bg-surface shadow-soft">
          <div className="border-b border-line px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">
                  Needs attention
                </p>

                <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-ink">
                  {attentionCount}
                </p>
              </div>

              <span
                aria-hidden="true"
                className={[
                  "flex size-10 items-center justify-center rounded-control",
                  attentionCount > 0
                    ? "bg-warning-soft text-warning"
                    : "bg-success-soft text-success",
                ].join(" ")}
              >
                {attentionCount > 0 ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V13"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M12 16.5V16.6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.3 4.9L3.4 17C2.65 18.3 3.6 20 5.1 20H18.9C20.4 20 21.35 18.3 20.6 17L13.7 4.9C12.95 3.6 11.05 3.6 10.3 4.9Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5 12.5L10 17L18.5 7.5"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <dl className="divide-y divide-line">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-muted">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-danger"
                />

                Expired
              </dt>

              <dd className="text-lg font-semibold text-danger">
                {expiredCount}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-muted">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-warning"
                />

                Expiring soon
              </dt>

              <dd className="text-lg font-semibold text-warning">
                {expiringSoonCount}
              </dd>
            </div>
          </dl>

          {attentionCount === 0 ? (
            <div className="border-t border-line bg-success-soft/50 px-5 py-3">
              <p className="text-xs font-medium text-success">
                Everything with an expiration
                date is currently in good shape.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold tracking-[-0.015em] text-ink">
                Needs attention
              </h2>

              <p className="mt-1 text-sm text-muted">
                Expired items and items nearing
                their expiration date.
              </p>
            </div>

            <Link
              href="/inventory"
              className="shrink-0 rounded-control px-2 py-1.5 text-sm font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
            >
              View all
            </Link>
          </div>

          {attentionItems.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <div className="mx-auto flex size-10 items-center justify-center rounded-control bg-success-soft text-success">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 12.5L10 17L18.5 7.5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="mt-3 font-medium text-ink">
                Nothing needs attention
              </p>

              <p className="mt-1 text-sm text-muted">
                No items are expired or expiring
                soon.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {attentionItems.map(
                ({ item, status }) => {
                  const display =
                    getStatusDisplay(status);

                  return (
                    <Link
                      key={item.id}
                      href={`/inventory/${item.id}/edit`}
                      className="group flex min-h-[4.5rem] items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
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
                        className={[
                          "inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-control px-2.5",
                          "text-[0.7rem] font-semibold",
                          display.labelClasses,
                        ].join(" ")}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${display.dotClasses}`}
                        />

                        {display.label}
                      </span>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold tracking-[-0.015em] text-ink">
                Recently added
              </h2>

              <p className="mt-1 text-sm text-muted">
                Your latest inventory items.
              </p>
            </div>

            <Link
              href="/inventory"
              className="shrink-0 rounded-control px-2 py-1.5 text-sm font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
            >
              View all
            </Link>
          </div>

          {recentItems.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <p className="font-medium text-ink">
                No items yet
              </p>

              <p className="mt-1 text-sm text-muted">
                Add your first item to begin
                tracking your kitchen.
              </p>

              <Link
                href="/inventory/new"
                className="mt-4 inline-flex min-h-10 items-center rounded-control bg-accent px-3.5 text-sm font-medium text-accent-foreground shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-accent-hover"
              >
                Add item
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {recentItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/inventory/${item.id}/edit`}
                  className="group flex min-h-[4.5rem] items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {item.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted">
                      {formatLabel(
                        item.storageLocation
                      )}
                      {" · "}
                      {formatLabel(item.category)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-muted">
                    {item.quantity}{" "}
                    {formatLabel(item.unit)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

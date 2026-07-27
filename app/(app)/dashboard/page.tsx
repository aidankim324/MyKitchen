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

  return {
    label: "Fresh",
    classes: "bg-green-100 text-green-700",
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
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const items = await getKitchenItemsForUser(userId);
  const today = formatUtcDateOnly();
  const now = new Date(`${today}T00:00:00.000Z`);

  const fridgeCount = items.filter(
    (item) => item.storageLocation === "fridge"
  ).length;

  const freezerCount = items.filter(
    (item) => item.storageLocation === "freezer"
  ).length;

  const pantryCount = items.filter(
    (item) => item.storageLocation === "pantry"
  ).length;

  const itemsWithStatuses = items.map((item) => ({
    item,
    status: getExpirationStatus(
      item.expirationDate,
      now
    ),
  }));

  const expiredCount = itemsWithStatuses.filter(
    ({ status }) => status === "expired"
  ).length;

  const expiringSoonCount = itemsWithStatuses.filter(
    ({ status }) => status === "expiring_soon"
  ).length;

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
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
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
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            An overview of what is currently in your
            kitchen.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/inventory"
            className="rounded-xl border bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            View inventory
          </Link>

          <Link
            href="/inventory/new"
            className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
          >
            Add item
          </Link>
        </div>
      </div>

      <section
        aria-label="Inventory summary"
        className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {metric.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Expired
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-red-700">
            {expiredCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Expiring soon
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-amber-700">
            {expiringSoonCount}
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Needs attention
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Expired or expiring soon
              </p>
            </div>

            <Link
              href="/inventory"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              View all
            </Link>
          </div>

          {attentionItems.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-medium">
                Nothing needs attention
              </p>

              <p className="mt-1 text-sm text-gray-500">
                No items are expired or expiring soon.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {attentionItems.map(({ item, status }) => {
                const display =
                  getStatusDisplay(status);

                return (
                  <Link
                    key={item.id}
                    href={`/inventory/${item.id}/edit`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.expirationDate
                          ? `Expires ${formatDate(
                              item.expirationDate
                            )}`
                          : "No expiration date"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${display.classes}`}
                    >
                      {display.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Recently added
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Your latest inventory items
              </p>
            </div>

            <Link
              href="/inventory"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              View all
            </Link>
          </div>

          {recentItems.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-medium">
                No items yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first item to begin tracking
                your kitchen.
              </p>

              <Link
                href="/inventory/new"
                className="mt-4 inline-flex rounded-lg bg-black px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Add item
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/inventory/${item.id}/edit`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatLabel(
                        item.storageLocation
                      )}
                      {" · "}
                      {formatLabel(item.category)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm text-gray-500">
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

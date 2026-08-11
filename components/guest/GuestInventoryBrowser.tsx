"use client";

import { useMemo, useState } from "react";
import { InventoryList } from "@/components/inventory/InventoryList";
import { getExpirationStatus } from "@/lib/dates";
import type {
  InventoryFiltersState,
  InventorySort,
  KitchenItem,
  StorageLocationFilter,
} from "@/types/inventory";
import { DEFAULT_INVENTORY_FILTERS } from "@/types/inventory";
import {
  ITEM_CATEGORIES,
  STORAGE_LOCATIONS,
} from "@/validations/item";

type GuestInventoryBrowserProps = {
  items: KitchenItem[];
  today: string;
};

const LOCATION_TABS: StorageLocationFilter[] = [
  "all",
  ...STORAGE_LOCATIONS,
];

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

function compareExpirationDates(
  first: KitchenItem,
  second: KitchenItem
) {
  if (
    !first.expirationDate &&
    !second.expirationDate
  ) {
    return first.name.localeCompare(
      second.name
    );
  }

  if (!first.expirationDate) {
    return 1;
  }

  if (!second.expirationDate) {
    return -1;
  }

  const difference =
    first.expirationDate.localeCompare(
      second.expirationDate
    );

  if (difference !== 0) {
    return difference;
  }

  return first.name.localeCompare(
    second.name
  );
}

function sortItems(
  items: KitchenItem[],
  sortBy: InventorySort
) {
  const sorted = [...items];

  if (sortBy === "name") {
    sorted.sort((first, second) =>
      first.name.localeCompare(second.name)
    );
  }

  if (sortBy === "date_bought") {
    sorted.sort((first, second) =>
      second.dateBought.localeCompare(
        first.dateBought
      )
    );
  }

  if (sortBy === "expiration_date") {
    sorted.sort(compareExpirationDates);
  }

  if (sortBy === "storage_location") {
    sorted.sort((first, second) => {
      const locationDifference =
        STORAGE_LOCATIONS.indexOf(
          first.storageLocation
        ) -
        STORAGE_LOCATIONS.indexOf(
          second.storageLocation
        );

      if (locationDifference !== 0) {
        return locationDifference;
      }

      return first.name.localeCompare(
        second.name
      );
    });
  }

  if (sortBy === "recently_added") {
    sorted.sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
    );
  }

  return sorted;
}

function filterItems(
  items: KitchenItem[],
  filters: InventoryFiltersState,
  now: Date
) {
  const search = filters.search
    .trim()
    .toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.name
        .toLowerCase()
        .includes(search);

    const matchesLocation =
      filters.storageLocation === "all" ||
      item.storageLocation ===
        filters.storageLocation;

    const matchesCategory =
      filters.category === "all" ||
      item.category === filters.category;

    const status = getExpirationStatus(
      item.expirationDate,
      now
    );

    const matchesExpiration =
      filters.expirationStatus === "all" ||
      status === filters.expirationStatus;

    const matchesOpened =
      filters.openedStatus === "all" ||
      (filters.openedStatus === "opened"
        ? item.openedDate !== null
        : item.openedDate === null);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesExpiration &&
      matchesOpened
    );
  });
}

const selectClasses = [
  "min-h-10 rounded-control border border-line bg-surface",
  "px-3 text-sm text-ink shadow-soft outline-none",
  "transition-colors duration-[var(--duration-fast)] ease-standard",
  "hover:border-line-strong",
  "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent-soft",
].join(" ");

export function GuestInventoryBrowser({
  items,
  today,
}: GuestInventoryBrowserProps) {
  const [filters, setFilters] =
    useState<InventoryFiltersState>(
      DEFAULT_INVENTORY_FILTERS
    );

  const [showFilters, setShowFilters] =
    useState(false);

  const now = useMemo(
    () =>
      new Date(`${today}T00:00:00.000Z`),
    [today]
  );

  const visibleItems = useMemo(
    () =>
      sortItems(
        filterItems(items, filters, now),
        filters.sortBy
      ),
    [items, filters, now]
  );

  const locationCounts = useMemo<
    Record<StorageLocationFilter, number>
  >(
    () => ({
      all: items.length,
      fridge: items.filter(
        (item) =>
          item.storageLocation === "fridge"
      ).length,
      freezer: items.filter(
        (item) =>
          item.storageLocation === "freezer"
      ).length,
      pantry: items.filter(
        (item) =>
          item.storageLocation === "pantry"
      ).length,
    }),
    [items]
  );

  function updateFilters(
    next: Partial<InventoryFiltersState>
  ) {
    setFilters((current) => ({
      ...current,
      ...next,
    }));
  }

  function resetFilters() {
    setFilters(DEFAULT_INVENTORY_FILTERS);
    setShowFilters(false);
  }

  const advancedFilterCount = [
    filters.category !== "all",
    filters.expirationStatus !== "all",
    filters.openedStatus !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.storageLocation !== "all" ||
    filters.category !== "all" ||
    filters.expirationStatus !== "all" ||
    filters.openedStatus !== "all" ||
    filters.sortBy !== "recently_added";

  return (
    <section
      aria-label="Guest inventory"
      className="space-y-5"
    >
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-max items-center gap-1 rounded-panel border border-line bg-surface p-1 shadow-soft">
          {LOCATION_TABS.map((location) => {
            const active =
              filters.storageLocation ===
              location;

            return (
              <button
                key={location}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  updateFilters({
                    storageLocation:
                      location,
                  })
                }
                className={[
                  "inline-flex min-h-10 items-center gap-2 rounded-control px-3.5 text-sm font-medium",
                  "transition-all duration-[var(--duration-standard)] ease-standard",
                  active
                    ? "bg-accent-soft text-accent-active shadow-sm"
                    : "text-muted hover:bg-surface-subtle hover:text-ink",
                ].join(" ")}
              >
                {formatLabel(location)}

                <span
                  className={[
                    "min-w-5 rounded-md px-1.5 py-0.5 text-center text-[0.68rem] font-semibold",
                    active
                      ? "bg-surface text-accent"
                      : "bg-surface-subtle text-muted-light",
                  ].join(" ")}
                >
                  {locationCounts[location]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-card border border-line bg-surface p-3 shadow-soft sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <label
              htmlFor="guest-search"
              className="sr-only"
            >
              Search sample inventory
            </label>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-4.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M16 16L20 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              id="guest-search"
              type="search"
              value={filters.search}
              onChange={(event) =>
                updateFilters({
                  search:
                    event.target.value,
                })
              }
              placeholder="Search your kitchen"
              className="min-h-11 w-full rounded-control border border-line bg-canvas pl-10 pr-4 text-sm text-ink outline-none transition-all duration-[var(--duration-fast)] ease-standard placeholder:text-muted-light hover:border-line-strong focus:border-accent focus:bg-surface focus:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-soft"
            />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex">
            <label
              htmlFor="guest-sort"
              className="sr-only"
            >
              Sort sample inventory
            </label>

            <select
              id="guest-sort"
              value={filters.sortBy}
              onChange={(event) =>
                updateFilters({
                  sortBy:
                    event.target
                      .value as InventorySort,
                })
              }
              className={`${selectClasses} min-w-0 sm:min-w-44`}
            >
              <option value="recently_added">
                Recently added
              </option>
              <option value="storage_location">
                Storage area
              </option>
              <option value="date_bought">
                Date bought
              </option>
              <option value="expiration_date">
                Expiration date
              </option>
              <option value="name">
                Name
              </option>
            </select>

            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={[
                "inline-flex min-h-10 items-center justify-center gap-2 rounded-control",
                "border px-3.5 text-sm font-medium shadow-soft outline-none",
                "transition-all duration-[var(--duration-fast)] ease-standard",
                showFilters ||
                advancedFilterCount > 0
                  ? "border-accent/30 bg-accent-soft text-accent-active"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:bg-surface-subtle hover:text-ink",
              ].join(" ")}
            >
              Filters

              {advancedFilterCount > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-md bg-accent text-[0.68rem] font-semibold text-accent-foreground">
                  {advancedFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="guest-category"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Category
              </label>

              <select
                id="guest-category"
                value={filters.category}
                onChange={(event) =>
                  updateFilters({
                    category:
                      event.target
                        .value as InventoryFiltersState["category"],
                  })
                }
                className={`${selectClasses} w-full`}
              >
                <option value="all">
                  All categories
                </option>

                {ITEM_CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {formatLabel(category)}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="guest-expiration"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Expiration
              </label>

              <select
                id="guest-expiration"
                value={
                  filters.expirationStatus
                }
                onChange={(event) =>
                  updateFilters({
                    expirationStatus:
                      event.target
                        .value as InventoryFiltersState["expirationStatus"],
                  })
                }
                className={`${selectClasses} w-full`}
              >
                <option value="all">
                  All statuses
                </option>
                <option value="expired">
                  Expired
                </option>
                <option value="expiring_soon">
                  Expiring soon
                </option>
                <option value="fresh">
                  Fresh
                </option>
                <option value="no_date">
                  No expiration
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="guest-opened"
                className="mb-1.5 block text-xs font-semibold text-muted"
              >
                Opened status
              </label>

              <select
                id="guest-opened"
                value={filters.openedStatus}
                onChange={(event) =>
                  updateFilters({
                    openedStatus:
                      event.target
                        .value as InventoryFiltersState["openedStatus"],
                  })
                }
                className={`${selectClasses} w-full`}
              >
                <option value="all">
                  All items
                </option>
                <option value="opened">
                  Opened
                </option>
                <option value="unopened">
                  Unopened
                </option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-8 items-center justify-between gap-4">
        <p
          aria-live="polite"
          className="text-xs font-medium text-muted"
        >
          Showing {visibleItems.length} of{" "}
          {items.length} sample items
        </p>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-control px-2.5 py-1.5 text-xs font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
          >
            Reset
          </button>
        ) : null}
      </div>

      <InventoryList
        items={visibleItems}
        today={today}
        readOnly
        emptyTitle="No sample items found"
        emptyDescription="Try changing your search or filters."
      />
    </section>
  );
}

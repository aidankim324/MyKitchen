"use client";

import { useMemo, useState } from "react";
import { InventoryList } from "@/components/inventory/InventoryList";
import { getExpirationStatus } from "@/lib/dates";
import type {
  CategoryFilter,
  ExpirationStatusFilter,
  InventoryFiltersState,
  InventorySort,
  KitchenItem,
  OpenedStatusFilter,
  StorageLocationFilter,
} from "@/types/inventory";
import { DEFAULT_INVENTORY_FILTERS } from "@/types/inventory";
import {
  ITEM_CATEGORIES,
  STORAGE_LOCATIONS,
} from "@/validations/item";

type InventoryBrowserProps = {
  items: KitchenItem[];
  today: string;
};

const LOCATION_TABS: StorageLocationFilter[] = [
  "all",
  ...STORAGE_LOCATIONS,
];

const FILTER_PANEL_ID = "inventory-filter-panel";
const RESULTS_ID = "inventory-results";
const RESULTS_SUMMARY_ID =
  "inventory-results-summary";

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
    return 0;
  }

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
      search.length === 0 ||
      item.name.toLowerCase().includes(search);

    const matchesLocation =
      filters.storageLocation === "all" ||
      item.storageLocation ===
        filters.storageLocation;

    const matchesCategory =
      filters.category === "all" ||
      item.category === filters.category;

    const expirationStatus =
      getExpirationStatus(
        item.expirationDate,
        now
      );

    const matchesExpiration =
      filters.expirationStatus === "all" ||
      expirationStatus ===
        filters.expirationStatus;

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

const controlClasses = [
  "min-h-11 rounded-xl border border-gray-300 bg-white",
  "px-3.5 text-sm shadow-sm outline-none transition",
  "hover:border-gray-400",
  "focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100",
].join(" ");

export function InventoryBrowser({
  items,
  today,
}: InventoryBrowserProps) {
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
    nextFilters: Partial<InventoryFiltersState>
  ) {
    setFilters((current) => ({
      ...current,
      ...nextFilters,
    }));
  }

  function clearFilters() {
    setFilters(DEFAULT_INVENTORY_FILTERS);
    setShowFilters(false);
  }

  const advancedFilterCount = [
    filters.category !== "all",
    filters.expirationStatus !== "all",
    filters.openedStatus !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters =
    filters.search !== "" ||
    filters.storageLocation !== "all" ||
    filters.category !== "all" ||
    filters.expirationStatus !== "all" ||
    filters.openedStatus !== "all" ||
    filters.sortBy !== "recently_added";

  return (
    <section
      aria-label="Inventory controls and results"
    >
      <div className="mb-5 overflow-x-auto border-b border-gray-200">
        <div
          role="group"
          aria-label="Filter inventory by storage location"
          className="flex min-w-max gap-1"
        >
          {LOCATION_TABS.map((location) => {
            const isActive =
              filters.storageLocation === location;

            return (
              <button
                key={location}
                type="button"
                aria-pressed={isActive}
                aria-controls={RESULTS_ID}
                onClick={() =>
                  updateFilters({
                    storageLocation: location,
                  })
                }
                className={[
                  "inline-flex min-h-11 items-center border-b-2 px-4 py-2",
                  "text-sm font-medium transition",
                  isActive
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:border-gray-300 hover:text-black",
                ].join(" ")}
              >
                {formatLabel(location)}

                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {locationCounts[location]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="inventory-search"
              className="sr-only"
            >
              Search inventory by item name
            </label>

            <input
              id="inventory-search"
              type="search"
              autoComplete="off"
              value={filters.search}
              aria-controls={RESULTS_ID}
              aria-describedby={
                RESULTS_SUMMARY_ID
              }
              onChange={(event) =>
                updateFilters({
                  search: event.target.value,
                })
              }
              className={`${controlClasses} w-full px-4`}
              placeholder="Search inventory"
            />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex">
            <label
              htmlFor="inventory-sort"
              className="sr-only"
            >
              Sort inventory
            </label>

            <select
              id="inventory-sort"
              value={filters.sortBy}
              aria-controls={RESULTS_ID}
              onChange={(event) =>
                updateFilters({
                  sortBy:
                    event.target
                      .value as InventorySort,
                })
              }
              className={`${controlClasses} min-w-0 sm:min-w-44`}
            >
              <option value="recently_added">
                Recently added
              </option>
              <option value="date_bought">
                Date bought
              </option>
              <option value="expiration_date">
                Expiration date
              </option>
              <option value="name">Name</option>
            </select>

            <button
              type="button"
              aria-expanded={showFilters}
              aria-controls={FILTER_PANEL_ID}
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={`${controlClasses} whitespace-nowrap font-medium`}
            >
              Filters
              {advancedFilterCount > 0
                ? ` (${advancedFilterCount})`
                : ""}
            </button>
          </div>
        </div>

        {showFilters ? (
          <div
            id={FILTER_PANEL_ID}
            aria-label="Additional inventory filters"
            className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3"
          >
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium"
              >
                Category
              </label>

              <select
                id="category-filter"
                value={filters.category}
                aria-controls={RESULTS_ID}
                onChange={(event) =>
                  updateFilters({
                    category:
                      event.target
                        .value as CategoryFilter,
                  })
                }
                className={`${controlClasses} mt-1.5 w-full`}
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
                htmlFor="expiration-filter"
                className="block text-sm font-medium"
              >
                Expiration
              </label>

              <select
                id="expiration-filter"
                value={
                  filters.expirationStatus
                }
                aria-controls={RESULTS_ID}
                onChange={(event) =>
                  updateFilters({
                    expirationStatus:
                      event.target
                        .value as ExpirationStatusFilter,
                  })
                }
                className={`${controlClasses} mt-1.5 w-full`}
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
                htmlFor="opened-filter"
                className="block text-sm font-medium"
              >
                Opened status
              </label>

              <select
                id="opened-filter"
                value={filters.openedStatus}
                aria-controls={RESULTS_ID}
                onChange={(event) =>
                  updateFilters({
                    openedStatus:
                      event.target
                        .value as OpenedStatusFilter,
                  })
                }
                className={`${controlClasses} mt-1.5 w-full`}
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

        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p
            id={RESULTS_SUMMARY_ID}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-gray-600"
          >
            Showing {visibleItems.length} of{" "}
            {items.length} items
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div id={RESULTS_ID}>
        <InventoryList
          items={visibleItems}
          today={today}
          emptyTitle={
            items.length === 0
              ? "Your kitchen is empty"
              : "No matching items"
          }
          emptyDescription={
            items.length === 0
              ? "Add your first item to begin tracking your kitchen."
              : "Try changing or clearing your search and filters."
          }
        />
      </div>
    </section>
  );
}

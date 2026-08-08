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

type ActiveFilterChipProps = {
  label: string;
  onRemove: () => void;
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

function ActiveFilterChip({
  label,
  onRemove,
}: ActiveFilterChipProps) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1 rounded-control border border-line bg-surface px-2.5 text-xs font-medium text-muted shadow-soft">
      {label}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex size-6 items-center justify-center rounded-md text-muted-light transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}

const selectClasses = [
  "min-h-10 rounded-control border border-line bg-surface",
  "px-3 text-sm text-ink shadow-soft outline-none",
  "transition-colors duration-[var(--duration-fast)] ease-standard",
  "hover:border-line-strong",
  "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent-soft",
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
    filters.search.trim() !== "" ||
    filters.storageLocation !== "all" ||
    filters.category !== "all" ||
    filters.expirationStatus !== "all" ||
    filters.openedStatus !== "all" ||
    filters.sortBy !== "recently_added";

  const hasFilterChips =
    filters.search.trim() !== "" ||
    filters.category !== "all" ||
    filters.expirationStatus !== "all" ||
    filters.openedStatus !== "all";

  return (
    <section
      aria-label="Inventory controls and results"
      className="space-y-5"
    >
      <div className="overflow-x-auto">
        <div
          role="group"
          aria-label="Filter inventory by storage location"
          className="inline-flex min-w-max items-center gap-1 rounded-panel border border-line bg-surface p-1 shadow-soft"
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
                  "relative inline-flex min-h-10 items-center gap-2 rounded-control px-3.5",
                  "text-sm font-medium transition-all duration-[var(--duration-standard)] ease-standard",
                  isActive
                    ? "bg-accent-soft text-accent-active shadow-sm"
                    : "text-muted hover:bg-surface-subtle hover:text-ink",
                ].join(" ")}
              >
                {formatLabel(location)}

                <span
                  className={[
                    "min-w-5 rounded-md px-1.5 py-0.5 text-center text-[0.68rem] font-semibold",
                    isActive
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
              htmlFor="inventory-search"
              className="sr-only"
            >
              Search inventory by item name
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
              className={[
                "min-h-11 w-full rounded-control border border-line bg-canvas",
                "pl-10 pr-4 text-sm text-ink outline-none",
                "transition-all duration-[var(--duration-fast)] ease-standard",
                "placeholder:text-muted-light",
                "hover:border-line-strong",
                "focus:border-accent focus:bg-surface focus:shadow-soft",
                "focus-visible:ring-2 focus-visible:ring-accent-soft",
              ].join(" ")}
              placeholder="Search your kitchen"
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
              className={`${selectClasses} min-w-0 sm:min-w-44`}
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
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M7 12H17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10 17H14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

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
          <div
            id={FILTER_PANEL_ID}
            aria-label="Additional inventory filters"
            className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-3"
          >
            <div>
              <label
                htmlFor="category-filter"
                className="block text-xs font-semibold uppercase tracking-[0.1em] text-muted"
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
                className={`${selectClasses} mt-2 w-full`}
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
                className="block text-xs font-semibold uppercase tracking-[0.1em] text-muted"
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
                className={`${selectClasses} mt-2 w-full`}
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
                className="block text-xs font-semibold uppercase tracking-[0.1em] text-muted"
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
                className={`${selectClasses} mt-2 w-full`}
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

      <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p
            id={RESULTS_SUMMARY_ID}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mr-1 text-sm text-muted"
          >
            Showing {visibleItems.length} of{" "}
            {items.length}
          </p>

          {hasFilterChips ? (
            <div
              aria-label="Active inventory filters"
              className="flex flex-wrap gap-2"
            >
              {filters.search.trim() !== "" ? (
                <ActiveFilterChip
                  label={`Search: ${filters.search.trim()}`}
                  onRemove={() =>
                    updateFilters({
                      search: "",
                    })
                  }
                />
              ) : null}

              {filters.category !== "all" ? (
                <ActiveFilterChip
                  label={formatLabel(
                    filters.category
                  )}
                  onRemove={() =>
                    updateFilters({
                      category: "all",
                    })
                  }
                />
              ) : null}

              {filters.expirationStatus !==
              "all" ? (
                <ActiveFilterChip
                  label={formatLabel(
                    filters.expirationStatus
                  )}
                  onRemove={() =>
                    updateFilters({
                      expirationStatus: "all",
                    })
                  }
                />
              ) : null}

              {filters.openedStatus !== "all" ? (
                <ActiveFilterChip
                  label={formatLabel(
                    filters.openedStatus
                  )}
                  onRemove={() =>
                    updateFilters({
                      openedStatus: "all",
                    })
                  }
                />
              ) : null}
            </div>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-9 items-center rounded-control px-3 text-sm font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink"
          >
            Reset all
          </button>
        ) : null}
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

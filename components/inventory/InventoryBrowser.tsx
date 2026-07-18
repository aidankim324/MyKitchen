"use client";

import { useMemo, useState } from "react";
import { getExpirationStatus } from "@/lib/dates";
import type {
  CategoryFilter,
  ExpirationStatusFilter,
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
import { InventoryList } from "@/components/inventory/InventoryList";

type InventoryBrowserProps = {
  items: KitchenItem[];
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function compareExpirationDates(a: KitchenItem, b: KitchenItem) {
  if (!a.expirationDate && !b.expirationDate) return 0;
  if (!a.expirationDate) return 1;
  if (!b.expirationDate) return -1;

  return a.expirationDate.localeCompare(b.expirationDate);
}

function sortItems(items: KitchenItem[], sortBy: InventorySort) {
  const sorted = [...items];

  if (sortBy === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy === "expiration_date") {
    sorted.sort(compareExpirationDates);
  }

  if (sortBy === "recently_added") {
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return sorted;
}

function filterItems(items: KitchenItem[], filters: InventoryFiltersState) {
  const search = filters.search.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      search.length === 0 || item.name.toLowerCase().includes(search);

    const matchesLocation =
      filters.storageLocation === "all" ||
      item.storageLocation === filters.storageLocation;

    const matchesCategory =
      filters.category === "all" || item.category === filters.category;

    const itemExpirationStatus = getExpirationStatus(item.expirationDate);
    const matchesExpirationStatus =
      filters.expirationStatus === "all" ||
      itemExpirationStatus === filters.expirationStatus;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesExpirationStatus
    );
  });
}

export function InventoryBrowser({ items }: InventoryBrowserProps) {
  const [filters, setFilters] = useState<InventoryFiltersState>(
    DEFAULT_INVENTORY_FILTERS
  );

  const visibleItems = useMemo(() => {
    return sortItems(filterItems(items, filters), filters.sortBy);
  }, [items, filters]);

  function updateFilters(nextFilters: Partial<InventoryFiltersState>) {
    setFilters((current) => ({
      ...current,
      ...nextFilters,
    }));
  }

  function clearFilters() {
    setFilters(DEFAULT_INVENTORY_FILTERS);
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.storageLocation !== "all" ||
    filters.category !== "all" ||
    filters.expirationStatus !== "all" ||
    filters.sortBy !== "recently_added";

  return (
    <section>
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium">
              Search
            </label>
            <input
              id="search"
              value={filters.search}
              onChange={(event) =>
                updateFilters({
                  search: event.target.value,
                })
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Search by item name"
            />
          </div>

          <div>
            <label htmlFor="storageLocation" className="block text-sm font-medium">
              Location
            </label>
            <select
              id="storageLocation"
              value={filters.storageLocation}
              onChange={(event) =>
                updateFilters({
                  storageLocation: event.target.value as StorageLocationFilter,
                })
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All locations</option>
              {STORAGE_LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {formatLabel(location)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(event) =>
                updateFilters({
                  category: event.target.value as CategoryFilter,
                })
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All categories</option>
              {ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {formatLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="expirationStatus"
              className="block text-sm font-medium"
            >
              Expiration
            </label>
            <select
              id="expirationStatus"
              value={filters.expirationStatus}
              onChange={(event) =>
                updateFilters({
                  expirationStatus: event.target.value as ExpirationStatusFilter,
                })
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="expired">Expired</option>
              <option value="expiring_soon">Expiring soon</option>
              <option value="fresh">Fresh</option>
              <option value="no_date">No date</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium">
              Sort by
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(event) =>
                updateFilters({
                  sortBy: event.target.value as InventorySort,
                })
              }
              className="mt-1 rounded-md border px-3 py-2 text-sm"
            >
              <option value="recently_added">Recently added</option>
              <option value="expiration_date">Expiration date</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600">
              Showing {visibleItems.length} of {items.length} items
            </p>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-md border px-3 py-2 text-sm font-medium"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <InventoryList items={visibleItems} />
    </section>
  );
}

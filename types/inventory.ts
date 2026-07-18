import type {
  ITEM_CATEGORIES,
  STORAGE_LOCATIONS,
  UNITS,
} from "@/validations/item";

export type StorageLocation = (typeof STORAGE_LOCATIONS)[number];

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export type Unit = (typeof UNITS)[number];

export type ExpirationStatus =
  | "expired"
  | "expiring_soon"
  | "fresh"
  | "no_date";

export type KitchenItem = {
  id: string;
  name: string;
  category: ItemCategory;
  storageLocation: StorageLocation;
  quantity: number;
  unit: Unit;
  expirationDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StorageLocationFilter = "all" | StorageLocation;

export type CategoryFilter = "all" | ItemCategory;

export type ExpirationStatusFilter = "all" | ExpirationStatus;

export type InventorySort = "expiration_date" | "name" | "recently_added";

export type InventoryFiltersState = {
  search: string;
  storageLocation: StorageLocationFilter;
  category: CategoryFilter;
  expirationStatus: ExpirationStatusFilter;
  sortBy: InventorySort;
};

export const DEFAULT_INVENTORY_FILTERS: InventoryFiltersState = {
  search: "",
  storageLocation: "all",
  category: "all",
  expirationStatus: "all",
  sortBy: "recently_added",
};

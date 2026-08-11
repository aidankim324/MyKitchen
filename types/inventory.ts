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
  dateBought: string;
  openedDate: string | null;
  expirationDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StorageLocationFilter = "all" | StorageLocation;

export type CategoryFilter = "all" | ItemCategory;

export type ExpirationStatusFilter = "all" | ExpirationStatus;

export type OpenedStatusFilter = "all" | "opened" | "unopened";

export type InventorySort =
  | "recently_added"
  | "date_bought"
  | "expiration_date"
  | "name" | "storage_location";

export type InventoryFiltersState = {
  search: string;
  storageLocation: StorageLocationFilter;
  category: CategoryFilter;
  expirationStatus: ExpirationStatusFilter;
  openedStatus: OpenedStatusFilter;
  sortBy: InventorySort;
};

export const DEFAULT_INVENTORY_FILTERS: InventoryFiltersState = {
  search: "",
  storageLocation: "all",
  category: "all",
  expirationStatus: "all",
  openedStatus: "all",
  sortBy: "recently_added",
};
import { z } from "zod";

export const STORAGE_LOCATIONS = ["fridge", "freezer", "pantry"] as const;

export const ITEM_CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "seafood",
  "frozen",
  "grains",
  "canned_goods",
  "snacks",
  "beverages",
  "condiments",
  "spices",
  "baking",
  "household",
  "leftovers",
  "other",
] as const;

export const UNITS = [
  "count",
  "oz",
  "lb",
  "g",
  "kg",
  "ml",
  "l",
  "cup",
  "tbsp",
  "tsp",
  "pint",
  "quart",
  "gallon",
  "package",
  "can",
  "bottle",
  "box",
  "bag",
  "jar",
] as const;

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY_REGEX.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function emptyStringToNull(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

const dateOnlySchema = z
  .string()
  .regex(DATE_ONLY_REGEX, "Use YYYY-MM-DD format.")
  .refine(isValidDateOnly, "Invalid calendar date.");

export const createKitchenItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),

  category: z.enum(ITEM_CATEGORIES, {
    message: "Category is required.",
  }),

  storageLocation: z.enum(STORAGE_LOCATIONS, {
    message: "Storage location must be fridge, freezer, or pantry.",
  }),

  quantity: z
    .number({
      message: "Quantity is required.",
    })
    .finite("Quantity must be a valid number.")
    .min(0, "Quantity cannot be negative."),

  unit: z.enum(UNITS, {
  message: "Unit is required.",
}),

dateBought: dateOnlySchema,

openedDate: z.preprocess(
  emptyStringToNull,
  dateOnlySchema.nullable().optional()
),

expirationDate: z.preprocess(
  emptyStringToNull,
  dateOnlySchema.nullable().optional()
),

  notes: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .trim()
      .max(1000, "Notes must be 1000 characters or fewer.")
      .nullable()
      .optional()
  ),
});

export const updateKitchenItemSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(100, "Name must be 100 characters or fewer.")
      .optional(),

    category: z.enum(ITEM_CATEGORIES).optional(),

    storageLocation: z.enum(STORAGE_LOCATIONS).optional(),

    quantity: z
      .number()
      .finite("Quantity must be a valid number.")
      .min(0, "Quantity cannot be negative.")
      .optional(),

    unit: z.enum(UNITS).optional(),

dateBought: dateOnlySchema.optional(),

openedDate: z.preprocess(
  emptyStringToNull,
  dateOnlySchema.nullable().optional()
),

expirationDate: z.preprocess(
  emptyStringToNull,
  dateOnlySchema.nullable().optional()
),

    notes: z.preprocess(
      emptyStringToNull,
      z
        .string()
        .trim()
        .max(1000, "Notes must be 1000 characters or fewer.")
        .nullable()
        .optional()
    ),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const kitchenItemFormSchema = createKitchenItemSchema.extend({
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .finite("Quantity must be a valid number.")
        .min(0, "Quantity cannot be negative.")
    ),
});

export type CreateKitchenItemInput = z.infer<typeof createKitchenItemSchema>;
export type UpdateKitchenItemInput = z.infer<typeof updateKitchenItemSchema>;
export type KitchenItemFormInput = z.infer<typeof kitchenItemFormSchema>;

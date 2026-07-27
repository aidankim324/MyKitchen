"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestedItemImage } from "@/lib/item-images";
import type { KitchenItem } from "@/types/inventory";
import {
  ITEM_CATEGORIES,
  STORAGE_LOCATIONS,
  UNITS,
  kitchenItemFormSchema,
} from "@/validations/item";

type FieldErrors = Record<string, string[] | undefined>;

type ItemFormProps =
  | {
      mode: "create";
      initialItem?: never;
    }
  | {
      mode: "edit";
      initialItem: KitchenItem;
    };

type FormValues = {
  name: string;
  category: string;
  storageLocation: string;
  quantity: string;
  unit: string;
  dateBought: string;
  openedDate: string;
  expirationDate: string;
  notes: string;
};

function getTodayDateOnly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}

function getFirstError(
  fieldErrors: FieldErrors,
  field: string
) {
  return fieldErrors[field]?.[0] ?? null;
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    produce: "🥬",
    dairy: "🥛",
    meat: "🥩",
    seafood: "🐟",
    frozen: "❄️",
    grains: "🌾",
    canned_goods: "🥫",
    snacks: "🍿",
    beverages: "🥤",
    condiments: "🫙",
    spices: "🌶️",
    baking: "🧁",
    household: "🧻",
    leftovers: "🍱",
    other: "🍽️",
  };

  return icons[category] ?? "🍽️";
}

function getInputClasses(hasError: boolean) {
  return [
    "mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm",
    "shadow-sm outline-none transition",
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-100",
  ].join(" ");
}

function FieldError({
  fieldErrors,
  field,
}: {
  fieldErrors: FieldErrors;
  field: string;
}) {
  const error = getFirstError(fieldErrors, field);

  if (!error) {
    return null;
  }

  return (
    <p
      id={`${field}-error`}
      className="mt-1.5 text-sm text-red-600"
    >
      {error}
    </p>
  );
}

function validateDateOrder(
  values: FormValues
): FieldErrors {
  const errors: FieldErrors = {};

  if (
    values.openedDate &&
    values.dateBought &&
    values.openedDate < values.dateBought
  ) {
    errors.openedDate = [
      "Opened date cannot be before the date bought.",
    ];
  }

  if (
    values.expirationDate &&
    values.dateBought &&
    values.expirationDate < values.dateBought
  ) {
    errors.expirationDate = [
      "Expiration date cannot be before the date bought.",
    ];
  }

  return errors;
}

export function ItemForm({
  mode,
  initialItem,
}: ItemFormProps) {
  const router = useRouter();

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [formError, setFormError] = useState<
    string | null
  >(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formValues, setFormValues] =
    useState<FormValues>({
      name: initialItem?.name ?? "",
      category: initialItem?.category ?? "other",
      storageLocation:
        initialItem?.storageLocation ?? "fridge",
      quantity: initialItem
        ? String(initialItem.quantity)
        : "1",
      unit: initialItem?.unit ?? "count",
      dateBought:
        initialItem?.dateBought ?? getTodayDateOnly(),
      openedDate: initialItem?.openedDate ?? "",
      expirationDate:
        initialItem?.expirationDate ?? "",
      notes: initialItem?.notes ?? "",
    });

  const suggestedImage = useMemo(
    () => getSuggestedItemImage(formValues.name),
    [formValues.name]
  );

  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];

      return nextErrors;
    });

    setFormError(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFieldErrors({});
    setFormError(null);

    const parsed =
      kitchenItemFormSchema.safeParse(formValues);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      setFieldErrors(flattened.fieldErrors);
      setFormError(
        flattened.formErrors[0] ?? null
      );

      return;
    }

    const dateErrors = validateDateOrder(formValues);

    if (Object.keys(dateErrors).length > 0) {
      setFieldErrors(dateErrors);
      setFormError(
        "Review the highlighted date fields."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/items"
          : `/api/items/${initialItem.id}`;

      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setFieldErrors(
          data?.error?.fieldErrors ?? {}
        );

        setFormError(
          data?.error?.message ??
            "Unable to save the item."
        );

        return;
      }

      router.push("/inventory");
      router.refresh();
    } catch (error) {
      console.error("Unable to save item:", error);

      setFormError(
        "Unable to save the item. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const nameError = Boolean(
    getFirstError(fieldErrors, "name")
  );

  const categoryError = Boolean(
    getFirstError(fieldErrors, "category")
  );

  const quantityError = Boolean(
    getFirstError(fieldErrors, "quantity")
  );

  const unitError = Boolean(
    getFirstError(fieldErrors, "unit")
  );

  const dateBoughtError = Boolean(
    getFirstError(fieldErrors, "dateBought")
  );

  const openedDateError = Boolean(
    getFirstError(fieldErrors, "openedDate")
  );

  const expirationDateError = Boolean(
    getFirstError(fieldErrors, "expirationDate")
  );

  const notesError = Boolean(
    getFirstError(fieldErrors, "notes")
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {formError ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">
            Item details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the name and category of the item.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium"
              >
                Item name{" "}
                <span
                  aria-hidden="true"
                  className="text-red-600"
                >
                  *
                </span>
              </label>

              <input
                id="name"
                name="name"
                value={formValues.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                aria-invalid={nameError}
                aria-describedby={
                  nameError
                    ? "name-error"
                    : "name-description"
                }
                className={getInputClasses(
                  nameError
                )}
                placeholder="Milk"
                autoFocus={mode === "create"}
              />

              <p
                id="name-description"
                className="mt-1.5 text-xs text-gray-500"
              >
                A matching generic image may be
                suggested automatically.
              </p>

              <FieldError
                fieldErrors={fieldErrors}
                field="name"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium"
              >
                Category{" "}
                <span
                  aria-hidden="true"
                  className="text-red-600"
                >
                  *
                </span>
              </label>

              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
                aria-invalid={categoryError}
                aria-describedby={
                  categoryError
                    ? "category-error"
                    : undefined
                }
                className={getInputClasses(
                  categoryError
                )}
              >
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

              <FieldError
                fieldErrors={fieldErrors}
                field="category"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium">
              Item preview
            </p>

            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border bg-gray-100">
              {suggestedImage ? (
                <Image
                  src={suggestedImage.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="220px"
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="text-6xl"
                >
                  {getCategoryIcon(
                    formValues.category
                  )}
                </span>
              )}
            </div>

            <p className="mt-2 text-center text-xs text-gray-500">
              {suggestedImage
                ? `Suggested image for ${suggestedImage.matchedName}`
                : "Category fallback preview"}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">
            Storage and quantity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose where the item is stored and how
            much you have.
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <fieldset>
            <legend className="text-sm font-medium">
              Storage location{" "}
              <span
                aria-hidden="true"
                className="text-red-600"
              >
                *
              </span>
            </legend>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {STORAGE_LOCATIONS.map(
                (location) => {
                  const isSelected =
                    formValues.storageLocation ===
                    location;

                  return (
                    <button
                      key={location}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        updateField(
                          "storageLocation",
                          location
                        )
                      }
                      className={[
                        "rounded-xl border px-4 py-3 text-left text-sm transition",
                        isSelected
                          ? "border-black bg-black font-medium text-white shadow-sm"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {formatLabel(location)}
                    </button>
                  );
                }
              )}
            </div>

            <FieldError
              fieldErrors={fieldErrors}
              field="storageLocation"
            />
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium"
              >
                Quantity{" "}
                <span
                  aria-hidden="true"
                  className="text-red-600"
                >
                  *
                </span>
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={formValues.quantity}
                onChange={(event) =>
                  updateField(
                    "quantity",
                    event.target.value
                  )
                }
                aria-invalid={quantityError}
                aria-describedby={
                  quantityError
                    ? "quantity-error"
                    : undefined
                }
                className={getInputClasses(
                  quantityError
                )}
              />

              <FieldError
                fieldErrors={fieldErrors}
                field="quantity"
              />
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium"
              >
                Unit{" "}
                <span
                  aria-hidden="true"
                  className="text-red-600"
                >
                  *
                </span>
              </label>

              <select
                id="unit"
                name="unit"
                value={formValues.unit}
                onChange={(event) =>
                  updateField(
                    "unit",
                    event.target.value
                  )
                }
                aria-invalid={unitError}
                aria-describedby={
                  unitError
                    ? "unit-error"
                    : undefined
                }
                className={getInputClasses(
                  unitError
                )}
              >
                {UNITS.map((unit) => (
                  <option
                    key={unit}
                    value={unit}
                  >
                    {formatLabel(unit)}
                  </option>
                ))}
              </select>

              <FieldError
                fieldErrors={fieldErrors}
                field="unit"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">
            Dates
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            The purchase date is required. Opened and
            expiration dates are optional.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="dateBought"
              className="block text-sm font-medium"
            >
              Date bought{" "}
              <span
                aria-hidden="true"
                className="text-red-600"
              >
                *
              </span>
            </label>

            <input
              id="dateBought"
              name="dateBought"
              type="date"
              value={formValues.dateBought}
              onChange={(event) =>
                updateField(
                  "dateBought",
                  event.target.value
                )
              }
              aria-invalid={dateBoughtError}
              aria-describedby={
                dateBoughtError
                  ? "dateBought-error"
                  : undefined
              }
              className={getInputClasses(
                dateBoughtError
              )}
            />

            <FieldError
              fieldErrors={fieldErrors}
              field="dateBought"
            />
          </div>

          <div>
            <label
              htmlFor="openedDate"
              className="block text-sm font-medium"
            >
              Opened date
              <span className="ml-1 font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              id="openedDate"
              name="openedDate"
              type="date"
              min={
                formValues.dateBought || undefined
              }
              value={formValues.openedDate}
              onChange={(event) =>
                updateField(
                  "openedDate",
                  event.target.value
                )
              }
              aria-invalid={openedDateError}
              aria-describedby={
                openedDateError
                  ? "openedDate-error"
                  : undefined
              }
              className={getInputClasses(
                openedDateError
              )}
            />

            <FieldError
              fieldErrors={fieldErrors}
              field="openedDate"
            />
          </div>

          <div>
            <label
              htmlFor="expirationDate"
              className="block text-sm font-medium"
            >
              Expiration date
              <span className="ml-1 font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              id="expirationDate"
              name="expirationDate"
              type="date"
              min={
                formValues.dateBought || undefined
              }
              value={formValues.expirationDate}
              onChange={(event) =>
                updateField(
                  "expirationDate",
                  event.target.value
                )
              }
              aria-invalid={
                expirationDateError
              }
              aria-describedby={
                expirationDateError
                  ? "expirationDate-error"
                  : undefined
              }
              className={getInputClasses(
                expirationDateError
              )}
            />

            <FieldError
              fieldErrors={fieldErrors}
              field="expirationDate"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">
            Notes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add brand information, preparation details,
            or anything else worth remembering.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <label
            htmlFor="notes"
            className="sr-only"
          >
            Notes
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={5}
            maxLength={1000}
            value={formValues.notes}
            onChange={(event) =>
              updateField(
                "notes",
                event.target.value
              )
            }
            aria-invalid={notesError}
            aria-describedby={
              notesError
                ? "notes-error"
                : "notes-description"
            }
            className={getInputClasses(
              notesError
            )}
            placeholder="Brand, package details, meal plans, or other notes"
          />

          <div className="mt-1.5 flex items-start justify-between gap-4">
            <div>
              <p
                id="notes-description"
                className="text-xs text-gray-500"
              >
                Maximum 1,000 characters.
              </p>

              <FieldError
                fieldErrors={fieldErrors}
                field="notes"
              />
            </div>

            <p className="shrink-0 text-xs text-gray-400">
              {formValues.notes.length}/1000
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/inventory"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting
            ? mode === "create"
              ? "Adding item..."
              : "Saving changes..."
            : mode === "create"
              ? "Add item"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getFirstError(fieldErrors: FieldErrors, field: string) {
  return fieldErrors[field]?.[0] ?? null;
}

export function ItemForm({ mode, initialItem }: ItemFormProps) {
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    name: initialItem?.name ?? "",
    category: initialItem?.category ?? "other",
    storageLocation: initialItem?.storageLocation ?? "fridge",
    quantity: initialItem ? String(initialItem.quantity) : "1",
    unit: initialItem?.unit ?? "count",
    expirationDate: initialItem?.expirationDate ?? "",
    notes: initialItem?.notes ?? "",
  });

  function updateField(field: keyof typeof formValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setFormError(null);

    const parsed = kitchenItemFormSchema.safeParse(formValues);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      setFieldErrors(flattened.fieldErrors);
      setFormError(flattened.formErrors[0] ?? null);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/items" : `/api/items/${initialItem.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.error?.fieldErrors ?? {});
        setFormError(data.error?.message ?? "Something went wrong.");
        return;
      }

      router.push("/inventory");
      router.refresh();
    } catch {
      setFormError("Unable to save item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Item name
        </label>
        <input
          id="name"
          name="name"
          value={formValues.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Milk"
        />
        {getFirstError(fieldErrors, "name") ? (
          <p className="mt-1 text-sm text-red-600">
            {getFirstError(fieldErrors, "name")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formValues.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            {ITEM_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {formatLabel(category)}
              </option>
            ))}
          </select>
          {getFirstError(fieldErrors, "category") ? (
            <p className="mt-1 text-sm text-red-600">
              {getFirstError(fieldErrors, "category")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="storageLocation"
            className="block text-sm font-medium"
          >
            Storage location
          </label>
          <select
            id="storageLocation"
            name="storageLocation"
            value={formValues.storageLocation}
            onChange={(event) =>
              updateField("storageLocation", event.target.value)
            }
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            {STORAGE_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {formatLabel(location)}
              </option>
            ))}
          </select>
          {getFirstError(fieldErrors, "storageLocation") ? (
            <p className="mt-1 text-sm text-red-600">
              {getFirstError(fieldErrors, "storageLocation")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            min="0"
            value={formValues.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {getFirstError(fieldErrors, "quantity") ? (
            <p className="mt-1 text-sm text-red-600">
              {getFirstError(fieldErrors, "quantity")}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={formValues.unit}
            onChange={(event) => updateField("unit", event.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {formatLabel(unit)}
              </option>
            ))}
          </select>
          {getFirstError(fieldErrors, "unit") ? (
            <p className="mt-1 text-sm text-red-600">
              {getFirstError(fieldErrors, "unit")}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium">
          Expiration date
        </label>
        <input
          id="expirationDate"
          name="expirationDate"
          type="date"
          value={formValues.expirationDate}
          onChange={(event) =>
            updateField("expirationDate", event.target.value)
          }
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        {getFirstError(fieldErrors, "expirationDate") ? (
          <p className="mt-1 text-sm text-red-600">
            {getFirstError(fieldErrors, "expirationDate")}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formValues.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className="mt-1 min-h-24 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Opened, half used, bought from Costco, etc."
        />
        {getFirstError(fieldErrors, "notes") ? (
          <p className="mt-1 text-sm text-red-600">
            {getFirstError(fieldErrors, "notes")}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Add item"
              : "Save changes"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/inventory")}
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

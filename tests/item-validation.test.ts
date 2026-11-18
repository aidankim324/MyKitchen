import { describe, expect, it } from "vitest";
import {
  kitchenItemFormSchema,
  updateKitchenItemSchema,
} from "@/validations/item";

function createValidFormValues() {
  return {
    name: "Milk",
    category: "dairy",
    storageLocation: "fridge",
    quantity: "1",
    unit: "gallon",
    dateBought: "2026-07-27",
    openedDate: "",
    expirationDate: "",
    notes: "",
  };
}

describe("kitchenItemFormSchema", () => {
  it("accepts a valid inventory item", () => {
    const result = kitchenItemFormSchema.safeParse(
      createValidFormValues()
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Milk");
      expect(result.data.quantity).toBe(1);
      expect(result.data.openedDate).toBeNull();
      expect(result.data.expirationDate).toBeNull();
    }
  });

  it("rejects an empty item name", () => {
    const result = kitchenItemFormSchema.safeParse({
      ...createValidFormValues(),
      name: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.name
      ).toBeDefined();
    }
  });

  it("rejects a negative quantity", () => {
    const result = kitchenItemFormSchema.safeParse({
      ...createValidFormValues(),
      quantity: "-1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.quantity
      ).toBeDefined();
    }
  });

  it("accepts decimal quantities", () => {
    const result = kitchenItemFormSchema.safeParse({
      ...createValidFormValues(),
      quantity: "1.5",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.quantity).toBe(1.5);
    }
  });

  it("accepts optional opened and expiration dates", () => {
    const result = kitchenItemFormSchema.safeParse({
      ...createValidFormValues(),
      openedDate: "2026-07-28",
      expirationDate: "2026-08-03",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.openedDate).toBe(
        "2026-07-28"
      );

      expect(result.data.expirationDate).toBe(
        "2026-08-03"
      );
    }
  });

  it("rejects an invalid purchase-date format", () => {
    const result = kitchenItemFormSchema.safeParse({
      ...createValidFormValues(),
      dateBought: "07/27/2026",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.dateBought
      ).toBeDefined();
    }
  });
});

describe("updateKitchenItemSchema quantityChange", () => {
  it("accepts positive and negative adjustments", () => {
    expect(
      updateKitchenItemSchema.safeParse({ quantityChange: 1 }).success
    ).toBe(true);

    expect(
      updateKitchenItemSchema.safeParse({ quantityChange: -0.5 }).success
    ).toBe(true);
  });

  it.each([0, Number.NaN, Number.POSITIVE_INFINITY, "1"])(
    "rejects %s",
    (quantityChange) => {
      const result = updateKitchenItemSchema.safeParse({ quantityChange });

      expect(result.success).toBe(false);
    }
  );

  it("cannot be combined with other fields", () => {
    const result = updateKitchenItemSchema.safeParse({
      quantityChange: 1,
      quantity: 5,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.quantityChange
      ).toEqual([
        "Quantity change cannot be combined with other fields.",
      ]);
    }
  });

  it("still rejects a negative absolute quantity", () => {
    expect(
      updateKitchenItemSchema.safeParse({ quantity: -1 }).success
    ).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { kitchenItemFormSchema } from "@/validations/item";

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

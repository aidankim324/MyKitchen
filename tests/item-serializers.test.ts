import { describe, expect, it } from "vitest";
import type {
  KitchenItem as PrismaKitchenItem,
} from "@/lib/generated/prisma/client";
import {
  serializeKitchenItem,
} from "@/lib/items/serializers";

function createPrismaItem(
  overrides: Partial<PrismaKitchenItem> = {}
): PrismaKitchenItem {
  const item = {
    id: "c6c761db-d4e7-4ea8-b2b7-9dc44e9f0db8",
    userId: "user_test_123",
    name: "Milk",
    category: "dairy",
    storageLocation: "fridge",
    quantity: "1.50",
    unit: "gallon",
    dateBought: new Date(
      "2026-07-27T00:00:00.000Z"
    ),
    openedDate: new Date(
      "2026-07-28T00:00:00.000Z"
    ),
    expirationDate: new Date(
      "2026-08-03T00:00:00.000Z"
    ),
    notes: "Use for breakfast",
    createdAt: new Date(
      "2026-07-27T16:00:00.000Z"
    ),
    updatedAt: new Date(
      "2026-07-28T18:30:00.000Z"
    ),
    ...overrides,
  };

  return item as unknown as PrismaKitchenItem;
}

describe("serializeKitchenItem", () => {
  it("converts a Prisma item into an application item", () => {
    const result = serializeKitchenItem(
      createPrismaItem()
    );

    expect(result).toEqual({
      id: "c6c761db-d4e7-4ea8-b2b7-9dc44e9f0db8",
      name: "Milk",
      category: "dairy",
      storageLocation: "fridge",
      quantity: 1.5,
      unit: "gallon",
      dateBought: "2026-07-27",
      openedDate: "2026-07-28",
      expirationDate: "2026-08-03",
      notes: "Use for breakfast",
      createdAt: "2026-07-27T16:00:00.000Z",
      updatedAt: "2026-07-28T18:30:00.000Z",
    });
  });

  it("converts Prisma quantity values to numbers", () => {
    const result = serializeKitchenItem(
      createPrismaItem({
        quantity:
          "2.75" as unknown as PrismaKitchenItem["quantity"],
      })
    );

    expect(result.quantity).toBe(2.75);
    expect(typeof result.quantity).toBe(
      "number"
    );
  });

  it("preserves null optional fields", () => {
    const result = serializeKitchenItem(
      createPrismaItem({
        openedDate: null,
        expirationDate: null,
        notes: null,
      })
    );

    expect(result.openedDate).toBeNull();
    expect(result.expirationDate).toBeNull();
    expect(result.notes).toBeNull();
  });

  it("serializes timestamps as ISO strings", () => {
    const result = serializeKitchenItem(
      createPrismaItem({
        createdAt: new Date(
          "2026-01-02T03:04:05.678Z"
        ),
        updatedAt: new Date(
          "2026-06-07T08:09:10.111Z"
        ),
      })
    );

    expect(result.createdAt).toBe(
      "2026-01-02T03:04:05.678Z"
    );

    expect(result.updatedAt).toBe(
      "2026-06-07T08:09:10.111Z"
    );
  });
});

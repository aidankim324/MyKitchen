import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@/lib/generated/prisma/client";
import type { KitchenItem as PrismaKitchenItem } from "@/lib/generated/prisma/client";

const prismaMock = vi.hoisted(() => ({
  kitchenItem: {
    update: vi.fn(),
    findFirst: vi.fn(),
  },
  $executeRaw: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

const {
  adjustKitchenItemQuantityForUser,
  updateKitchenItemForUser,
} = await import("@/lib/items/queries");

const ITEM_ID = "c6c761db-d4e7-4ea8-b2b7-9dc44e9f0db8";
const USER_ID = "user_owner";

function createPrismaItem(): PrismaKitchenItem {
  return {
    id: ITEM_ID,
    userId: USER_ID,
    name: "Milk",
    category: "dairy",
    storageLocation: "fridge",
    quantity: "2.00",
    unit: "gallon",
    dateBought: new Date("2026-11-10T00:00:00.000Z"),
    openedDate: null,
    expirationDate: null,
    notes: null,
    createdAt: new Date("2026-11-10T12:00:00.000Z"),
    updatedAt: new Date("2026-11-10T12:00:00.000Z"),
  } as unknown as PrismaKitchenItem;
}

function recordNotFoundError() {
  return new Prisma.PrismaClientKnownRequestError("No record found.", {
    code: "P2025",
    clientVersion: "test",
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("updateKitchenItemForUser", () => {
  it("includes the owner in the update predicate", async () => {
    prismaMock.kitchenItem.update.mockResolvedValue(createPrismaItem());

    const item = await updateKitchenItemForUser(ITEM_ID, USER_ID, {
      name: "Milk",
    });

    expect(prismaMock.kitchenItem.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.kitchenItem.update).toHaveBeenCalledWith({
      where: { id: ITEM_ID, userId: USER_ID },
      data: { name: "Milk" },
    });
    expect(prismaMock.kitchenItem.findFirst).not.toHaveBeenCalled();
    expect(item?.id).toBe(ITEM_ID);
  });

  it("returns null when no owned record matches", async () => {
    prismaMock.kitchenItem.update.mockRejectedValue(recordNotFoundError());

    await expect(
      updateKitchenItemForUser(ITEM_ID, "user_other", { name: "Stolen" })
    ).resolves.toBeNull();
  });

  it("rethrows unrelated database errors", async () => {
    const error = new Error("connection lost");
    prismaMock.kitchenItem.update.mockRejectedValue(error);

    await expect(
      updateKitchenItemForUser(ITEM_ID, USER_ID, { name: "Milk" })
    ).rejects.toBe(error);
  });
});

describe("adjustKitchenItemQuantityForUser", () => {
  it("runs one owner-scoped, clamped update and returns the item", async () => {
    prismaMock.$executeRaw.mockResolvedValue(1);
    prismaMock.kitchenItem.findFirst.mockResolvedValue(createPrismaItem());

    const item = await adjustKitchenItemQuantityForUser(ITEM_ID, USER_ID, -1);

    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1);

    const [sqlParts, ...values] = prismaMock.$executeRaw.mock.calls[0];
    const sql = (sqlParts as string[]).join("?");

    expect(sql).toContain('GREATEST("quantity" + ?::numeric, 0)');
    expect(sql).toContain('"id" = ?::uuid AND "user_id" = ?');
    expect(values).toEqual([-1, ITEM_ID, USER_ID]);

    expect(prismaMock.kitchenItem.findFirst).toHaveBeenCalledWith({
      where: { id: ITEM_ID, userId: USER_ID },
    });
    expect(item?.quantity).toBe(2);
  });

  it("returns null without reading when no owned record matches", async () => {
    prismaMock.$executeRaw.mockResolvedValue(0);

    await expect(
      adjustKitchenItemQuantityForUser(ITEM_ID, "user_other", 1)
    ).resolves.toBeNull();

    expect(prismaMock.kitchenItem.findFirst).not.toHaveBeenCalled();
  });
});

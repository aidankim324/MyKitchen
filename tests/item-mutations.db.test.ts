// Runs against a real Postgres database only when TEST_DATABASE_URL is set.
// Use a disposable database with migrations applied, for example:
//   DIRECT_URL=$TEST_DATABASE_URL npx prisma migrate deploy
//   TEST_DATABASE_URL=... npm test
// The tests only create and delete rows owned by their own random user IDs.
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

// Skipping is fine locally, but CI must never pass without running these.
if (process.env.CI && !testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL must be set when CI is set.");
}

describe.skipIf(!testDatabaseUrl)("item mutations against Postgres", () => {
  const ownerId = `test_owner_${randomUUID()}`;
  const otherUserId = `test_other_${randomUUID()}`;

  let queries: typeof import("@/lib/items/queries");
  let prisma: typeof import("@/lib/prisma").prisma;

  beforeAll(async () => {
    process.env.DATABASE_URL = testDatabaseUrl;
    queries = await import("@/lib/items/queries");
    ({ prisma } = await import("@/lib/prisma"));
  });

  afterAll(async () => {
    await prisma?.kitchenItem.deleteMany({
      where: { userId: { in: [ownerId, otherUserId] } },
    });
    await prisma?.$disconnect();
  });

  function createOwnedItem(quantity: number) {
    return queries.createKitchenItemForUser(ownerId, {
      name: "Milk",
      category: "dairy",
      storageLocation: "fridge",
      quantity,
      unit: "gallon",
      dateBought: "2026-11-10",
    });
  }

  async function readQuantity(id: string) {
    const item = await queries.getKitchenItemForUser(id, ownerId);
    return item?.quantity;
  }

  it("does not let another user update, adjust, or delete an item", async () => {
    const item = await createOwnedItem(2);

    await expect(
      queries.updateKitchenItemForUser(item.id, otherUserId, {
        name: "Stolen",
      })
    ).resolves.toBeNull();

    await expect(
      queries.adjustKitchenItemQuantityForUser(item.id, otherUserId, 5)
    ).resolves.toBeNull();

    await expect(
      queries.deleteKitchenItemForUser(item.id, otherUserId)
    ).resolves.toBe(false);

    const unchanged = await queries.getKitchenItemForUser(item.id, ownerId);

    expect(unchanged?.name).toBe("Milk");
    expect(unchanged?.quantity).toBe(2);
  });

  it("lets the owner update their item", async () => {
    const item = await createOwnedItem(2);

    const updated = await queries.updateKitchenItemForUser(item.id, ownerId, {
      name: "Oat milk",
    });

    expect(updated?.name).toBe("Oat milk");
  });

  it("applies every concurrent increment", async () => {
    const item = await createOwnedItem(1);

    await Promise.all(
      Array.from({ length: 20 }, () =>
        queries.adjustKitchenItemQuantityForUser(item.id, ownerId, 1)
      )
    );

    expect(await readQuantity(item.id)).toBe(21);
  });

  it("never goes below zero under concurrent decrements", async () => {
    const item = await createOwnedItem(3);

    await Promise.all(
      Array.from({ length: 10 }, () =>
        queries.adjustKitchenItemQuantityForUser(item.id, ownerId, -1)
      )
    );

    expect(await readQuantity(item.id)).toBe(0);
  });

  it("clamps a fractional quantity at zero and keeps two decimals", async () => {
    const item = await createOwnedItem(0.5);

    const decreased = await queries.adjustKitchenItemQuantityForUser(
      item.id,
      ownerId,
      -1
    );

    expect(decreased?.quantity).toBe(0);

    const increased = await queries.adjustKitchenItemQuantityForUser(
      item.id,
      ownerId,
      0.25
    );

    expect(increased?.quantity).toBe(0.25);
  });

  it("updates updatedAt on adjustment", async () => {
    const item = await createOwnedItem(1);

    const adjusted = await queries.adjustKitchenItemQuantityForUser(
      item.id,
      ownerId,
      1
    );

    expect(adjusted && adjusted.updatedAt > item.updatedAt).toBe(true);
  });
});

import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { dateOnlyToPrismaDate } from "@/lib/dates";
import { serializeKitchenItem } from "@/lib/items/serializers";
import type { KitchenItem } from "@/types/inventory";
import type {
  CreateKitchenItemInput,
  UpdateKitchenItemInput,
} from "@/validations/item";

function hasOwnProperty<T extends object>(
  value: T,
  key: PropertyKey
): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export async function getKitchenItemsForUser(
  userId: string
): Promise<KitchenItem[]> {
  const items = await prisma.kitchenItem.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return items.map(serializeKitchenItem);
}

export async function getKitchenItemForUser(
  id: string,
  userId: string
): Promise<KitchenItem | null> {
  const item = await prisma.kitchenItem.findFirst({
    where: {
      id,
      userId,
    },
  });

  return item ? serializeKitchenItem(item) : null;
}

export async function createKitchenItemForUser(
  userId: string,
  input: CreateKitchenItemInput
): Promise<KitchenItem> {
  const item = await prisma.kitchenItem.create({
    data: {
      userId,
      name: input.name,
      category: input.category,
      storageLocation: input.storageLocation,
quantity: input.quantity,
unit: input.unit,
dateBought: dateOnlyToPrismaDate(input.dateBought) ?? new Date(),
openedDate: dateOnlyToPrismaDate(input.openedDate),
expirationDate: dateOnlyToPrismaDate(input.expirationDate),
notes: input.notes ?? null,
    },
  });

  return serializeKitchenItem(item);
}

export function buildKitchenItemUpdateData(
  input: UpdateKitchenItemInput
): Prisma.KitchenItemUpdateInput {
  const data: Prisma.KitchenItemUpdateInput = {};

  if (hasOwnProperty(input, "name") && input.name !== undefined) {
    data.name = input.name;
  }

  if (hasOwnProperty(input, "category") && input.category !== undefined) {
    data.category = input.category;
  }

  if (
    hasOwnProperty(input, "storageLocation") &&
    input.storageLocation !== undefined
  ) {
    data.storageLocation = input.storageLocation;
  }

  if (hasOwnProperty(input, "quantity") && input.quantity !== undefined) {
    data.quantity = input.quantity;
  }

  if (hasOwnProperty(input, "unit") && input.unit !== undefined) {
    data.unit = input.unit;
  }

if (hasOwnProperty(input, "dateBought") && input.dateBought !== undefined) {
  data.dateBought = dateOnlyToPrismaDate(input.dateBought) ?? undefined;
}

if (hasOwnProperty(input, "openedDate")) {
  data.openedDate = dateOnlyToPrismaDate(input.openedDate);
}

if (hasOwnProperty(input, "expirationDate")) {
  data.expirationDate = dateOnlyToPrismaDate(input.expirationDate);
}

  if (hasOwnProperty(input, "notes")) {
    data.notes = input.notes ?? null;
  }

  return data;
}

export async function updateKitchenItemForUser(
  id: string,
  userId: string,
  input: UpdateKitchenItemInput
): Promise<KitchenItem | null> {
  try {
    const updatedItem = await prisma.kitchenItem.update({
      where: {
        id,
        userId,
      },
      data: buildKitchenItemUpdateData(input),
    });

    return serializeKitchenItem(updatedItem);
  } catch (error) {
    // P2025: no record matched both the id and the owner.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }

    throw error;
  }
}

// A single SQL statement so concurrent adjustments can't overwrite each
// other. Prisma's `increment` can't express the clamp at zero.
export async function adjustKitchenItemQuantityForUser(
  id: string,
  userId: string,
  quantityChange: number
): Promise<KitchenItem | null> {
  const updatedCount = await prisma.$executeRaw`
    UPDATE "kitchen_items"
    SET "quantity" = GREATEST("quantity" + ${quantityChange}::numeric, 0),
        "updated_at" = NOW()
    WHERE "id" = ${id}::uuid AND "user_id" = ${userId}
  `;

  if (updatedCount === 0) {
    return null;
  }

  return getKitchenItemForUser(id, userId);
}

export async function deleteKitchenItemForUser(
  id: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.kitchenItem.deleteMany({
    where: {
      id,
      userId,
    },
  });

  return result.count > 0;
}

import type { KitchenItem as PrismaKitchenItem } from "@/lib/generated/prisma/client";
import { prismaDateToDateOnly } from "@/lib/dates";
import type { KitchenItem } from "@/types/inventory";

export function serializeKitchenItem(item: PrismaKitchenItem): KitchenItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    storageLocation: item.storageLocation,
    quantity: Number(item.quantity),
    unit: item.unit,
    dateBought: prismaDateToDateOnly(item.dateBought) ?? "",
    openedDate: prismaDateToDateOnly(item.openedDate),
    expirationDate: prismaDateToDateOnly(item.expirationDate),
    notes: item.notes,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}
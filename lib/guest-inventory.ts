import type { KitchenItem } from "@/types/inventory";

type GuestItemTemplate = {
  id: string;
  name: string;
  category: KitchenItem["category"];
  storageLocation: KitchenItem["storageLocation"];
  quantity: number;
  unit: KitchenItem["unit"];
  boughtDaysFromToday: number;
  openedDaysFromToday: number | null;
  expirationDaysFromToday: number | null;
  createdDaysFromToday: number;
  notes?: string | null;
};

function shiftDate(
  dateOnly: string,
  days: number
) {
  const [year, month, day] = dateOnly
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  date.setUTCDate(date.getUTCDate() + days);

  const shiftedYear = date.getUTCFullYear();
  const shiftedMonth = String(
    date.getUTCMonth() + 1
  ).padStart(2, "0");
  const shiftedDay = String(
    date.getUTCDate()
  ).padStart(2, "0");

  return `${shiftedYear}-${shiftedMonth}-${shiftedDay}`;
}

function toIsoTimestamp(dateOnly: string) {
  return `${dateOnly}T12:00:00.000Z`;
}

const GUEST_ITEM_TEMPLATES: GuestItemTemplate[] = [
  {
    id: "guest-milk",
    name: "2% Milk",
    category: "dairy",
    storageLocation: "fridge",
    quantity: 1,
    unit: "gallon",
    boughtDaysFromToday: -5,
    openedDaysFromToday: -2,
    expirationDaysFromToday: 10,
    createdDaysFromToday: -1,
  },
  {
    id: "guest-yogurt",
    name: "Greek Yogurt",
    category: "dairy",
    storageLocation: "fridge",
    quantity: 4,
    unit: "count",
    boughtDaysFromToday: -6,
    openedDaysFromToday: -1,
    expirationDaysFromToday: 3,
    createdDaysFromToday: -2,
  },
  {
    id: "guest-eggs",
    name: "Eggs",
    category: "dairy",
    storageLocation: "fridge",
    quantity: 12,
    unit: "count",
    boughtDaysFromToday: -4,
    openedDaysFromToday: null,
    expirationDaysFromToday: 14,
    createdDaysFromToday: -3,
  },
  {
    id: "guest-parmesan",
    name: "Parmesan Cheese",
    category: "dairy",
    storageLocation: "fridge",
    quantity: 1,
    unit: "package",
    boughtDaysFromToday: -8,
    openedDaysFromToday: -3,
    expirationDaysFromToday: 21,
    createdDaysFromToday: -4,
  },
  {
    id: "guest-spinach",
    name: "Baby Spinach",
    category: "produce",
    storageLocation: "fridge",
    quantity: 1,
    unit: "bag",
    boughtDaysFromToday: -4,
    openedDaysFromToday: -1,
    expirationDaysFromToday: 1,
    createdDaysFromToday: -5,
  },
  {
    id: "guest-strawberries",
    name: "Strawberries",
    category: "produce",
    storageLocation: "fridge",
    quantity: 1,
    unit: "package",
    boughtDaysFromToday: -7,
    openedDaysFromToday: -4,
    expirationDaysFromToday: -1,
    createdDaysFromToday: -6,
  },
  {
    id: "guest-chicken",
    name: "Chicken Breasts",
    category: "meat",
    storageLocation: "fridge",
    quantity: 2,
    unit: "lb",
    boughtDaysFromToday: -2,
    openedDaysFromToday: null,
    expirationDaysFromToday: 4,
    createdDaysFromToday: -7,
  },
  {
    id: "guest-orange-juice",
    name: "Orange Juice",
    category: "beverages",
    storageLocation: "fridge",
    quantity: 1,
    unit: "bottle",
    boughtDaysFromToday: -3,
    openedDaysFromToday: -2,
    expirationDaysFromToday: 12,
    createdDaysFromToday: -8,
  },
  {
    id: "guest-salsa",
    name: "Salsa",
    category: "condiments",
    storageLocation: "fridge",
    quantity: 1,
    unit: "jar",
    boughtDaysFromToday: -10,
    openedDaysFromToday: -6,
    expirationDaysFromToday: 30,
    createdDaysFromToday: -9,
  },
  {
    id: "guest-leftover-pasta",
    name: "Leftover Pasta",
    category: "leftovers",
    storageLocation: "fridge",
    quantity: 1,
    unit: "count",
    boughtDaysFromToday: -1,
    openedDaysFromToday: -1,
    expirationDaysFromToday: 2,
    createdDaysFromToday: 0,
  },

  {
    id: "guest-ribeye",
    name: "Ribeye Steaks",
    category: "meat",
    storageLocation: "freezer",
    quantity: 2,
    unit: "lb",
    boughtDaysFromToday: -18,
    openedDaysFromToday: null,
    expirationDaysFromToday: 90,
    createdDaysFromToday: -10,
  },
  {
    id: "guest-blueberries",
    name: "Frozen Blueberries",
    category: "frozen",
    storageLocation: "freezer",
    quantity: 1,
    unit: "bag",
    boughtDaysFromToday: -21,
    openedDaysFromToday: -5,
    expirationDaysFromToday: null,
    createdDaysFromToday: -11,
  },
  {
    id: "guest-salmon",
    name: "Salmon Fillets",
    category: "seafood",
    storageLocation: "freezer",
    quantity: 4,
    unit: "count",
    boughtDaysFromToday: -12,
    openedDaysFromToday: null,
    expirationDaysFromToday: 60,
    createdDaysFromToday: -12,
  },
  {
    id: "guest-frozen-pizza",
    name: "Frozen Pizza",
    category: "frozen",
    storageLocation: "freezer",
    quantity: 2,
    unit: "count",
    boughtDaysFromToday: -9,
    openedDaysFromToday: null,
    expirationDaysFromToday: null,
    createdDaysFromToday: -13,
  },
  {
    id: "guest-ice-cream",
    name: "Vanilla Ice Cream",
    category: "frozen",
    storageLocation: "freezer",
    quantity: 1,
    unit: "pint",
    boughtDaysFromToday: -8,
    openedDaysFromToday: -3,
    expirationDaysFromToday: 45,
    createdDaysFromToday: -14,
  },
  {
    id: "guest-peas",
    name: "Frozen Peas",
    category: "frozen",
    storageLocation: "freezer",
    quantity: 1,
    unit: "bag",
    boughtDaysFromToday: -17,
    openedDaysFromToday: null,
    expirationDaysFromToday: null,
    createdDaysFromToday: -15,
  },

  {
    id: "guest-brown-rice",
    name: "Brown Rice",
    category: "grains",
    storageLocation: "pantry",
    quantity: 2,
    unit: "bag",
    boughtDaysFromToday: -30,
    openedDaysFromToday: -18,
    expirationDaysFromToday: null,
    createdDaysFromToday: -16,
  },
  {
    id: "guest-pasta",
    name: "Pasta",
    category: "grains",
    storageLocation: "pantry",
    quantity: 3,
    unit: "box",
    boughtDaysFromToday: -20,
    openedDaysFromToday: null,
    expirationDaysFromToday: null,
    createdDaysFromToday: -17,
  },
  {
    id: "guest-black-beans",
    name: "Black Beans",
    category: "canned_goods",
    storageLocation: "pantry",
    quantity: 4,
    unit: "can",
    boughtDaysFromToday: -35,
    openedDaysFromToday: null,
    expirationDaysFromToday: null,
    createdDaysFromToday: -18,
  },
  {
    id: "guest-tomato-soup",
    name: "Tomato Soup",
    category: "canned_goods",
    storageLocation: "pantry",
    quantity: 3,
    unit: "can",
    boughtDaysFromToday: -28,
    openedDaysFromToday: null,
    expirationDaysFromToday: 180,
    createdDaysFromToday: -19,
  },
  {
    id: "guest-peanut-butter",
    name: "Peanut Butter",
    category: "condiments",
    storageLocation: "pantry",
    quantity: 1,
    unit: "jar",
    boughtDaysFromToday: -15,
    openedDaysFromToday: -10,
    expirationDaysFromToday: null,
    createdDaysFromToday: -20,
  },
  {
    id: "guest-coke",
    name: "Coke",
    category: "beverages",
    storageLocation: "pantry",
    quantity: 6,
    unit: "can",
    boughtDaysFromToday: -6,
    openedDaysFromToday: null,
    expirationDaysFromToday: null,
    createdDaysFromToday: -21,
  },
  {
    id: "guest-curry",
    name: "Japanese Curry Blocks",
    category: "spices",
    storageLocation: "pantry",
    quantity: 2,
    unit: "box",
    boughtDaysFromToday: -25,
    openedDaysFromToday: -9,
    expirationDaysFromToday: null,
    createdDaysFromToday: -22,
  },
  {
    id: "guest-flour",
    name: "All-Purpose Flour",
    category: "baking",
    storageLocation: "pantry",
    quantity: 1,
    unit: "bag",
    boughtDaysFromToday: -40,
    openedDaysFromToday: -20,
    expirationDaysFromToday: null,
    createdDaysFromToday: -23,
  },
  {
    id: "guest-olive-oil",
    name: "Olive Oil",
    category: "condiments",
    storageLocation: "pantry",
    quantity: 1,
    unit: "bottle",
    boughtDaysFromToday: -45,
    openedDaysFromToday: -30,
    expirationDaysFromToday: 120,
    createdDaysFromToday: -24,
  },
];

export function getGuestInventory(
  today: string
): KitchenItem[] {
  return GUEST_ITEM_TEMPLATES.map(
    (template) => {
      const dateBought = shiftDate(
        today,
        template.boughtDaysFromToday
      );

      const openedDate =
        template.openedDaysFromToday === null
          ? null
          : shiftDate(
              today,
              template.openedDaysFromToday
            );

      const expirationDate =
        template.expirationDaysFromToday ===
        null
          ? null
          : shiftDate(
              today,
              template.expirationDaysFromToday
            );

      const createdDate = shiftDate(
        today,
        template.createdDaysFromToday
      );

      return {
        id: template.id,
        name: template.name,
        category: template.category,
        storageLocation:
          template.storageLocation,
        quantity: template.quantity,
        unit: template.unit,
        dateBought,
        openedDate,
        expirationDate,
        notes: template.notes ?? null,
        createdAt:
          toIsoTimestamp(createdDate),
        updatedAt:
          toIsoTimestamp(createdDate),
      };
    }
  );
}

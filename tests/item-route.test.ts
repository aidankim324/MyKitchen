import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  adjustKitchenItemQuantityForUser: vi.fn(),
  updateKitchenItemForUser: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: mocks.auth,
}));

vi.mock("@/lib/items/queries", () => ({
  adjustKitchenItemQuantityForUser: mocks.adjustKitchenItemQuantityForUser,
  updateKitchenItemForUser: mocks.updateKitchenItemForUser,
  deleteKitchenItemForUser: vi.fn(),
  getKitchenItemForUser: vi.fn(),
}));

const { PATCH } = await import("@/app/api/items/[id]/route");

const ITEM_ID = "c6c761db-d4e7-4ea8-b2b7-9dc44e9f0db8";

function patch(body: unknown, id = ITEM_ID) {
  const request = new Request(`http://localhost/api/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return PATCH(request, { params: Promise.resolve({ id }) });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ userId: "user_owner" });
});

describe("PATCH /api/items/[id]", () => {
  it("rejects unauthenticated requests before touching data", async () => {
    mocks.auth.mockResolvedValue({ userId: null });

    const response = await patch({ quantityChange: 1 });

    expect(response.status).toBe(401);
    expect(mocks.adjustKitchenItemQuantityForUser).not.toHaveBeenCalled();
    expect(mocks.updateKitchenItemForUser).not.toHaveBeenCalled();
  });

  it("sends quantity changes to the atomic adjustment for the signed-in user", async () => {
    mocks.adjustKitchenItemQuantityForUser.mockResolvedValue({
      id: ITEM_ID,
      quantity: 3,
    });

    const response = await patch({ quantityChange: 1 });

    expect(response.status).toBe(200);
    expect(mocks.adjustKitchenItemQuantityForUser).toHaveBeenCalledWith(
      ITEM_ID,
      "user_owner",
      1
    );
    expect(mocks.updateKitchenItemForUser).not.toHaveBeenCalled();
  });

  it("sends other fields to the owner-scoped update", async () => {
    mocks.updateKitchenItemForUser.mockResolvedValue({ id: ITEM_ID });

    const response = await patch({ openedDate: "2026-11-17" });

    expect(response.status).toBe(200);
    expect(mocks.updateKitchenItemForUser).toHaveBeenCalledWith(
      ITEM_ID,
      "user_owner",
      { openedDate: "2026-11-17" }
    );
    expect(mocks.adjustKitchenItemQuantityForUser).not.toHaveBeenCalled();
  });

  it.each([
    ["quantity adjustment", { quantityChange: -1 }],
    ["update", { name: "Not mine" }],
  ])(
    "returns 404 when the %s matches no item owned by the user",
    async (_label, body) => {
      mocks.adjustKitchenItemQuantityForUser.mockResolvedValue(null);
      mocks.updateKitchenItemForUser.mockResolvedValue(null);

      const response = await patch(body);

      expect(response.status).toBe(404);
    }
  );

  it.each([
    { quantityChange: 0 },
    { quantityChange: 1, name: "Milk" },
    { quantity: -1 },
  ])("rejects invalid body %j without touching data", async (body) => {
    const response = await patch(body);

    expect(response.status).toBe(400);
    expect(mocks.adjustKitchenItemQuantityForUser).not.toHaveBeenCalled();
    expect(mocks.updateKitchenItemForUser).not.toHaveBeenCalled();
  });

  it("rejects a malformed item id", async () => {
    const response = await patch({ quantityChange: 1 }, "not-a-uuid");

    expect(response.status).toBe(400);
    expect(mocks.adjustKitchenItemQuantityForUser).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";
import { getExpirationStatus } from "@/lib/dates";

describe("getExpirationStatus", () => {
  const today = new Date("2026-07-27T00:00:00.000Z");

  it("returns no_date when an item has no expiration date", () => {
    expect(getExpirationStatus(null, today)).toBe("no_date");
  });

  it("returns expired when the expiration date is before today", () => {
    expect(
      getExpirationStatus("2026-07-26", today)
    ).toBe("expired");
  });

  it("returns expiring_soon for an item expiring within a few days", () => {
    expect(
      getExpirationStatus("2026-07-30", today)
    ).toBe("expiring_soon");
  });

  it("returns fresh for an item whose expiration date is farther away", () => {
    expect(
      getExpirationStatus("2026-08-27", today)
    ).toBe("fresh");
  });
});

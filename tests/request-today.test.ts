import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TIME_ZONE_COOKIE } from "@/lib/dates";

const cookieStore = vi.hoisted(() => new Map<string, string>());

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieStore.has(name)
        ? { name, value: cookieStore.get(name) }
        : undefined,
  }),
}));

const { getRequestToday } = await import("@/lib/request-today");

beforeEach(() => {
  cookieStore.clear();
  vi.useFakeTimers();
  // 7:30 PM on November 17 in Los Angeles.
  vi.setSystemTime(new Date("2026-11-18T03:30:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getRequestToday", () => {
  it("uses the time zone from the cookie", async () => {
    cookieStore.set(TIME_ZONE_COOKIE, "America/Los_Angeles");

    await expect(getRequestToday()).resolves.toBe("2026-11-17");
  });

  it("falls back to UTC without a cookie", async () => {
    await expect(getRequestToday()).resolves.toBe("2026-11-18");
  });

  it.each(["", "Mars/Olympus_Mons", "<script>", "America/Los_Angeles\u0000"])(
    "falls back to UTC for an invalid cookie value %j",
    async (value) => {
      cookieStore.set(TIME_ZONE_COOKIE, value);

      await expect(getRequestToday()).resolves.toBe("2026-11-18");
    }
  );
});

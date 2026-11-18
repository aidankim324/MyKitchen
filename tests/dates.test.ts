import { afterEach, describe, expect, it, vi } from "vitest";
import {
  dateOnlyToPrismaDate,
  dateOnlyToUtcDayNumber,
  formatDateOnlyInTimeZone,
  formatUtcDateOnly,
  getBrowserToday,
  getExpirationStatus,
  isDateOnlyString,
  prismaDateToDateOnly,
} from "@/lib/dates";

describe("isDateOnlyString", () => {
  it("accepts the YYYY-MM-DD shape", () => {
    expect(
      isDateOnlyString("2026-07-27")
    ).toBe(true);
  });

  it("rejects other date formats", () => {
    expect(
      isDateOnlyString("07/27/2026")
    ).toBe(false);

    expect(
      isDateOnlyString("2026-7-27")
    ).toBe(false);

    expect(
      isDateOnlyString("July 27, 2026")
    ).toBe(false);
  });
});

describe("formatUtcDateOnly", () => {
  it("formats a Date using its UTC calendar date", () => {
    const date = new Date(
      "2026-07-27T23:45:00.000Z"
    );

    expect(formatUtcDateOnly(date)).toBe(
      "2026-07-27"
    );
  });

  it("pads single-digit months and days", () => {
    const date = new Date(
      "2026-01-05T00:00:00.000Z"
    );

    expect(formatUtcDateOnly(date)).toBe(
      "2026-01-05"
    );
  });
});

describe("dateOnlyToUtcDayNumber", () => {
  it("uses January 1, 1970 as UTC day zero", () => {
    expect(
      dateOnlyToUtcDayNumber("1970-01-01")
    ).toBe(0);
  });

  it("keeps consecutive dates one day apart", () => {
    const first = dateOnlyToUtcDayNumber(
      "2026-12-31"
    );

    const second = dateOnlyToUtcDayNumber(
      "2027-01-01"
    );

    expect(second - first).toBe(1);
  });

  it("accepts a valid leap day", () => {
    expect(() =>
      dateOnlyToUtcDayNumber("2024-02-29")
    ).not.toThrow();
  });

  it("rejects a malformed date-only value", () => {
    expect(() =>
      dateOnlyToUtcDayNumber("07/27/2026")
    ).toThrow(
      "Invalid date-only value: 07/27/2026"
    );
  });

  it("rejects an impossible calendar date", () => {
    expect(() =>
      dateOnlyToUtcDayNumber("2026-02-31")
    ).toThrow(
      "Invalid calendar date: 2026-02-31"
    );
  });

  it("rejects a leap day in a non-leap year", () => {
    expect(() =>
      dateOnlyToUtcDayNumber("2025-02-29")
    ).toThrow(
      "Invalid calendar date: 2025-02-29"
    );
  });
});

describe("getExpirationStatus", () => {
  const today = "2026-07-27";

  it("returns no_date for null", () => {
    expect(
      getExpirationStatus(null, today)
    ).toBe("no_date");
  });

  it("returns no_date for undefined", () => {
    expect(
      getExpirationStatus(undefined, today)
    ).toBe("no_date");
  });

  it("returns expired before today", () => {
    expect(
      getExpirationStatus(
        "2026-07-26",
        today
      )
    ).toBe("expired");
  });

  it("returns expiring_soon on the expiration date", () => {
    expect(
      getExpirationStatus(
        "2026-07-27",
        today
      )
    ).toBe("expiring_soon");
  });

  it("returns expiring_soon seven days away", () => {
    expect(
      getExpirationStatus(
        "2026-08-03",
        today
      )
    ).toBe("expiring_soon");
  });

  it("returns fresh eight days away", () => {
    expect(
      getExpirationStatus(
        "2026-08-04",
        today
      )
    ).toBe("fresh");
  });

  it("rejects an invalid expiration date", () => {
    expect(() =>
      getExpirationStatus(
        "2026-02-31",
        today
      )
    ).toThrow(
      "Invalid calendar date: 2026-02-31"
    );
  });
});

describe("dateOnlyToPrismaDate", () => {
  it("converts a date-only string to UTC midnight", () => {
    expect(
      dateOnlyToPrismaDate("2026-07-27")
    ).toEqual(
      new Date("2026-07-27T00:00:00.000Z")
    );
  });

  it("returns null for null or undefined", () => {
    expect(
      dateOnlyToPrismaDate(null)
    ).toBeNull();

    expect(
      dateOnlyToPrismaDate(undefined)
    ).toBeNull();
  });

  it("rejects an impossible calendar date", () => {
    expect(() =>
      dateOnlyToPrismaDate("2026-02-31")
    ).toThrow(
      "Invalid calendar date: 2026-02-31"
    );
  });
});

describe("prismaDateToDateOnly", () => {
  it("converts a Date to a UTC date-only string", () => {
    const date = new Date(
      "2026-07-27T18:30:00.000Z"
    );

    expect(
      prismaDateToDateOnly(date)
    ).toBe("2026-07-27");
  });

  it("returns null for a null Date", () => {
    expect(
      prismaDateToDateOnly(null)
    ).toBeNull();
  });
});

describe("formatDateOnlyInTimeZone", () => {
  // 7:30 PM on November 17 in Los Angeles.
  const evening = new Date("2026-11-18T03:30:00.000Z");

  it("uses the calendar date in the given time zone", () => {
    expect(
      formatDateOnlyInTimeZone(evening, "America/Los_Angeles")
    ).toBe("2026-11-17");

    expect(formatDateOnlyInTimeZone(evening, "UTC")).toBe(
      "2026-11-18"
    );

    expect(formatDateOnlyInTimeZone(evening, "Asia/Tokyo")).toBe(
      "2026-11-18"
    );
  });

  it("handles time zones ahead of UTC across midnight", () => {
    // 11:30 PM UTC on December 31 is already January 1 in Tokyo.
    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-12-31T23:30:00.000Z"),
        "Asia/Tokyo"
      )
    ).toBe("2027-01-01");
  });

  it("follows daylight saving time transitions", () => {
    // DST ends 2026-11-01 at 2:00 AM PDT (09:00 UTC); 1:30 AM repeats.
    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-11-01T06:59:00.000Z"),
        "America/Los_Angeles"
      )
    ).toBe("2026-10-31");

    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-11-01T07:00:00.000Z"),
        "America/Los_Angeles"
      )
    ).toBe("2026-11-01");

    // Midnight after DST ends is 08:00 UTC, not 07:00.
    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-11-02T07:59:00.000Z"),
        "America/Los_Angeles"
      )
    ).toBe("2026-11-01");

    // DST starts 2026-03-08; midnight on March 9 is 07:00 UTC.
    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-03-09T06:59:00.000Z"),
        "America/Los_Angeles"
      )
    ).toBe("2026-03-08");

    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-03-09T07:00:00.000Z"),
        "America/Los_Angeles"
      )
    ).toBe("2026-03-09");
  });

  it.each([undefined, "", "Not/AZone", "UTC; Path=/", "x".repeat(500)])(
    "falls back to UTC for %j",
    (timeZone) => {
      expect(formatDateOnlyInTimeZone(evening, timeZone)).toBe(
        "2026-11-18"
      );
    }
  );

  it("pads single-digit months and days", () => {
    expect(
      formatDateOnlyInTimeZone(
        new Date("2026-03-05T12:00:00.000Z"),
        "America/New_York"
      )
    ).toBe("2026-03-05");
  });
});

describe("expiration status with a time-zone-derived today", () => {
  const evening = new Date("2026-11-18T03:30:00.000Z");
  const losAngelesToday = formatDateOnlyInTimeZone(
    evening,
    "America/Los_Angeles"
  );

  it("treats an item expiring today as expiring_soon, not expired", () => {
    expect(getExpirationStatus("2026-11-17", losAngelesToday)).toBe(
      "expiring_soon"
    );

    // The UTC date would already call it expired.
    expect(
      getExpirationStatus(
        "2026-11-17",
        formatDateOnlyInTimeZone(evening, "UTC")
      )
    ).toBe("expired");
  });

  it("keeps the seven-day window anchored to the local date", () => {
    expect(getExpirationStatus("2026-11-24", losAngelesToday)).toBe(
      "expiring_soon"
    );
    expect(getExpirationStatus("2026-11-25", losAngelesToday)).toBe(
      "fresh"
    );
    expect(getExpirationStatus("2026-11-16", losAngelesToday)).toBe(
      "expired"
    );
  });
});

describe("getBrowserToday", () => {
  const originalTimeZone = process.env.TZ;

  afterEach(() => {
    vi.useRealTimers();
    process.env.TZ = originalTimeZone;
  });

  it("uses the runtime's own time zone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-18T03:30:00.000Z"));
    process.env.TZ = "America/Los_Angeles";

    expect(getBrowserToday()).toBe("2026-11-17");
  });
});

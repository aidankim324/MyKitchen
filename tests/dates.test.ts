import { describe, expect, it } from "vitest";
import {
  dateOnlyToPrismaDate,
  dateOnlyToUtcDayNumber,
  formatUtcDateOnly,
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
  const today = new Date(
    "2026-07-27T00:00:00.000Z"
  );

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

import type { ExpirationStatus } from "@/types/inventory";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnlyString(value: string): boolean {
  return DATE_ONLY_REGEX.test(value);
}

export function formatUtcDateOnly(
  date: Date = new Date()
): string {
  const year = date.getUTCFullYear();
  const month = String(
    date.getUTCMonth() + 1
  ).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

export function dateOnlyToUtcDayNumber(
  dateOnly: string
): number {
  if (!isDateOnlyString(dateOnly)) {
    throw new Error(
      `Invalid date-only value: ${dateOnly}`
    );
  }

  const [year, month, day] = dateOnly
    .split("-")
    .map(Number);

  const utcMs = Date.UTC(year, month - 1, day);
  const parsed = new Date(utcMs);

  const isValidCalendarDate =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;

  if (!isValidCalendarDate) {
    throw new Error(
      `Invalid calendar date: ${dateOnly}`
    );
  }

  return Math.floor(utcMs / MS_PER_DAY);
}

export function getExpirationStatus(
  expirationDate: string | null | undefined,
  now: Date = new Date()
): ExpirationStatus {
  if (!expirationDate) {
    return "no_date";
  }

  const todayDateOnly = formatUtcDateOnly(now);

  const todayDayNumber =
    dateOnlyToUtcDayNumber(todayDateOnly);

  const expirationDayNumber =
    dateOnlyToUtcDayNumber(expirationDate);

  const diffDays =
    expirationDayNumber - todayDayNumber;

  if (diffDays < 0) {
    return "expired";
  }

  if (diffDays <= 7) {
    return "expiring_soon";
  }

  return "fresh";
}

export function dateOnlyToPrismaDate(
  dateOnly: string | null | undefined
): Date | null {
  if (!dateOnly) {
    return null;
  }

  const utcDayNumber =
    dateOnlyToUtcDayNumber(dateOnly);

  return new Date(utcDayNumber * MS_PER_DAY);
}

export function prismaDateToDateOnly(
  date: Date | null
): string | null {
  if (!date) {
    return null;
  }

  return formatUtcDateOnly(date);
}

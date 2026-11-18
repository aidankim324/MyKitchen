import type { ExpirationStatus } from "@/types/inventory";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnlyString(value: string): boolean {
  return DATE_ONLY_REGEX.test(value);
}

export function formatUtcDateOnly(
  date: Date
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

export const TIME_ZONE_COOKIE = "mykitchen_tz";

const FALLBACK_TIME_ZONE = "UTC";

function resolveTimeZone(
  timeZone: string | undefined
): string {
  if (!timeZone) {
    return FALLBACK_TIME_ZONE;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return timeZone;
  } catch {
    return FALLBACK_TIME_ZONE;
  }
}

// The calendar date at `date` in `timeZone`. A missing or invalid time zone
// falls back to UTC.
export function formatDateOnlyInTimeZone(
  date: Date,
  timeZone: string | undefined
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: resolveTimeZone(timeZone),
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? "";

  return `${part("year").padStart(4, "0")}-${part("month")}-${part("day")}`;
}

// For click-time actions in the browser, such as marking an item opened.
export function getBrowserToday(): string {
  return formatDateOnlyInTimeZone(
    new Date(),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
}

export function getExpirationStatus(
  expirationDate: string | null | undefined,
  today: string
): ExpirationStatus {
  if (!expirationDate) {
    return "no_date";
  }

  const todayDayNumber =
    dateOnlyToUtcDayNumber(today);

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

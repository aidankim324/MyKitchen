import { cookies } from "next/headers";
import {
  TIME_ZONE_COOKIE,
  formatDateOnlyInTimeZone,
} from "@/lib/dates";

// The user's calendar date for this request, using the time zone cookie set
// by TimeZoneSync. Before that cookie exists (a first visit), this is the UTC
// date; TimeZoneSync then refreshes the page once with the correct date.
export async function getRequestToday(): Promise<string> {
  const cookieStore = await cookies();

  return formatDateOnlyInTimeZone(
    new Date(),
    cookieStore.get(TIME_ZONE_COOKIE)?.value
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TIME_ZONE_COOKIE } from "@/lib/dates";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function readCookieValue() {
  const prefix = `${TIME_ZONE_COOKIE}=`;

  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix))
    ?.slice(prefix.length);
}

// Tells the server the browser's time zone so server-rendered dates use the
// user's calendar day.
export function TimeZoneSync() {
  const router = useRouter();

  useEffect(() => {
    const timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timeZone) {
      return;
    }

    const value = encodeURIComponent(timeZone);

    if (readCookieValue() === value) {
      return;
    }

    const secure =
      window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `${TIME_ZONE_COOKIE}=${value}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;

    // If cookies are blocked, a refresh would render the same fallback date,
    // so only refresh once the cookie is actually stored.
    if (readCookieValue() === value) {
      router.refresh();
    }
  }, [router]);

  return null;
}

"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/inventory",
    label: "Inventory",
  },
];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="shrink-0 text-lg font-semibold tracking-tight"
        >
          MyKitchen
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(
              pathname,
              item.href
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/inventory/new"
            className="hidden rounded-lg bg-black px-3.5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:inline-flex"
          >
            Add item
          </Link>

          <UserButton />
        </div>
      </div>
    </header>
  );
}

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

function isActiveRoute(
  pathname: string,
  href: string
) {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition focus:translate-y-0"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-3 sm:gap-5 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="shrink-0 rounded-md text-base font-semibold tracking-tight sm:text-lg"
          >
            MyKitchen
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
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
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  className={[
                    "inline-flex min-h-11 shrink-0 items-center rounded-lg px-3",
                    "text-sm font-medium transition",
                    isActive
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/inventory/new"
              aria-label="Add inventory item"
              className="inline-flex size-10 items-center justify-center rounded-lg bg-black text-xl font-medium text-white shadow-sm transition hover:bg-gray-800 sm:hidden"
            >
              <span aria-hidden="true">+</span>
            </Link>

            <Link
              href="/inventory/new"
              className="hidden min-h-11 items-center rounded-lg bg-black px-4 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 sm:inline-flex"
            >
              Add item
            </Link>

            <UserButton />
          </div>
        </div>
      </header>
    </>
  );
}

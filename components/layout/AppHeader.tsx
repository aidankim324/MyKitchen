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

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="relative flex size-9 items-center justify-center rounded-[0.7rem] bg-accent text-accent-foreground shadow-soft"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.25 18V8.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7.25 13.75L15.75 7.25"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10.5 11.25L16.75 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M14.25 5.75C16.2 4.65 18.1 4.7 19.65 5.45C18.9 7.15 17.55 8.3 15.55 8.65"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-control bg-ink px-4 py-2 text-sm font-medium text-white shadow-raised transition-transform duration-[var(--duration-fast)] ease-standard focus:translate-y-0"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-3 sm:gap-6 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            aria-label="MyKitchen dashboard"
            className="flex shrink-0 items-center gap-2.5 rounded-control"
          >
            <BrandMark />

            <span className="hidden sm:block">
              <span className="block text-[0.95rem] font-semibold leading-4 tracking-[-0.02em] text-ink">
                MyKitchen
              </span>
              <span className="mt-0.5 block text-[0.68rem] font-medium uppercase leading-3 tracking-[0.12em] text-muted">
                Home inventory
              </span>
            </span>

            <span className="text-base font-semibold tracking-[-0.02em] text-ink sm:hidden">
              MyKitchen
            </span>
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
                    "relative inline-flex min-h-10 shrink-0 items-center rounded-control px-3",
                    "text-sm font-medium transition-colors duration-[var(--duration-fast)] ease-standard",
                    isActive
                      ? "bg-accent-soft text-accent-active"
                      : "text-muted hover:bg-surface-subtle hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}

                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-1 h-px rounded-full bg-accent/60"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/inventory/new"
              aria-label="Add inventory item"
              className="inline-flex size-10 items-center justify-center rounded-control bg-accent text-xl font-medium text-accent-foreground shadow-soft transition duration-[var(--duration-fast)] ease-standard hover:-translate-y-px hover:bg-accent-hover active:translate-y-0 active:bg-accent-active motion-reduce:transform-none sm:hidden"
            >
              <span aria-hidden="true">+</span>
            </Link>

            <Link
              href="/inventory/new"
              className="hidden min-h-10 items-center rounded-control bg-accent px-4 text-sm font-medium text-accent-foreground shadow-soft transition duration-[var(--duration-fast)] ease-standard hover:-translate-y-px hover:bg-accent-hover active:translate-y-0 active:bg-accent-active motion-reduce:transform-none sm:inline-flex"
            >
              Add item
            </Link>

            <div className="flex size-10 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] hover:bg-surface-subtle">
              <UserButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

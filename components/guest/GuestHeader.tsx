"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/guest",
    label: "Dashboard",
  },
  {
    href: "/guest/inventory",
    label: "Inventory",
  },
];

function isActiveRoute(
  pathname: string,
  href: string
) {
  if (href === "/guest") {
    return pathname === "/guest";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function GuestHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[110rem] items-center gap-3 px-3 sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="MyKitchen home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-[0.8rem] bg-accent text-sm font-semibold text-accent-foreground shadow-soft"
          >
            K
          </span>

          <span className="hidden sm:block">
            <span className="block text-sm font-semibold leading-4 tracking-[-0.02em] text-ink">
              MyKitchen
            </span>

            <span className="block text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted">
              Guest preview
            </span>
          </span>
        </Link>

        <nav
          aria-label="Guest navigation"
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {navigationItems.map((item) => {
            const active = isActiveRoute(
              pathname,
              item.href
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active ? "page" : undefined
                }
                className={[
                  "inline-flex min-h-10 items-center rounded-control px-3",
                  "text-sm font-medium transition-colors duration-[var(--duration-fast)] ease-standard",
                  active
                    ? "bg-accent-soft text-accent-active"
                    : "text-muted hover:bg-surface-subtle hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden min-h-8 items-center gap-2 rounded-control border border-line bg-surface px-3 text-xs font-medium text-muted lg:inline-flex">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            Read only
          </span>

          <Link
            href="/sign-in"
            className="hidden min-h-10 items-center rounded-control px-3 text-sm font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex min-h-10 items-center rounded-control bg-accent px-3.5 text-sm font-medium text-accent-foreground shadow-soft transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-accent-hover"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}

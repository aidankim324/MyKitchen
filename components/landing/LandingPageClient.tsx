"use client";

import type { MouseEvent } from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { FridgeIllustration } from "@/components/landing/FridgeIllustration";

type AnimationTarget =
  | "fridge"
  | "freezer"
  | null;

type LandingPageClientProps = {
  isSignedIn: boolean;
};

const NAVIGATION_DELAY_MS = 2000;

export function LandingPageClient({
  isSignedIn,
}: LandingPageClientProps) {
  const router = useRouter();

  const [
    animationTarget,
    setAnimationTarget,
  ] = useState<AnimationTarget>(null);

  const [isNavigating, setIsNavigating] =
    useState(false);

  const navigationTimer =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (
        navigationTimer.current !== null
      ) {
        window.clearTimeout(
          navigationTimer.current
        );
      }
    };
  }, []);

  function handleNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    target: Exclude<
      AnimationTarget,
      null
    >
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (isNavigating) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    setAnimationTarget(target);
    setIsNavigating(true);

    if (prefersReducedMotion) {
      router.push(href);
      return;
    }

    navigationTimer.current =
      window.setTimeout(() => {
        router.push(href);
      }, NAVIGATION_DELAY_MS);
  }

  const secondaryButtonClasses = [
    "flex min-h-11 w-full items-center justify-center rounded-control",
    "border border-line bg-surface-subtle px-4 text-sm font-medium text-muted",
    "shadow-soft transition-all duration-[var(--duration-fast)] ease-standard",
    "hover:border-line-strong hover:bg-surface-muted hover:text-ink",
    isNavigating
      ? "pointer-events-none opacity-60"
      : "",
  ].join(" ");

  const primaryButtonClasses = [
    "flex min-h-11 w-full items-center justify-center rounded-control",
    "bg-accent px-4 text-sm font-medium text-accent-foreground",
    "shadow-soft transition-all duration-[var(--duration-fast)] ease-standard",
    "hover:bg-accent-hover hover:shadow-raised",
    isNavigating
      ? "pointer-events-none opacity-60"
      : "",
  ].join(" ");

  const doorContent = (
    <>
      <div className="pr-5">
        <div className="relative rounded-[1.4rem] border border-line bg-[#f8f8f3] px-5 pb-5 pt-7">
          <span
            aria-hidden="true"
            className="absolute left-4 top-4 size-2 rounded-full bg-accent/70"
          />

          <span
            aria-hidden="true"
            className="absolute right-4 top-4 size-2 rounded-full bg-accent/70"
          />

          <div className="text-center">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-light">
              Home inventory
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-ink">
              MyKitchen
            </h1>

            <p className="mx-auto mt-3 max-w-[240px] text-sm leading-6 text-muted">
              Your fridge, freezer, and pantry
              at a glance.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2.5 pr-5">
        {!isSignedIn ? (
          <>
            <Link
              href="/sign-in"
              onClick={(event) =>
                handleNavigation(
                  event,
                  "/sign-in",
                  "fridge"
                )
              }
              className={
                secondaryButtonClasses
              }
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              onClick={(event) =>
                handleNavigation(
                  event,
                  "/sign-up",
                  "fridge"
                )
              }
              className={
                primaryButtonClasses
              }
            >
              Create account
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            onClick={(event) =>
              handleNavigation(
                event,
                "/dashboard",
                "fridge"
              )
            }
            className={
              primaryButtonClasses
            }
          >
            Open dashboard
          </Link>
        )}
      </div>
    </>
  );

  const freezerContent = (
    <div className="pr-3">
      <Link
        href="/guest"
        onClick={(event) =>
          handleNavigation(
            event,
            "/guest",
            "freezer"
          )
        }
        className={[
          "flex min-h-11 w-full items-center justify-center rounded-control",
          "border border-line-strong bg-surface px-4 text-sm font-medium text-muted",
          "shadow-soft transition-all duration-[var(--duration-fast)] ease-standard",
          "hover:border-accent/40 hover:bg-accent-soft hover:text-accent-active hover:shadow-raised",
          isNavigating
            ? "pointer-events-none opacity-60"
            : "",
        ].join(" ")}
      >
        View guest demo
      </Link>
    </div>
  );

  const isFridgeOpen =
    animationTarget === "fridge";

  const isFreezerOpen =
    animationTarget === "freezer";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#eef0ea] px-5 py-6 text-ink">
      {isSignedIn ? (
        <div className="absolute right-5 top-5 z-30 sm:right-8 sm:top-7">
          <UserButton />
        </div>
      ) : null}

      <div className="relative flex w-full max-w-2xl flex-col items-center">
        <FridgeIllustration
          isFridgeOpen={isFridgeOpen}
          isFreezerOpen={isFreezerOpen}
          doorContent={doorContent}
          freezerContent={freezerContent}
        />

        <div className="-mt-7 text-center sm:-mt-9">
          {isNavigating ? (
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-success"
              />

              {isFreezerOpen
                ? "Opening guest preview"
                : "Opening your kitchen"}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-light">
            <span>Fridge</span>

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-line-strong"
            />

            <span>Freezer</span>

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-line-strong"
            />

            <span>Pantry</span>
          </div>
        </div>
      </div>
    </main>
  );
}

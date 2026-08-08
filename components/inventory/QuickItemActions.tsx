"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PendingAction =
  | "increase"
  | "decrease"
  | "mark_opened"
  | null;

type QuickItemActionsProps = {
  itemId: string;
  itemName: string;
  quantity: number;
  openedDate: string | null;
};

function getTodayDateOnly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateQuantity(
  quantity: number,
  change: number
) {
  const nextQuantity = quantity + change;

  return Math.max(
    0,
    Number(nextQuantity.toFixed(2))
  );
}

function LoadingIndicator() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 animate-spin motion-reduce:animate-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-20"
      />
      <path
        d="M20 12A8 8 0 0 0 12 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function QuickItemActions({
  itemId,
  itemName,
  quantity,
  openedDate,
}: QuickItemActionsProps) {
  const router = useRouter();

  const [pendingAction, setPendingAction] =
    useState<PendingAction>(null);

  const [error, setError] = useState<
    string | null
  >(null);

  const isUpdating =
    pendingAction !== null;

  async function updateItem(
    action: Exclude<PendingAction, null>,
    body: Record<string, unknown>
  ) {
    setPendingAction(action);
    setError(null);

    try {
      const response = await fetch(
        `/api/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          data?.error?.message ??
            "Unable to update the item."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Quick item update failed:",
        error
      );

      setError(
        "Unable to update the item. Please try again."
      );
    } finally {
      setPendingAction(null);
    }
  }

  function changeQuantity(change: number) {
    const nextQuantity =
      calculateQuantity(quantity, change);

    const action =
      change > 0
        ? "increase"
        : "decrease";

    void updateItem(action, {
      quantity: nextQuantity,
    });
  }

  function markOpened() {
    void updateItem("mark_opened", {
      openedDate: getTodayDateOnly(),
    });
  }

  const statusMessage =
    pendingAction === "increase"
      ? `Increasing ${itemName} quantity.`
      : pendingAction === "decrease"
        ? `Decreasing ${itemName} quantity.`
        : pendingAction === "mark_opened"
          ? `Marking ${itemName} as opened.`
          : "";

  return (
    <div className="min-w-0">
      <div
        role="group"
        aria-label={`Quick actions for ${itemName}. Current quantity ${quantity}.`}
        aria-busy={isUpdating}
        className="flex items-center gap-2"
      >
        <div className="inline-flex shrink-0 overflow-hidden rounded-control border border-line bg-surface">
          <button
            type="button"
            onClick={() =>
              changeQuantity(-1)
            }
            disabled={
              isUpdating || quantity <= 0
            }
            aria-label={`Decrease ${itemName} quantity`}
            className="flex size-11 items-center justify-center border-r border-line text-lg font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pendingAction === "decrease" ? (
              <LoadingIndicator />
            ) : (
              <span aria-hidden="true">−</span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              changeQuantity(1)
            }
            disabled={isUpdating}
            aria-label={`Increase ${itemName} quantity`}
            className="flex size-11 items-center justify-center text-lg font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-surface-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pendingAction === "increase" ? (
              <LoadingIndicator />
            ) : (
              <span aria-hidden="true">+</span>
            )}
          </button>
        </div>

        {openedDate ? (
          <span className="inline-flex min-h-11 min-w-[4.75rem] shrink-0 items-center justify-center gap-1.5 rounded-control border border-success/15 bg-success-soft px-2.5 text-xs font-semibold text-success">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-3.5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12.5L10 16.5L18 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Opened
          </span>
        ) : (
          <button
            type="button"
            onClick={markOpened}
            disabled={isUpdating}
            aria-label={`Mark ${itemName} as opened`}
            title="Mark opened"
            className="inline-flex min-h-11 min-w-[4.75rem] shrink-0 items-center justify-center gap-1.5 rounded-control border border-line bg-surface px-2.5 text-xs font-semibold text-muted transition-colors duration-[var(--duration-fast)] ease-standard hover:border-line-strong hover:bg-surface-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingAction ===
            "mark_opened" ? (
              <>
                <LoadingIndicator />
                <span>Saving</span>
              </>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <span>Open</span>
              </>
            )}
          </button>
        )}
      </div>

      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </span>

      {error ? (
        <p
          role="alert"
          className="mt-2 max-w-56 text-xs text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

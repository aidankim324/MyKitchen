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
    <div className="mt-3">
      <div
        role="group"
        aria-label={`Quantity controls for ${itemName}. Current quantity ${quantity}.`}
        aria-busy={isUpdating}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="inline-flex overflow-hidden rounded-xl border border-gray-300 bg-white">
          <button
            type="button"
            onClick={() =>
              changeQuantity(-1)
            }
            disabled={
              isUpdating || quantity <= 0
            }
            aria-label={`Decrease ${itemName} quantity`}
            className="flex size-11 items-center justify-center border-r border-gray-300 text-xl font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">−</span>
          </button>

          <button
            type="button"
            onClick={() =>
              changeQuantity(1)
            }
            disabled={isUpdating}
            aria-label={`Increase ${itemName} quantity`}
            className="flex size-11 items-center justify-center text-xl font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        {!openedDate ? (
          <button
            type="button"
            onClick={markOpened}
            disabled={isUpdating}
            className="inline-flex min-h-11 items-center rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingAction ===
            "mark_opened"
              ? "Updating..."
              : "Mark opened"}
          </button>
        ) : null}

        {pendingAction === "increase" ||
        pendingAction === "decrease" ? (
          <span
            aria-hidden="true"
            className="text-sm text-gray-600"
          >
            Updating...
          </span>
        ) : null}
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
          className="mt-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

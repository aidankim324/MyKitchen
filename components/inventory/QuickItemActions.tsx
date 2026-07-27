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
  const month = String(now.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(now.getDate()).padStart(2, "0");

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

  const isUpdating = pendingAction !== null;

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
            "Content-Type": "application/json",
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
    const nextQuantity = calculateQuantity(
      quantity,
      change
    );

    const action =
      change > 0 ? "increase" : "decrease";

    void updateItem(action, {
      quantity: nextQuantity,
    });
  }

  function markOpened() {
    void updateItem("mark_opened", {
      openedDate: getTodayDateOnly(),
    });
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="inline-flex overflow-hidden rounded-lg border bg-white"
          aria-label={`Quantity controls for ${itemName}`}
        >
          <button
            type="button"
            onClick={() => changeQuantity(-1)}
            disabled={isUpdating || quantity <= 0}
            aria-label={`Decrease ${itemName} quantity`}
            className="flex size-9 items-center justify-center border-r text-lg font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <button
            type="button"
            onClick={() => changeQuantity(1)}
            disabled={isUpdating}
            aria-label={`Increase ${itemName} quantity`}
            className="flex size-9 items-center justify-center text-lg font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>

        {!openedDate ? (
          <button
            type="button"
            onClick={markOpened}
            disabled={isUpdating}
            className="min-h-9 rounded-lg border bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingAction === "mark_opened"
              ? "Updating..."
              : "Mark opened"}
          </button>
        ) : null}

        {pendingAction === "increase" ||
        pendingAction === "decrease" ? (
          <span className="text-xs text-gray-500">
            Updating...
          </span>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-2 text-xs text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteItemButtonProps = {
  itemId: string;
  itemName: string;
};

export function DeleteItemButton({
  itemId,
  itemName,
}: DeleteItemButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${itemName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          data?.error?.message ??
            "Unable to delete the item."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Delete item failed:",
        error
      );

      setError(
        "Unable to delete the item. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div aria-busy={isDeleting}>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting
          ? "Deleting..."
          : "Delete"}
      </button>

      {error ? (
        <p
          role="alert"
          className="mt-2 max-w-56 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

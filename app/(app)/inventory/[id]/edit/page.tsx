import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ItemForm } from "@/components/inventory/ItemForm";
import { getKitchenItemForUser } from "@/lib/items/queries";
import { z } from "zod";

type EditInventoryItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const itemIdSchema = z.string().uuid();

export default async function EditInventoryItemPage({
  params,
}: EditInventoryItemPageProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const { id } = await params;
  const parsedId = itemIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const item = await getKitchenItemForUser(parsedId.data, userId);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <Link href="/inventory" className="text-sm text-gray-600 hover:text-black">
          ← Back to inventory
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">Edit item</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update this kitchen inventory item.
        </p>
      </div>

      <ItemForm mode="edit" initialItem={item} />
    </main>
  );
}

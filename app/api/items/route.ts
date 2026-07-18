import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  internalServerErrorResponse,
  readJsonBody,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api/errors";
import {
  createKitchenItemForUser,
  getKitchenItemsForUser,
} from "@/lib/items/queries";
import { createKitchenItemSchema } from "@/validations/item";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return unauthorizedResponse();
    }

    const items = await getKitchenItemsForUser(userId);

    return NextResponse.json({
      items,
    });
  } catch (error) {
    console.error("GET /api/items failed:", error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return unauthorizedResponse();
    }

    const body = await readJsonBody(request);

    if (!body.ok) {
      return body.response;
    }

    const parsed = createKitchenItemSchema.safeParse(body.data);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      return validationErrorResponse(
        flattened.fieldErrors,
        flattened.formErrors,
        "Invalid item data."
      );
    }

    const item = await createKitchenItemForUser(userId, parsed.data);

    return NextResponse.json(
      {
        item,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/items failed:", error);
    return internalServerErrorResponse();
  }
}

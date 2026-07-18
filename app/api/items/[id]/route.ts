import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  deleteKitchenItemForUser,
  getKitchenItemForUser,
  updateKitchenItemForUser,
} from "@/lib/items/queries";
import {
  internalServerErrorResponse,
  notFoundResponse,
  readJsonBody,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api/errors";
import { updateKitchenItemSchema } from "@/validations/item";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const itemIdSchema = z.string().uuid("Invalid item id.");

async function getValidatedItemId(params: RouteContext["params"]) {
  const { id } = await params;
  const parsed = itemIdSchema.safeParse(id);

  if (!parsed.success) {
    return {
      ok: false as const,
      response: validationErrorResponse(
        {
          id: ["Invalid item id."],
        },
        [],
        "Invalid route parameter."
      ),
    };
  }

  return {
    ok: true as const,
    id: parsed.data,
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return unauthorizedResponse();
    }

    const validated = await getValidatedItemId(params);

    if (!validated.ok) {
      return validated.response;
    }

    const item = await getKitchenItemForUser(validated.id, userId);

    if (!item) {
      return notFoundResponse();
    }

    return NextResponse.json({
      item,
    });
  } catch (error) {
    console.error("GET /api/items/[id] failed:", error);
    return internalServerErrorResponse();
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return unauthorizedResponse();
    }

    const validated = await getValidatedItemId(params);

    if (!validated.ok) {
      return validated.response;
    }

    const body = await readJsonBody(request);

    if (!body.ok) {
      return body.response;
    }

    const parsed = updateKitchenItemSchema.safeParse(body.data);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      return validationErrorResponse(
        flattened.fieldErrors,
        flattened.formErrors,
        "Invalid item data."
      );
    }

    const item = await updateKitchenItemForUser(
      validated.id,
      userId,
      parsed.data
    );

    if (!item) {
      return notFoundResponse();
    }

    return NextResponse.json({
      item,
    });
  } catch (error) {
    console.error("PATCH /api/items/[id] failed:", error);
    return internalServerErrorResponse();
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return unauthorizedResponse();
    }

    const validated = await getValidatedItemId(params);

    if (!validated.ok) {
      return validated.response;
    }

    const deleted = await deleteKitchenItemForUser(validated.id, userId);

    if (!deleted) {
      return notFoundResponse();
    }

    return NextResponse.json({
      deleted: true,
      id: validated.id,
    });
  } catch (error) {
    console.error("DELETE /api/items/[id] failed:", error);
    return internalServerErrorResponse();
  }
}

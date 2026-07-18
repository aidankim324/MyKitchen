import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };
};

export function apiErrorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  options?: {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  }
) {
  const body: ApiErrorResponse = {
    error: {
      code,
      message,
    },
  };

  if (options?.fieldErrors) {
    body.error.fieldErrors = options.fieldErrors;
  }

  if (options?.formErrors) {
    body.error.formErrors = options.formErrors;
  }

  return NextResponse.json(body, { status });
}

export function unauthorizedResponse() {
  return apiErrorResponse(
    "UNAUTHORIZED",
    "You must be signed in to perform this action.",
    401
  );
}

export function notFoundResponse() {
  return apiErrorResponse("NOT_FOUND", "Item not found.", 404);
}

export function validationErrorResponse(
  fieldErrors: Record<string, string[]>,
  formErrors: string[] = [],
  message = "Invalid request."
) {
  return apiErrorResponse("VALIDATION_ERROR", message, 400, {
    fieldErrors,
    formErrors,
  });
}

export function invalidJsonResponse() {
  return apiErrorResponse(
    "VALIDATION_ERROR",
    "Request body must be valid JSON.",
    400
  );
}

export function internalServerErrorResponse() {
  return apiErrorResponse(
    "INTERNAL_SERVER_ERROR",
    "Something went wrong.",
    500
  );
}

export async function readJsonBody(
  request: Request
): Promise<
  | {
      ok: true;
      data: unknown;
    }
  | {
      ok: false;
      response: NextResponse<ApiErrorResponse>;
    }
> {
  try {
    return {
      ok: true,
      data: await request.json(),
    };
  } catch {
    return {
      ok: false,
      response: invalidJsonResponse(),
    };
  }
}

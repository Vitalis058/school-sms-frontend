/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { API_URL } from "@/constants/apiUrl";
import {
  ParentsEnrollmentSchema,
  ParentsEnrollmentType,
} from "@/utils/validation";

type PrevState = {
  message?: string;
  errors?: Record<string, string[]>;
};
export async function createParentAction(
  prevState: PrevState,
  data: ParentsEnrollmentType
): Promise<PrevState> {
  try {
    const validatedFields = ParentsEnrollmentSchema.safeParse(data);

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "validation failed",
        errors: errors,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/parents`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const res = await response.json();

    if (!response.ok) {
      return {
        errors: {
          error: [
            res.message || "something went wrong when creating the parent",
          ],
        },
      };
    }

    return {
      message: "parent created successfully",
    };
  } catch (error: any) {
    return {
      errors: { error: [error.message || "internals server error"] },
    };
  }
}

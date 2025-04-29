/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { API_URL } from "@/constants/apiUrl";
import {
  StudentEnrollmentSchema,
  StudentEnrollmentTypes,
} from "@/utils/validation";

export async function createStudent(
  prevState: { message?: string; errors?: Record<string, string[]> },
  data: StudentEnrollmentTypes
): Promise<{
  message?: string;
  errors?: Record<string, string[]>;
}> {
  try {
    const validatedFields = StudentEnrollmentSchema.safeParse(data);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "validation failed",
        errors: errors,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const res = await response.json();

    if (!response.ok) {
      return {
        errors: {
          error: [res.message || "Error occurred while creating student"],
        },
      };
    }

    return {
      message: "student created successfully",
    };
  } catch (error: any) {
    return {
      errors: {
        error: [error.message || "Error occurred while creating student"],
      },
    };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { API_URL } from "@/constants/apiUrl";
import { GradeCreationSchema } from "@/utils/validation";

type PrevStateTypes = {
  message?: string;
  errors?: Record<string, string[]>;
  newGrade?: [];
};
export async function createGradeAction(
  prevState: PrevStateTypes,
  formData: FormData
): Promise<PrevStateTypes> {
  try {
    const validatedFields = GradeCreationSchema.safeParse({
      name: formData.get("name"),
    });

    console.log(validatedFields.error?.flatten().fieldErrors);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/grades`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: {
          error: [data.message || "error in creating the grade"],
        },
      };
    }

    return {
      message: "Grade created successfully",
      newGrade: data,
    };
  } catch (error: any) {
    console.log(error, "creating grade");
    return {
      errors: {
        error: [error.message || "something went wrong"],
      },
    };
  }
}

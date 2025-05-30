"use server";

import { API_URL } from "@/constants/apiUrl";
import { DepartmentType } from "@/types/types";
import { DepartmentCreationSchema } from "@/utils/validation";

type PrevState = {
  message?: string;
  errors?: Record<string, string[]>;
  newDepartment?: DepartmentType;
  success: boolean;
};
export async function createDepartment(
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  try {
    const validatedFields = DepartmentCreationSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/departments`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: { error: [data.message || "Error in creating the department"] },
        success: false,
      };
    }

    return {
      message: "Department created",
      errors: undefined,
      newDepartment: data.data,
      success: true,
    };
  } catch (error) {
    console.log(error, "creating department");
    return {
      errors: { error: ["internal server error"] },
      success: false,
    };
  }
}

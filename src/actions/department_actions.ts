"use server";

import { API_URL } from "@/constants/apiUrl";
import { DepartmentCreationSchema } from "@/utils/validation";
import { revalidatePath } from "next/cache";

type PrevState = {
  message?: string;
  errors?: Record<string, string[]>;
  // newStream?: {};
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
    console.log(data);

    if (!response.ok) {
      return {
        errors: { error: [data.message || "Error in creating the department"] },
      };
    }

    revalidatePath("/dashboard/staff-management/department");

    return {
      message: "Department created",
      errors: undefined,
    };
  } catch (error) {
    console.log(error, "creating department");
    return {
      errors: { error: ["internal server error"] },
    };
  }
}

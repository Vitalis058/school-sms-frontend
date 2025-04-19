/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { API_URL } from "@/constants/apiUrl";
import { subjectSchema } from "@/utils/validation";
import { revalidatePath } from "next/cache";

type PrevStateTypes = {
  message?: string;
  errors?: Record<string, string[]>;
  newSubject?: any;
};

export async function createSubjectAction(
  prevState: PrevStateTypes,
  formData: FormData,
): Promise<PrevStateTypes> {
  try {
    const validatedFields = subjectSchema.safeParse({
      name: formData.get("name"),
      shortname: formData.get("shortname"),
      subjectCode: formData.get("subjectCode"),
      departmentId: formData.get("department"),
      active: formData.get("active"),
      optional: formData.get("optional"),
      fieldtrips: formData.get("fieldtrips"),
      labRequired: formData.get("labRequired"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/subjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: {
          error: [data.message || "Error creating the subject"],
        },
      };
    }

    revalidatePath("/dashboard/academic/subject");

    return {
      message: "Subject created successfully",
      newSubject: data,
    };
  } catch (error: any) {
    console.error("Error creating subject:", error);
    return {
      errors: {
        error: [error.message || "Something went wrong"],
      },
    };
  }
}

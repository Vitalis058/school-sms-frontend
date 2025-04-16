"use server";

import { API_URL } from "@/constants/apiUrl";
import { StreamCreationSchema } from "@/utils/validation";

type PrevState = {
  message?: string;
  errors?: Record<string, string[]>;
  // newStream?: {};
};
export async function createStreamAction(
  prevState: PrevState,
  formData: FormData
): Promise<PrevState> {
  try {
    const validatedFields = StreamCreationSchema.safeParse({
      name: formData.get("name"),
      teacherId: formData.get("teacherId"),
      gradeId: formData.get("gradeId"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/streams`, {
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
        errors: { error: [data.message || "Error in creating the stream"] },
      };
    }

    return {
      message: "success",
      errors: undefined,
    };
  } catch (error) {
    console.log(error, "creating stream");
    return {
      errors: { error: ["internal server error"] },
    };
  }
}

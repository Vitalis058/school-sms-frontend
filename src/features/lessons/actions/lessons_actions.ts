"use server";

import { API_URL } from "@/constants/apiUrl";
import { lessonSchema } from "@/utils/validation";

type PrevState = {
  message?: string;
  errors?: Record<string, string[]>;
};
export async function createLessonAction(
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  try {
    const validatedFields = lessonSchema.safeParse({
      name: formData.get("name"),
      teacherId: formData.get("teacherId"),
      streamId: formData.get("streamId"),
      subjectId: formData.get("subjectId"),
      description: formData.get("description"),
      timeSlotId: formData.get("timeSlotId"),
      day: formData.get("day"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await fetch(`${API_URL}/api/v1/lessons`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

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

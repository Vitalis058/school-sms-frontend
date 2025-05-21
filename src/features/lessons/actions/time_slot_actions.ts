import { API_URL } from "@/constants/apiUrl";
import { TimeSlotSchema } from "@/utils/validation";

type PrevState = {
  message?: string;
  error?: Record<string, string[]>;
};

export const createTimeSlot = async (
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> => {
  try {
    console.log(typeof formData.get("day"));

    const validatedFields = TimeSlotSchema.safeParse({
      name: formData.get("name"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      day: formData.get("day"),
    });

    console.log(validatedFields.error);

    //check for errors
    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
        message: "",
      };
    }

    //send the data to the api
    const response = await fetch(`${API_URL}/api/v1/time-slot`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    //check the api response
    if (!response.ok) {
      return {
        error: {
          error: [data.message || "error in creating the time slot"],
        },
      };
    }

    return {
      message: "success",
      error: undefined,
    };
  } catch (error) {
    console.log(error, "creating time slot");
    return {
      error: { error: ["internal server error"] },
      message: "",
    };
  }
};

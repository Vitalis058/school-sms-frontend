import { API_URL } from "@/constants/apiUrl";

export const get_time_slots = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/time-slot`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error in fetching the time slots");
    }

    return data;
  } catch (error) {
    console.log(error, "getting time slots");
    throw new Error("something went wrong");
  }
};

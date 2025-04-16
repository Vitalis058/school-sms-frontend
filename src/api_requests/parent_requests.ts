/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/apiUrl";

export async function getParents() {
  try {
    const response = await fetch(`${API_URL}/api/v1/parents`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to Fetch Parent data");
    }

    return data.data;
  } catch (error: any) {
    console.log(error, "get teachers");
    throw new Error("Internal server error");
  }
}

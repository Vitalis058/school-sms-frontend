/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/apiUrl";

export async function getTeachers() {
  try {
    const response = await fetch(`${API_URL}/api/v1/teachers`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching teachers");
    }

    return data;
  } catch (error: any) {
    console.log(error, "get teachers");
    throw new Error("Something went wrong while fetching teachers.");
  }
}

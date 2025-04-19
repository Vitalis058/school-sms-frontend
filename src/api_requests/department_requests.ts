/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/apiUrl";

export async function getDepartments() {
  try {
    const response = await fetch(`${API_URL}/api/v1/departments`);

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || "something went wrong");
    }

    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "internal server error");
  }
}

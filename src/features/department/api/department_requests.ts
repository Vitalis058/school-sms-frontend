/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/apiUrl";

//getting departments
export async function getDepartments() {
  try {
    const response = await fetch(`${API_URL}/api/v1/departments`);

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || "something went wrong");
    }

    return res;
  } catch (error: any) {
    throw new Error(error.message || "internal server error");
  }
}

//get a department
export async function getDepartment(id: string | undefined) {
  if (!id) return;

  try {
    const response = await fetch(`${API_URL}/api/v1/departments/${id}`);

    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message || "internal server error");
  }
}

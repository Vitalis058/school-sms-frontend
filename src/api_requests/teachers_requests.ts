/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/apiUrl";
import axios from "axios";

export async function getTeachers() {
  try {
    const response = await axios.get(`${API_URL}/api/v1/teachers`);
    return response.data;
  } catch (error: any) {
    console.log(error, "get teachers");
    return error.message;
  }
}

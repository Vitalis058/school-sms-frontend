/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/apiUrl";
import axios from "axios";

export async function getStudents() {
  try {
    const response = await axios.get(`${API_URL}/api/v1/students`);
    return response.data;
  } catch (error: any) {
    console.log(error, "get students");
    return error.message;
  }
}

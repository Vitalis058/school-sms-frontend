import { API_URL } from "@/constants/apiUrl";

export async function getGradeStreams(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/v1/streams/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return data;
  } catch (error) {
    console.log(error, "getting grade_streams");
    throw new Error("internal server error");
  }
}

export async function getAllSubjects() {
  try {
    const response = await fetch(`${API_URL}/api/v1/subjects`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return data;
  } catch (error) {
    console.log(error, "getting all subjects");
    throw new Error("internal server error");
  }
}

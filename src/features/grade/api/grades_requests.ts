import { API_URL } from "@/constants/apiUrl";

export async function getGradesData() {
  try {
    const response = await fetch(`${API_URL}/api/v1/grades`, {
      method: "get",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error in getting the grades");
    }

    return data;
  } catch (error) {
    console.log(error, "getting grades");
    throw new Error("something went wrong");
  }
}

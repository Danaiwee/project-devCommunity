import { GetJobParams } from "@/types/action";

import handleError from "../handler/error";

export async function getCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    const result = await response.json();

    if (!result) throw new Error("Failed to fetch countries.");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getJobs(params: GetJobParams) {
  const { query = "developer", filter = "thailand", page = 1 } = params;

  const url = `https://jsearch.p.rapidapi.com/search?query=${query}%20jobs%20in%20${filter}&page=${Number(page)}&num_pages=1&country=us&date_posted=all`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY || "",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!result) throw new Error("Failed to fetch jobs.");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

import { GetPlatformsResponse } from "@/types/platforms";

export const getPlatforms = async ({
  page,
  limit,
}: {
  page?: string;
  limit?: string;
}): Promise<{
  status: number;
  data: GetPlatformsResponse;
}> => {
  const params: Record<string, string> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  const queryString = new URLSearchParams(params).toString();
  const url = `/api/doctor/platforms${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not successful");
  }
  return response.json();
};

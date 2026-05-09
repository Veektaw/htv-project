import {
  GetDoctorPrescriptions,
  GetDoctorPrescriptionsParams,
} from "@/types/prescriptions";

export const getDoctorPrescriptions = async ({
  page = "1",
  limit = "10",
  platform,
  start_date,
  end_date,
}: GetDoctorPrescriptionsParams): Promise<{
  status: number;
  data: GetDoctorPrescriptions;
}> => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform && platform.toLowerCase() !== "all") params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/api/doctor/prescriptions${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not successful");
  }
  return response.json();
};

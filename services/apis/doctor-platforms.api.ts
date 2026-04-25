import { Api } from "./api";
import {
  GetPlatformsParams,
  GetPlatformsResponse,
} from "@/types/doctor-platforms";

export const getPlatformsApi = ({
  page = "1",
  limit = "10",
}: GetPlatformsParams = {}) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;

  const queryString = new URLSearchParams(params).toString();
  const url = `/doctor/platforms/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetPlatformsResponse>(url, true);
};

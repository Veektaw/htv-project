
import { GetPlatformsResponse, Platform, UpdatePlatformParams } from "@/types/platforms";
import { Api } from "./api";

export const getPlatformsApi = (user_id: string) => {
  return Api.get<GetPlatformsResponse>(
    `/admin/${user_id}/platforms`,
    true,
  );
};

export const updatePlatformApi = (data: UpdatePlatformParams) => {
  const { user_id, id, ...payload } = data;
  return Api.patch<Omit<UpdatePlatformParams, "user_id" | "id">, Platform>(
    `/admin/${user_id}/${id}/platforms`,
    payload,
    true,
  );
};
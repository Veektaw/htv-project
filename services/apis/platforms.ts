import {
  GetPlatformsResponse,
  Platform,
  CreatePlatformPayload,
} from "@/types/platforms";
import { Api } from "./api";

export const getPlatformsApi = (user_id: string) => {
  return Api.get<GetPlatformsResponse>(`/admin/${user_id}/platforms/`, true);

};

export const createPlatformApi = (
  userId: string,
  data: CreatePlatformPayload,
) => {
  return Api.post<
    CreatePlatformPayload,
    { message: string; platform: Platform }
  >(`/admin/${userId}/platforms/`, data, true);
};

export const updatePlatformApi = (
  userId: string,
  platformId: string,
  data: Partial<CreatePlatformPayload>,
) => {
  return Api.patch<
    Partial<CreatePlatformPayload>,
    { message: string; platform: Platform }
  >(`/admin/${userId}/${platformId}/platforms/`, data, true);
};

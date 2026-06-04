import {
  GetPlatformsResponse,
  Platform,
  CreatePlatformPayload,
  AdminCreatePlatformPayload,
  AdminCreatePlatformResponse,
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

export const getAllPlatformsApi = () => {
  return Api.get<AdminCreatePlatformResponse[]>(
    `/admin/payments/system/platforms/`,
    true,
  );
};

export const adminCreatePlatformApi = (data: AdminCreatePlatformPayload) => {
  return Api.post<AdminCreatePlatformPayload, AdminCreatePlatformResponse>(
    "/admin/payments/system/platforms/",
    data,
    true,
  );
};

export const adminUpdatePlatformApi = (
  platformId: string,
  data: AdminCreatePlatformPayload,
) => {
  return Api.patch<AdminCreatePlatformPayload, AdminCreatePlatformResponse>(
    `/admin/payments/system/platforms/${platformId}/`,
    data,
    true,
  );
};

export const adminDeletePlatformApi = (platformId: string) => {
  return Api.delete<null, { detail: string }>(
    `/admin/payments/system/platforms/${platformId}/`,
    null,
    true,
  );
};

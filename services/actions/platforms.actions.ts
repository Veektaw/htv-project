"use server";

import { getUser } from "../auth";
import {
  createPlatformApi,
  getPlatformsApi,
  updatePlatformApi,
} from "../apis/platforms.api";
import { getPlatformsApi as getDoctorPlatformsApi } from "../apis/doctor-platforms.api";
import { CreatePlatformPayload } from "@/types/platforms";
import { GetPlatformsParams } from "@/types/doctor-platforms";

export const getPlatformsAction = async () => {
  const user = await getUser();

  if (!user) {
    return { error: true, message: "User session not found", platforms: [] };
  }

  const response = await getPlatformsApi(user.id);
  // console.log({ createPRes: response.body });
  // console.log({ response: response.body }, "this is the response body");

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
      platforms: [],
    };
  }

  return {
    error: false,
    message: "Platforms fetched successfully",
    platforms: response.body.platforms,
  };
};

export const createPlatformAction = async (payload: CreatePlatformPayload) => {
  const user = await getUser();

  if (!user) {
    return { error: true, message: "User session not found" };
  }

  const response = await createPlatformApi(user.id, payload);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "Platform created successfully",
  };
};

export const updatePlatformAction = async (
  platformId: string,
  payload: Partial<CreatePlatformPayload>,
) => {
  const user = await getUser();

  if (!user) {
    return { error: true, message: "User session not found" };
  }

  const response = await updatePlatformApi(user.id, platformId, payload);

  console.log({ updatePRes: response.body });

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "Platform updated successfully",
  };
};

export const getPlatformsActionTwo = async (
  params: GetPlatformsParams = {},
) => {
  try {
    const res = await getDoctorPlatformsApi(params);
    return { data: res, error: null };
  } catch {
    return { data: null, error: "Failed to fetch platforms" };
  }
};

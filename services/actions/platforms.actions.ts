"use server";

import { CreatePlatformPayload } from "@/types/platforms";
import { getUser } from "../auth";
import {
  createPlatformApi,
  getPlatformsApi,
  updatePlatformApi,
} from "../apis/platforms";

export const getPlatformsAction = async () => {
  const user = await getUser();

  if (!user) {
    return { error: true, message: "User session not found", platforms: [] };
  }

  const response = await getPlatformsApi(user.id);
 console.log({ createPRes: response.body });
  console.log({ response: response.body },"this is the response body");

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

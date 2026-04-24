"use server";


import { UpdatePlatformParams } from "@/types/platforms";
import { getUserSession } from "../auth";
import { getPlatformsApi, updatePlatformApi } from "../apis/platforms";

export const getPlatformsAction = async () => {
  const userSession = await getUserSession();
  const user_id = userSession?.data.user.id;

  if (!user_id) {
    return { error: true, message: "User session not found", platforms: [] };
  }

  const response = await getPlatformsApi(user_id);

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

export const updatePlatformAction = async (
  payload: Omit<UpdatePlatformParams, "user_id">,
) => {
  const userSession = await getUserSession();
  const user_id = userSession?.data.user.id;

  if (!user_id) {
    return { error: true, message: "User session not found" };
  }

  const response = await updatePlatformApi({ user_id, ...payload });

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
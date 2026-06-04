"use server";

import { getUser } from "../auth";
import {
  adminCreatePlatformApi,
  adminDeletePlatformApi,
  adminUpdatePlatformApi,
  createPlatformApi,
  updatePlatformApi,
} from "../apis/platforms.api";
import {
  AdminCreatePlatformPayload,
  CreatePlatformPayload,
} from "@/types/platforms";

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

export const adminCreatePlatformAction = async (
  data: AdminCreatePlatformPayload,
) => {
  const response = await adminCreatePlatformApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "Platform created successfully",
    data: response.body,
  };
};

export const adminUpdatePlatformAction = async (
  platformId: string,
  data: AdminCreatePlatformPayload,
) => {
  const response = await adminUpdatePlatformApi(platformId, data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "Platform updated successfully",
    data: response.body,
  };
};

export const adminDeletePlatformAction = async (platformId: string) => {
  const response = await adminDeletePlatformApi(platformId);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "Platform deleted successfully",
  };
};

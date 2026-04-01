"use server";

import { CreateUserPayload, UpdateUserDetailsPayload } from "@/types/users";
import {
  activateUserApi,
  createUserApi,
  deactivateUserApi,
  updateUserApi,
} from "../apis/users.api";

export const createUserAction = async (data: CreateUserPayload) => {
  const response = await createUserApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: response.body.message,
  };
};

export const deactivateUserAction = async (userId: string) => {
  const response = await deactivateUserApi(userId);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "User deactivated sucessfully",
  };
};

export const activateUserAction = async (userId: string) => {
  const response = await activateUserApi(userId);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: response.body.is_deactivated
      ? "User deactivated sucessfully"
      : "User activated sucessfully",
  };
};

export const updateUserAction = async (
  userId: string,
  data: Partial<UpdateUserDetailsPayload>,
) => {
  const response = await updateUserApi(userId, data);


  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: response.body.message,
  };
};

"use server";

import { CreateUserPayload } from "@/types/users";
import {
  activateUserApi,
  createUserApi,
  deactivateUserApi,
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

  console.log({ response: response.body });

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "User activated sucessfully",
  };
};

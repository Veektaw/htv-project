"use server";

import { CreateUserPayload } from "@/types/users";
import { createUserApi } from "../apis/users.api";

export const createUserAction = async (data: CreateUserPayload) => {
  const response = await createUserApi(data);

  // console.log({ response: response.body });

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

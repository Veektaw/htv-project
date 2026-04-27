"use server";

import { getPlatformsApi } from "../apis/doctor-platforms.api";
import { GetPlatformsParams } from "@/types/doctor-platforms";

export const getPlatformsAction = async (params: GetPlatformsParams = {}) => {
  try {
    const res = await getPlatformsApi(params);
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: "Failed to fetch platforms" };
  }
};

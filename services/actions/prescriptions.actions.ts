"use server";

import { getDoctorPrescriptionsApi } from "@/services/apis/prescriptions.api";
import { GetDoctorPrescriptionsParams } from "@/types/prescriptions";

export const getDoctorPrescriptionsAction = async (
  params: GetDoctorPrescriptionsParams,
) => {
  try {
    const res = await getDoctorPrescriptionsApi(params);
    return { data: res, error: null };
  } catch {
    return { data: null, error: "Failed to fetch prescriptions" };
  }
};

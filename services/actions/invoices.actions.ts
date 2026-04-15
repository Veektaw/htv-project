"use server";

import { getAdminInvoicesApi } from "../apis/invoices.api";

export const getAdminInvoicesAction = async (params: {
  page?: string;
  limit?: string;
  doctor_id?: string;
}) => {
  const response = await getAdminInvoicesApi(params);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    data: response.body,
  };
};
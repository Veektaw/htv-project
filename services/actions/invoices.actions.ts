"use server";

import { createManualInvoiceApi } from "../apis/doctor-invoices.api";
import { CreateManualInvoicePayload } from "@/types/invoices";

export const createManualInvoiceAction = async (
  data: CreateManualInvoicePayload,
) => {
  const response = await createManualInvoiceApi(data);

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

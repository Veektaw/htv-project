"use server";

import { createManualInvoiceApi } from "@/services/apis/invoices.api";
import { CreateManualInvoicePayload } from "@/types/invoices";

export const createManualInvoiceAction = async (
  data: CreateManualInvoicePayload,
) => {
  const response = await createManualInvoiceApi({
    user_id: data.userId,
    invoice_id: data.invoiceId,
    date_time: data.dateTime,
  });

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

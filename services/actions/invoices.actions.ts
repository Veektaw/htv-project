"use server";

import { updateInvoiceStatusApi } from "../apis/invoices.api";

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  try {
    const result = await updateInvoiceStatusApi(invoiceId, status);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Failed to update invoice status" };
  }
}
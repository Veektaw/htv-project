"use server";

import { updateInvoiceStatusApi } from "../apis/invoices.api";

export async function updateInvoiceStatus(invoiceId: string, actionType: string, disputeMessage?: string) {
  try {
    const result = await updateInvoiceStatusApi(invoiceId, actionType, disputeMessage);
    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return { success: false, error: result.body.message || "Failed to update invoice status" };
    }
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: "Failed to update invoice status" };

  }
}
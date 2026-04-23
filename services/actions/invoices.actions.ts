"use server";

import { da } from "zod/locales";
import { createManualInvoiceApi } from "../apis/doctor-invoices.api";
import {
  addInvoiceCommentApi,
  getInvoiceCommentsApi,
  updateInvoiceStatusApi,
  resendmailInvoiceApi,
  downloadInvoiceApi,
} from "../apis/invoices.api";
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

export async function updateInvoiceStatus(
  invoiceId: string,
  actionType: string,
  disputeMessage?: string,
) {
  try {
    const result = await updateInvoiceStatusApi(
      invoiceId,
      actionType,
      disputeMessage,
    );
    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return {
        success: false,
        error: result.body.message || "Failed to update invoice status",
      };
    }
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: "Failed to update invoice status" };
  }
}

export async function addInvoiceComment(invoiceId: string, message: string) {
  try {
    const result = await addInvoiceCommentApi(invoiceId, message);
    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return {
        success: false,
        error: result.body.message || "Failed to add comment",
      };
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function getInvoiceComments(invoiceId: string) {
  try {
    const result = await getInvoiceCommentsApi(invoiceId);
    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return {
        success: false,
        error: result.body.message || "Failed to load comments",
      };
    }
  } catch (error) {
    console.error("Error loading invoice comments:", error);
    return { success: false, error: "Failed to load comments" };
  }
}
export const resendInvoiceEmailAction = async (invoiceId: string) => {
  try {
    const response = await resendmailInvoiceApi(invoiceId);
    if (response.ok) {
      return {
        success: true,
        message:  response.body.message || "Invoice email resent successfully",
      };
    } else {
      return {
        success: false,
        error: response.body.message || "Failed to resend invoice email",
      };
    }
  } catch (error) {
    console.error("Error resending invoice email:", error);
    return {
      success: false,
      error: "Failed to resend invoice email",
    };
  }
};
export const downloadInvoiceAction = async (invoiceId: string) => {
  try {
    const response = await downloadInvoiceApi(invoiceId);
    if (response.ok) {
      const blob = new Blob([response.body], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      return {
        success: true,
        message: "Invoice downloaded successfully",
      };
    } else {
      return {
        success: false,
        error: response.body.message || "Failed to download invoice",
      };
    }
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return {
      success: false,
      error: "Failed to download invoice",
    };
  }
}

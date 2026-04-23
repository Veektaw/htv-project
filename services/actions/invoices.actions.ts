"use server";

import { createManualInvoiceApi } from "../apis/doctor-invoices.api";
import {
  addInvoiceCommentApi,
  getInvoiceCommentsApi,
  updateInvoiceStatusApi,
} from "../apis/invoices.api";
import { CreateManualInvoicePayload } from "@/types/invoices";
import {
  addDoctorCommentApi,
  getDoctorCommentsApi,
} from "../apis/doctor-invoices.api";

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

export async function addDoctorComment(
  resourceId: string,
  message: string,
  resourceType: "invoice" | "reconciliation" = "invoice",
) {
  try {
    const result = await addDoctorCommentApi(resourceId, message, resourceType);
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

export async function getDoctorComments(
  resourceId?: string,
  resourceType: "invoice" | "reconciliation" = "invoice",
  page = "1",
  limit = "10",
) {
  try {
    const result = await getDoctorCommentsApi({
      page,
      limit,
      invoice_id: resourceType === "invoice" ? resourceId : undefined,
      reconciliation_id:
        resourceType === "reconciliation" ? resourceId : undefined,
    });

    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return {
        success: false,
        error: result.body.message || "Failed to load comments",
      };
    }
  } catch (error) {
    console.error("Error loading doctor comments:", error);
    return { success: false, error: "Failed to load comments" };
  }
}

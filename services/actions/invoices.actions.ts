"use server";


import {  addDoctorCommentApi, createManualInvoiceApi, getDoctorCommentsApi } from "../apis/doctor-invoices.api";
import {
  addInvoiceCommentApi,
  getInvoiceCommentsApi,
  updateInvoiceStatusApi,
  resendmailInvoiceApi,
} from "../apis/invoices.api";
import { CreateManualInvoicePayload } from "@/types/invoices";
import { getUserSession } from "../auth";


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
    message: "Invoice created successfully",
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
        message:  response.body.message  || "Invoice email resent successfully",
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
  const userSession = await getUserSession();
  const token = userSession?.data.accessToken;

  console.log("Invoice ID:", invoiceId);
  console.log("Token:", token);

  const response = await fetch(
    `${process.env.BASE_URL}/admin/invoices/${invoiceId}/download-pdf/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    },
  );

  console.log("Response status:", response.status);
  console.log("Response ok:", response.ok);
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Error body:", errorText);
    return { error: true, message: "Failed to download invoice" };
  }

  const buffer = await response.arrayBuffer();
  console.log("Buffer size:", buffer.byteLength);

  const base64 = Buffer.from(buffer).toString("base64");
  return { error: false, base64 };
};

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

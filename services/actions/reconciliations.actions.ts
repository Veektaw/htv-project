"use server";

import { addReconciliationCommentApi, getReconciliationCommentsApi, updateReconciliationApi } from "../apis/reconciliations.api";
import { UpdateReconciliationPayload } from "@/types/reconciliations";

export const updateReconciliationAction = async (
  id: string,
  data: UpdateReconciliationPayload,
) => {
  const response = await updateReconciliationApi(id, data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: `Reconciliation ${data.action_type}ed`,
  };
};
export async function addReconciliationComment(reconciliationId: string, message: string) {
  try {
    const result = await addReconciliationCommentApi(reconciliationId, message);
    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return { success: false, error: result.body.message || "Failed to add comment" };
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}
export async function getReconciliationComments(reconciliationId: string) {
  try {
    const result = await getReconciliationCommentsApi(reconciliationId);
    if (result.ok) {
      return { success: true, data: result.body };
    } else {
      return { success: false, error: result.body.message || "Failed to load comments" };
    }
  } catch (error) {
    console.error("Error loading invoice comments:", error);
    return { success: false, error: "Failed to load comments" };
  }
}

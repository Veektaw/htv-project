"use server";

import { updateReconciliationApi } from "../apis/reconciliations.api";
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

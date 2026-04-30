import { ReconciliationCommentsResponse } from "@/types/reconciliations";

export const getReconciliationComments = async (
  reconciliationId: string,
): Promise<{
  status: number;
  data: ReconciliationCommentsResponse;
}> => {
  const url = `/api/admin/reconciliation/${reconciliationId}/comments`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not successful");
  }
  return response.json();
};

import { Api } from "./api";
import {
  AdminCreateReconciliationParams,
  GetDoctorReconciliations,
  GetDoctorReconciliationsParams,
  Reconciliation,
  ReconciliationCommentsResponse,
  UpdateReconciliationPayload,
} from "@/types/reconciliations";

export const getDoctorReconciliationsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
}: GetDoctorReconciliationsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform && platform.toLowerCase() !== "all") params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/doctor/reconciliation/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorReconciliations>(url, true);
};

export const getAllReconciliationsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
  search,
}: GetDoctorReconciliationsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform && platform.toLowerCase() !== "all") params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (search) params.keyword = search;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/reconciliation/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorReconciliations>(url, true);
};

export const updateReconciliationApi = (
  id: string,
  body: UpdateReconciliationPayload,
) => {
  return Api.put<UpdateReconciliationPayload, Reconciliation>(
    `/admin/reconciliation/${id}/`,
    body,
    true,
  );
};

export const addReconciliationCommentApi = (reconciliationId: string, message: string) => {
  const payload = { message, reconciliation_id: reconciliationId };
  return Api.post(
    `/admin/reconciliation/${reconciliationId}/comments/`, 
    payload,
    true
  );
};
export const getReconciliationCommentsApi = (reconciliationId: string) => {
  return Api.get<ReconciliationCommentsResponse>(
    `/admin/reconciliation/${reconciliationId}/comments/`,
    true
  );
};
// export const getReconciliationCommentsApi = (reconciliationId: string) => {
//   return Api.get(
//     `/admin/reconciliation/${reconciliationId}/comments/`, 
//     true
//   );
// };
export const manualReconciliationApi = (data:AdminCreateReconciliationParams) => {
  const { doctor_id ,...payload} = data;
  return Api.post(
    `/admin/reconciliation/${doctor_id}/manual-payment/`,
    payload,
    true
  );
};
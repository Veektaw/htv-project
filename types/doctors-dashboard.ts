export type GetDashboardParams = {
  page?: string;
  limit?: string;
  sort_order?: string;
};

export type GetDashboardResponse = {
  summary: {
    total_prescription_count?: number;
    total_outstanding_count?: number;
    total_paid?: number;
    percentage?: number;
    total_outstanding?: number;
  };
};

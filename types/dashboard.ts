export type DashboardStat = {
  percentage: number;
  current_value: number;
  total_outstanding_count?: number;
};

export type GetDashboardResponse = {
  total_users: DashboardStat;
  total_outstanding: DashboardStat;
};
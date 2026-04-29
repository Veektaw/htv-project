export type DashboardStat = {
  percentage: number;
  current_value: number;
};

export type GetDashboardResponse = {
  total_users: DashboardStat;
  total_outstanding_count: DashboardStat;
  total_outstanding: DashboardStat;
};
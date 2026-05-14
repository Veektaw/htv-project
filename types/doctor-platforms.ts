import { Pagination } from "./users";

export type GetPlatformsParams = {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
};

export type Platform = {
  id: string;
  address: string;
  brand_partner: string;
  external_user_id: string;
  platform: string;
  created_at: string;
  updated_at: string;
};

export type GetPlatformsResponse = Pagination & {
  platforms: Platform[];
};

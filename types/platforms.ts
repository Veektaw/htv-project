export type Platform = {
  id: string;
//   user_id: string;
//   platform: string;
  brand_partner: string;
  address: string;
  platform_account_recipient_email: string;
//   external_user_id: string;
};

export type GetPlatformsResponse = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  platforms: Platform[];
};

export type CreatePlatformPayload = {
//   platform: string;
  brand_partner: string;
//   external_user_id: string;
  platform_account_recipient_email: string;
  address: string;
};

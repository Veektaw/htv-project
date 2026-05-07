export type Platform = {
  id: string;
  brand_partner: string;
  address: string;
  platform_account_recipient_email: string;
};

export type GetPlatformsResponse = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  platforms: Platform[];
};

export type CreatePlatformPayload = {
  brand_partner: string;
  platform_account_recipient_email: string;
  address: string;
};

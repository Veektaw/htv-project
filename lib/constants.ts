import { PlatformSchemaType } from "@/app/_components/admin/settings/schemas";

export const nameTitles = ["Dr.", "Mr.", "Mrs.", "Miss"];

export const languages = [
  {
    name: "English",
    type: "en",
  },
  {
    name: "German (Deutsch)",
    type: "de",
  },
];
export const defaultPlatformValue: PlatformSchemaType = {
  platform: "",
  bill_to_address: "",
  platform_account_recipient_email: "",
};

export const platforms = ["Adyen", "Shopify", "Rxscale"];
export const brandPartners = ["NordLeaf", "Prio One", "SoLean"];

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedSettingsForm, advancedSettingsSchema } from "../schemas";
import { showToast } from "@/lib/toast";
import {
  createPlatformAction,
  updatePlatformAction,
} from "@/services/actions/platforms.actions";
import { CreatePlatformPayload, Platform } from "@/types/platforms";

export const defaultPlatformValues = {
  id: "",
//   platform: "",
  brand_partner: "",
//   external_user_id: "",
  platform_account_recipient_email: "",
  address: "",
};

export default function useUpdateAdvanceSettings({
  platforms,
}: {
  platforms?: Platform[];
}) {
  const { refresh } = useRouter();

  const [canEditAdvanced, setCanEditAdvanced] = useState(false);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);

  const advancedForm = useForm<AdvancedSettingsForm>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues: { platforms: platforms || [] },
  });

  const {
    fields: platformFields,
    append: appendPlatform,
    remove: removePlatform,
  } = useFieldArray({
    control: advancedForm.control,
    name: "platforms",
  });

  const onSubmitAdvanced = async (
    data: { platforms: CreatePlatformPayload[] } | AdvancedSettingsForm,
  ) => {
    try {
      if (data.platforms.length === 0) {
        showToast("At least one platform is required", "error");
        return;
      }

      if (
        data.platforms.length === 1 &&
        "id" in data.platforms[0] &&
        !data.platforms[0].id
      ) {
        const res = await createPlatformAction(data.platforms[0]);

        if (!res.error) {
          refresh();
          setCanEditAdvanced(false);
          advancedForm.reset(data);
          showToast(res.message);
        } else {
          showToast(res.message, "error");
        }

        return;
      }

      const results = await Promise.all(
        (data as AdvancedSettingsForm).platforms.map((platform) =>
          updatePlatformAction(platform.id, {
            // platform: platform.platform,
            // external_user_id: platform.external_user_id,
            brand_partner: platform.brand_partner,
            address: platform.address,
            platform_account_recipient_email:
              platform.platform_account_recipient_email,
          }),
        ),
      );

      const failed = results.find((r) => r.error);
      if (failed) {
        showToast(failed.message, "error");
        console.log("Failed to update platforms:", failed.message);
      } else {
        showToast("Advanced settings updated successfully", "success");
        setCanEditAdvanced(false);
      }
    } catch {
      showToast("An error occurred while saving advanced settings", "error");
    }
  };

  return {
    advancedForm,
    platformFields,
    canEditAdvanced,
    setCanEditAdvanced,
    loadingPlatforms,
    setLoadingPlatforms,
    onSubmitAdvanced,
    appendPlatform,
    removePlatform,
  };
}

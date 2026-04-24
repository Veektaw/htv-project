import {  useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedSettingsForm, advancedSettingsSchema } from "../schemas";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import { updatePlatformAction } from "@/services/actions/platforms.actions";


export default function useUpdateAdvanceSettings() {

     const [canEditAdvanced, setCanEditAdvanced] = useState(false);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);

     const advancedForm = useForm<AdvancedSettingsForm>({
        resolver: zodResolver(advancedSettingsSchema),
        defaultValues: { platforms: [] },
      });
    
      const { fields: platformFields } = useFieldArray({
        control: advancedForm.control,
        name: "platforms",
      });

      const onSubmitAdvanced = async (data: AdvancedSettingsForm) => {
    
    try {
      const results = await Promise.all(
        data.platforms.map((platform) =>
          updatePlatformAction({
            id: platform.id,
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
    }
}       

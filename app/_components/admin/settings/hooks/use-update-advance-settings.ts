import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedSettingsForm, advancedSettingsSchema } from "../schemas";
import { showToast } from "@/lib/toast";
import {
  adminCreatePlatformAction,
  adminDeletePlatformAction,
  adminUpdatePlatformAction,
} from "@/services/actions/platforms.actions";
import { AdminCreatePlatformResponse } from "@/types/platforms";

export const defaultPlatformValues = {
  id: "",
  platform: "",
  brand_partner: "",
  platform_account_recipient_email: "",
  address: "",
};

export default function useUpdateAdvanceSettings({
  platforms,
}: {
  platforms: AdminCreatePlatformResponse[];
}) {
  const { refresh } = useRouter();

  const [pendingPlatformAction, setPendingPlatformAction] = useState<
    string | null
  >(null);

  const advancedForm = useForm<AdvancedSettingsForm>({
    resolver: zodResolver(advancedSettingsSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { platforms: platforms },
  });

  const {
    fields: platformFields,
    append: appendPlatform,
    remove: removePlatform,
  } = useFieldArray({
    control: advancedForm.control,
    name: "platforms",
    keyName: "fieldId",
  });

  const validatePlatforms = (index: number) =>
    advancedForm.trigger(`platforms.${index}`);

  const getPlatformPayload = (index: number) => {
    const platform = advancedForm.getValues(`platforms.${index}`);

    return {
      platform: platform.platform,
      brand_partner: platform.brand_partner,
      platform_account_recipient_email:
        platform.platform_account_recipient_email,
      address: platform.address,
    };
  };

  const createPlatform = async (index: number) => {
    const isValid = await validatePlatforms(index);

    if (!isValid) return;

    try {
      setPendingPlatformAction(`create-${index}`);

      const res = await adminCreatePlatformAction(getPlatformPayload(index));

      if (res.error) {
        showToast(res.message, "error");
        return;
      }

      showToast(res.message);

      if (res.data) {
        advancedForm.setValue(`platforms.${index}`, res.data);
      }

      refresh();
    } catch {
      showToast("An error occurred while creating platform", "error");
    } finally {
      setPendingPlatformAction(null);
    }
  };

  const updatePlatform = async (index: number) => {
    const isValid = await validatePlatforms(index);

    if (!isValid) return;

    const platformId = advancedForm.getValues(`platforms.${index}.id`);

    if (!platformId) {
      showToast("Create this platform before editing it", "error");
      return;
    }

    try {
      setPendingPlatformAction(`update-${platformId}`);

      const res = await adminUpdatePlatformAction(
        platformId,
        getPlatformPayload(index),
      );

      if (res.error) {
        showToast(res.message, "error");
        return;
      }

      showToast(res.message);

      if (res.data) {
        advancedForm.setValue(`platforms.${index}`, res.data);
      }

      refresh();
    } catch {
      showToast("An error occurred while updating platform", "error");
    } finally {
      setPendingPlatformAction(null);
    }
  };

  const deletePlatform = async (index: number) => {
    const platformId = advancedForm.getValues(`platforms.${index}.id`);

    if (!platformId) {
      removePlatform(index);
      return;
    }

    try {
      setPendingPlatformAction(`delete-${platformId}`);

      const res = await adminDeletePlatformAction(platformId);

      if (res.error) {
        showToast(res.message, "error");
        return;
      }

      showToast(res.message);
      removePlatform(index);
      refresh();
    } catch {
      showToast("An error occurred while deleting platform", "error");
    } finally {
      setPendingPlatformAction(null);
    }
  };

  return {
    advancedForm,
    platformFields,
    pendingPlatformAction,
    appendPlatform,
    removePlatform,
    createPlatform,
    updatePlatform,
    deletePlatform,
  };
}

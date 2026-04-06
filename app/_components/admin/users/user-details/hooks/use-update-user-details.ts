import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { updateUserAction } from "@/services/actions/users.actions";
import {
  updateUserDetailsFormSchema,
  UpdateUserDetailsSchemaType,
} from "../../schemas";
import { User } from "@/types/auth";

export const defaultPlatformValue = {
  platform: "",
  brand_partner: "",
  external_user_id: "",
};

export const defaultCommissionValue = {
  platform: "",
  amount_per_prescription: "",
  currency: "EUR",
  scheduled_appointments: false,
  completed_appointments: false,
  cancelled_appointments: false,
  all_prescriptions: false,
  signed_prescriptions: false,
  cancelled_prescriptions: false,
};

type CommissionOptionId =
  | "scheduled_appointments"
  | "completed_appointments"
  | "cancelled_appointments"
  | "all_prescriptions"
  | "signed_prescriptions"
  | "cancelled_prescriptions";

export type CommissionOption = {
  id: CommissionOptionId;
  label: string;
};

export const commissionOptions: CommissionOption[] = [
  {
    label: "Scheduled Appointments",
    id: "scheduled_appointments",
  },
  {
    label: "All Prescriptions",
    id: "all_prescriptions",
  },
  {
    label: "Completed Appointments",
    id: "completed_appointments",
  },
  {
    label: "Signed Prescriptions",
    id: "signed_prescriptions",
  },
  {
    label: "Cancelled Appointments",
    id: "cancelled_appointments",
  },
  {
    label: "Cancelled Prescriptions",
    id: "cancelled_prescriptions",
  },
];

export default function useUpdateUserDetails({
  user,
  setCanEdit,
}: {
  user: User;
  setCanEdit: Dispatch<SetStateAction<boolean>>;
}) {
  const { refresh } = useRouter();

  const form = useForm<UpdateUserDetailsSchemaType>({
    resolver: zodResolver(updateUserDetailsFormSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      title: user.title ? user.title : "",
      phone: user.phone ? user.phone : "",
      role: user.role,
      language_pref: user.language_pref,
      platforms:
        user.platforms.length > 0
          ? user.platforms.map((platform) => ({
              platform: platform.platform,
              brand_partner: platform.brand_partner,
              external_user_id: platform.external_user_id,
            }))
          : [defaultPlatformValue],
      commissions: user.commissions.length
        ? user.commissions.map((commission) => ({
            platform: commission.platform,
            amount_per_prescription:
              commission.amount_per_prescription.toString(),
            currency: commission.currency,
            scheduled_appointments: commission.scheduled_appointments,
            completed_appointments: commission.completed_appointments,
            cancelled_appointments: commission.cancelled_appointments,
            all_prescriptions: commission.all_prescriptions,
            signed_prescriptions: commission.signed_prescriptions,
            cancelled_prescriptions: commission.cancelled_prescriptions,
          }))
        : [defaultCommissionValue],
    },
  });
  const { register, handleSubmit, formState, reset, control } = form;

  const platformFieldsArrayValues = useFieldArray({
    name: "platforms",
    control,
  });

  const commissionFieldsArrayValues = useFieldArray({
    name: "commissions",
    control,
  });

  const onSubmit = async (data: UpdateUserDetailsSchemaType) => {
    let formattedData = {};

    if (
      (data.platforms.length === 1 && data.platforms[0].platform === "") ||
      (data.commissions.length === 1 && data.commissions[0].platform === "")
    ) {
      if (data.platforms[0].platform === "") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { platforms: _, ...rest } = data;

        formattedData = {
          ...rest,
        };
      }

      if (data.commissions[0].platform === "") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { commissions: _, ...rest } = data;

        formattedData = {
          ...rest,
        };
      }

      try {
        const res = await updateUserAction(user.id, formattedData);

        if (!res.error) {
          refresh();
          setCanEdit(false);
          reset(data);
          showToast(res.message);
          reset();
        } else {
          showToast(res.message, "error");
        }
      } catch {
        showToast("Something went wrong", "error");
      }
    } else {
      formattedData = {
        ...data,
        commissions: data.commissions.map((commission) => ({
          ...commission,
          amount_per_prescription: Number.isNaN(
            parseFloat(commission.amount_per_prescription!),
          )
            ? 0
            : parseFloat(commission.amount_per_prescription!),
        })),
      };

      try {
        const res = await updateUserAction(user.id, formattedData);

        if (!res.error) {
          refresh();
          setCanEdit(false);

          reset(data);
          showToast(res.message);
          reset();
        } else {
          showToast(res.message, "error");
        }
      } catch {
        showToast("Something went wrong", "error");
      }
    }
  };

  return {
    form,
    register,
    onSubmit: handleSubmit(onSubmit),
    formState,
    reset,
    platformFieldsArrayValues,
    commissionFieldsArrayValues,
  };
}

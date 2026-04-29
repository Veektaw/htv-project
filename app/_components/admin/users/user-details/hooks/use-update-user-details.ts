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

export const defaultPlatformValues = {
  platform: "",
  brand_partner: "",
  external_user_id: "",
  platform_account_recipient_email: "",
};

export const defaultCommissionValues = {
  platform: "",
  amount_per_prescription: "",
  currency: "EUR",
  scheduled_appointments: false,
  completed_appointments: false,
  cancelled_appointments: false,
  all_prescriptions: false,
  signed_prescriptions: false,
  cancelled_prescriptions: false,
  declined_prescriptions: false,
  on_hold_prescriptions: false,
  approved_prescriptions: false,
};

type CommissionOptionId =
  | "scheduled_appointments"
  | "completed_appointments"
  | "cancelled_appointments"
  | "all_prescriptions"
  | "signed_prescriptions"
  | "cancelled_prescriptions"
  | "declined_prescriptions"
  | "on_hold_prescriptions"
  | "approved_prescriptions";

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
  {
    label: "Declined Prescriptions",
    id: "declined_prescriptions",
  },
  {
    label: "On Hold Prescriptions",
    id: "on_hold_prescriptions",
  },
  {
    label: "Approved Prescriptions",
    id: "approved_prescriptions",
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
      address: user.address ? user.address : "",
      language_pref: user.language_pref,
      platforms:
        user.platforms.length > 0
          ? user.platforms.map((platform) => ({
              platform: platform.platform,
              brand_partner: platform.brand_partner,
              external_user_id: platform.external_user_id,
              platform_account_recipient_email:
                platform.platform_account_recipient_email ?? "",
            }))
          : [defaultPlatformValues],
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
            declined_prescriptions: commission.declined_prescriptions,
            on_hold_prescriptions: commission.on_hold_prescriptions,
            approved_prescriptions: commission.approved_prescriptions,
          }))
        : [defaultCommissionValues],
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

      formattedData = {
        ...formattedData,
        address: user.role === "admin" ? data.address : null,
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
    } else {
      formattedData = {
        ...data,
        address: user.role === "admin" ? data.address : null,
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

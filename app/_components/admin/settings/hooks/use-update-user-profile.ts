import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { updateUserProfileAction } from "@/services/actions/users.actions";
import {
  updateUserProfileFormSchema,
  UpdateUserProfileSchemaType,
} from "../schemas";
import { UserSessionData } from "@/types/auth";

export default function useUpdateUserProfile({
  user,
  setCanEdit,
}: {
  user: UserSessionData;
  setCanEdit: Dispatch<SetStateAction<boolean>>;
}) {
  const { refresh } = useRouter();

  const form = useForm<UpdateUserProfileSchemaType>({
    resolver: zodResolver(updateUserProfileFormSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      title: user.title ? user.title : "",
      phone: user.phone ? user.phone : "",
      company_name: user.company_name,
    },
  });
  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (data: UpdateUserProfileSchemaType) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...rest } = data;
    try {
      const res = await updateUserProfileAction(rest);

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
  };

  return {
    form,
    register,
    onSubmit: handleSubmit(onSubmit),
    formState,
    reset,
  };
}

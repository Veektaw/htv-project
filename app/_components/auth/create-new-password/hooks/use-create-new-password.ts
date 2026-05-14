import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { setNewPasswordAction } from "@/services/actions/auth.actions";
import { setNewPasswordFormSchema, SetNewPasswordSchemaType } from "../schemas";

export default function useCreateNewPassword({
  setIsSuccessful,
}: {
  setIsSuccessful: (val: boolean) => void;
}) {
  const redirectPath = useSearchParams().get("redirect");

  const form = useForm<SetNewPasswordSchemaType>({
    resolver: zodResolver(setNewPasswordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });
  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (data: SetNewPasswordSchemaType) => {
    try {
      const res = await setNewPasswordAction(data);
      if (!res.error) {
        showToast(res.message);
        setIsSuccessful(true);
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
    redirectPath,
  };
}

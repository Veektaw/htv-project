import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { resetPasswordAction } from "@/services/actions/auth.actions";
import { resetPasswordFormSchema, ResetPasswordSchemaType } from "../schemas";

export default function useResetPassword() {
  const token = useSearchParams().get("token");

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    try {
      const res = await resetPasswordAction({ token: token!, ...data });
      if (!res.error) {
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

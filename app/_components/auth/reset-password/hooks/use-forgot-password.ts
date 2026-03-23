import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { forgotPasswordAction } from "@/services/actions/auth.actions";
import { forgotPasswordFormSchema, ForgotPasswordSchemaType } from "../schemas";

export default function useForgotPassword({
  setEmail,
  setIsSuccessful,
}: {
  setEmail: (val: string) => void;
  setIsSuccessful: (val: boolean) => void;
}) {
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      const res = await forgotPasswordAction(data);
      if (!res.error) {
        setEmail(data.email);
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
  };
}

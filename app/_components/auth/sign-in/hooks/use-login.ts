import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginSchemaType } from "../schemas";
import { showToast } from "@/lib/toast";
import { signInAction } from "@/services/actions/auth.actions";

export default function useLogin() {
  const redirectPath = useSearchParams().get("redirect");
  const { push } = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const res = await signInAction(data);

      if (!res.error) {
        if (res.mustChangePassword) {
          if (redirectPath) {
            push(`/create-new-password?redirect=${redirectPath}`);
          } else {
            push("/create-new-password");
          }
        } else {
          showToast(res.message);
          if (redirectPath) {
            push(redirectPath);
          } else if (res.role === "admin") {
            push("/admin/dashboard");
          } else {
            push("/dashboard");
          }
        }
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

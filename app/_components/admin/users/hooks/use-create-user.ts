import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserFormSchema, CreateUserSchemaType } from "../schemas";
import { showToast } from "@/lib/toast";
import { createUserAction } from "@/services/actions/users.actions";

export default function useCreateUser() {
  const { refresh } = useRouter();

  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      title: "",
      phone: "",
      // role: "",
    },
  });
  const { register, handleSubmit, formState, reset } = form;

  const onSubmit = async (data: CreateUserSchemaType) => {
    try {
      const res = await createUserAction(data);

      if (!res.error) {
        refresh();
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

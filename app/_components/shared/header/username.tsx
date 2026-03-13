import { getUser } from "@/services/auth";

export default async function Username() {
  const user = await getUser();

  return <p className="text-sm font-medium text-black">{user?.full_name}</p>;
}

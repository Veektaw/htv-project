import { redirect } from "next/navigation";
import { logout } from "@/services/auth";

export async function GET() {
  await logout();
  redirect("/sign-in");
}

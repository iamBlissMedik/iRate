import { LoginForm } from "@/features/auth/components";
import { connection } from "next/server";

export default async function LoginPage() {
  await connection();
  return <LoginForm />;
}

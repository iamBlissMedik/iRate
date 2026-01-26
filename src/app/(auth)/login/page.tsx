import { LoginForm } from "@/features/auth";
import { connection } from "next/server";

export default async function LoginPage() {
  await connection();
  return <LoginForm />;
}

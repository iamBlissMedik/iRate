
import LoginForm from "@/components/forms/LoginForm";
import { connection } from "next/server";

export default async function LoginPage() {
  await connection();
  return <LoginForm />;
}

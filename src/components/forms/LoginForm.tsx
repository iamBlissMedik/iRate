"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import InputField from "./InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILoginFormData } from "@/types/formTypes";
import { signInSchema } from "@/lib/validators/authSchemas";
import { useForm } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { ThemeToggle } from "@/components/ThemeToggleButton";
export default function LoginForm() {
  const search = useSearchParams();
  const router = useRouter();
  const callbackUrl = search.get("callbackUrl") ?? "/dashboard";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<ILoginFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#4f053e]">
      <div className="w-full max-w-md space-y-4 border text-center rounded pt-7 pb-14 px-9 bg-white">
      <ThemeToggle />
        <div className="flex justify-center">
          {/* <Image src={""} alt="logo" width={193} height={60} /> */}
        </div>
        <h1 className="text-2xl font-semibold text-[#000000]">Admin Login</h1>
        <form className="space-y-6">
          <InputField
            id="email"
            label="Email"
            register={register}
            error={errors.email}
            placeholder="Enter your email"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="Enter your password"
          />
          <CheckboxField id="remember" label="Remember me" control={control} />
          <Button
            type="submit"
            className="w-full rounded-xl  h-12 text-white bg-secondary-2"
            loading={isSubmitting}
            disabled={!isValid}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

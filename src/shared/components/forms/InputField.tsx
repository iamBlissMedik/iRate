"use client";

import React, { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import type {
  FieldError,
  FieldValues,
  UseFormRegister,
  Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputFieldProps<T extends FieldValues> = {
  id: Path<T>; // 👈 strongly typed Path<T>
  label?: string;
  description?: string;
  register: UseFormRegister<T>;
  error?: FieldError | string | null;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  height?: number | string;
};

export default function InputField<T extends FieldValues>({
  id,
  label,
  register,
  error,
  type = "text",
  placeholder,
  disabled,
  className,
  description,
  height,
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const message =
    typeof error === "string" ? error : (error?.message as string | undefined);

  // Toggle between "text" and "password"
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-1 w-full text-left ">
      {label && (
        <Label
          htmlFor={id}
          className="mb-1 capitalize text-lg font-normal text-foreground"
        >
          {label}
        </Label>
      )}
      {description && (
        <div className="text-secondary text-sm">{description}</div>
      )}

      <div className="relative ">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "focus-visible:ring-secondary-2 focus-visible:ring-1 py-4 ",
            className,
          )}
          style={
            height
              ? { height: typeof height === "number" ? `${height}px` : height }
              : undefined
          }
          {...register(id)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {message && <p className="text-sm text-destructive mt-1">{message}</p>}
    </div>
  );
}

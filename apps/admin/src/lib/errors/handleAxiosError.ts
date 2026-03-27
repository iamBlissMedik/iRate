import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "custom";

interface ErrorHandlerOptions {
  type?: ToastType;
  fallbackMessage?: string;
}

const triggerToast = (type: ToastType, message: string) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "loading":
      toast.loading(message);
      break;
    case "custom":
      toast(message); // basic toast
      break;
    default:
      toast.error(message);
      break;
  }
};

/**
 * Centralized Axios error handler
 * @param error - unknown error object (AxiosError or other)
 * @param options - optional toast type and fallback message
 */
export const handleAxiosError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): void => {
  const { type = "error", fallbackMessage = "An unexpected error occurred" } =
    options;

  // Axios error
  if (error instanceof AxiosError) {
    // Safely type response data
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      fallbackMessage;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      triggerToast("error", "Session expired. Redirecting...");
      signOut({ callbackUrl: "/auth/login", redirect: true });
      return;
    }

    triggerToast(type, errorMessage);
    return;
  }

  // Non-Axios errors
  console.error(error);
  triggerToast(type, fallbackMessage);
};

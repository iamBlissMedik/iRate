/**
 * useLogin Hook
 *
 * Handles user login with React Query
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authApi } from "../api/auth.api";
import type { LoginRequest } from "../api/auth.types";
import { apiClient } from "@/core/api/client";
import { useAppDispatch } from "@/core/store/hooks";
import { setUser, setToken } from "../store/auth.slice";

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),

    onSuccess: (response) => {
      // Store tokens
      apiClient.setTokens(response.accessToken, response.refreshToken);

      // Update Redux state
      dispatch(setUser(response.user));
      dispatch(setToken(response.accessToken));

      toast.success("Login successful! Redirecting...");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    },

    onError: (error: Error) => {
      const message =
        "message" in error && typeof error.message === "string"
          ? error.message
          : "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

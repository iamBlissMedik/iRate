import Axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { env } from "@/core/config/env";

interface RefreshResponse {
  accessToken: string;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = Axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: env.apiTimeout,
});

// Routes that should not trigger refresh
const authExcluded: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

// Attach access token per request
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const session = await getSession();
    const token = session?.user.accessToken as string | undefined;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Idempotency key for mutating operations (fintech safety)
    if (["post", "put", "patch", "delete"].includes(config.method || "")) {
      if (!config.headers["Idempotency-Key"]) {
        config.headers["Idempotency-Key"] =
          `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      }
    }

    return config;
  },
);

// Handle automatic refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Skip refresh logic for auth endpoints
    if (authExcluded.some((route) => originalRequest.url?.includes(route))) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await Axios.post<RefreshResponse>(
        `${env.apiBaseUrl}/auth/refresh`,
        null,
        { withCredentials: true },
      );

      const newAccessToken = refreshResponse.data.accessToken;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      await signOut({ callbackUrl: "/login" });
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;

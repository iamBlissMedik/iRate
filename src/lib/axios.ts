import Axios from "axios";
import { getSession, signOut } from "next-auth/react";

// Extend Session type
type CustomSession = {
  accessToken?: string;
} & NonNullable<Awaited<ReturnType<typeof getSession>>>;

const axiosInstance = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 15000,
});

// Attach access token on every request
axiosInstance.interceptors.request.use(async (config) => {
  const session = (await getSession()) as CustomSession | null;
  const token = session?.accessToken;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle refresh on 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call backend /refresh route
        const { data } = await Axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`,
          null,
          { withCredentials: true }
        );

        const newAccessToken = data?.accessToken;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        await signOut();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

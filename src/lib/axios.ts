import Axios from "axios";
import { getSession } from "next-auth/react";

// Extend Session type to include accessToken
type CustomSession = {
  accessToken?: string;
} & NonNullable<Awaited<ReturnType<typeof getSession>>>;

const axiosInstance = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  withCredentials: true,
  // timeout: 15000,
});

// Attach token on client requests
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const session = (await getSession()) as CustomSession | null;
    const token = session?.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    throw new Error("Failed to get session: " + (e as Error).message);
  }
  return config;
});
export default axiosInstance;

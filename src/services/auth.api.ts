import axios from "@/lib/axios";
import { ILoginRequest, ILoginResponse } from "@/types/auth.types";

// Login
export const login = async (
  payload: ILoginRequest
): Promise<ILoginResponse> => {
  const response = await axios.post<ILoginResponse>("/auth/login", payload);
  return response.data;
};

// Register
// export const register = async (payload): Promise<ILoginResponse> => {
//   const response = await axios.post<ILoginResponse>("/auth/register", payload);
//   return response.data;
// };

// Logout
// export const logout = async (): Promise<void> => {
//   await axios.post("/auth/logout");
// };

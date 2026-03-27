/**
 * Admin Me API
 *
 * API functions for admin profile and authentication
 */

import axios from "@/lib/axios";
import { IAdminResponse } from "../../../types/admin.types";

export const getAdminMe = async () => {
  const response = await axios.get<IAdminResponse>("/admin/me");
  return response.data;
};

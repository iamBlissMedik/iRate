import axios from "@/lib/axios";
import { IAdminResponse } from "../../types/me.types";

export const getAdminMe = async () => {
  const response = await axios.get<IAdminResponse>("/admin/me");
  return response.data;
};

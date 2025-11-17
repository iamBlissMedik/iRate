import { signInSchema } from "@/lib/validators/authSchemas";
import {
  createTicketSchema,
  ticketSchema,
} from "@/lib/validators/ticketSchema";
import z from "zod";

export type ILoginFormData = z.infer<typeof signInSchema>;
export type ICreateTicketFormData = z.infer<typeof createTicketSchema>;
export type ITicketFormData = z.infer<typeof ticketSchema>;

export interface CompanyOption {
  value: string;
  label: string;
  email?: string;
}

export interface Additional {
  page: number;
}

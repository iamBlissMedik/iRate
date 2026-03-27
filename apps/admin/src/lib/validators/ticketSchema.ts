import z from "zod";

export const createTicketSchema = z.object({
  companyName: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable() // allow null but we’ll refine next
    .refine((val) => val !== null, {
      message: "Company name is required",
    }), // 👈 turns object → string
  companyEmail: z.email("Enter a valid email").optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  description: z.string().min(1, "Description is required"),
});
export const ticketSchema = z.object({
  message: z.string().min(1, "Cannot be empty"),
});

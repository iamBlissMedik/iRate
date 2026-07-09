import type { z } from "zod";
import type { signInSchema } from "@/lib/validators/authSchemas";

export type ILoginFormData = z.infer<typeof signInSchema>;

import { z } from "zod";

export const idSchemaValidation = z.object({
  id: z
    .string()
    .min(24, "El ID debe tener 24 caracteres")  
    .max(24, "El ID debe tener 24 caracteres")  
    .regex(/^[0-9a-fA-F]{24}$/, "ID inválido") 
});


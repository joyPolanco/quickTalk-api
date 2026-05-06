
import { z } from "zod";

export const createContactSchema = z.object({
  phone: z
    .string({
      required_error: "El número de teléfono es requerido",
    })
    .regex(
      /^\+[1-9]\d{7,14}$/,
      "Número de teléfono inválido (formato internacional requerido, ej: +18091234567)"
    ),

  saveAs: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(20, "El nombre no puede exceder 20 caracteres")
    .optional(),
}).strict();

export const editContactValidationSchema= z.object({
  saveAs: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(20, "El nombre no puede exceder 20 caracteres")
    .optional(),
}).strict();

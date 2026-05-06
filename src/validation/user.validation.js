import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(6, "El nombre completo debe tener al menos 6 caracteres"),

  email: z.string()
    .min(1, "Se espera el email")
    .regex(/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/, "Email inválido"),
  password: z.string()
    .min(1, "Se espera la contraseña")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
});



export const loginSchema = z.object({
    email: z.string({
      required_error: "Se espera el email"
    }).regex(/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/, "Email inválido"),
    password: z.string({
      required_error: "Se espera la contraseña"
    })
}).strict();



export const updateProfilePictureSchema = z.object({
  profilePic: z.string().optional()
    .refine((val) => {
      if (!val) return true;

      // Validar que sea base64 de imagen
      return val.startsWith("data:image/");
    }, "Debe ser una imagen válida en formato base64")
    .refine((val) => {
      if (!val) return true;

      // Aproximar tamaño base64 (~1.37x del real)
      const sizeInBytes = (val.length * 3) / 4;
      return sizeInBytes <= 5 * 1024 * 1024;
    }, "La imagen no puede exceder los 5MB")
});


export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .max(40, "Máximo 40 caracteres")
    .trim()
    .optional(),

  username: z
    .string()
    .max(12, "Máximo 12 caracteres")
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos")
    .optional(),

  phoneNumber: z
    .string()
    .regex(/^\+\d{8,15}$/, "Debe estar en formato internacional (+123456789)")
    .optional(),
    
  profilePic: z.string().optional()
    .refine((val) => {
      if (!val) return true;

      // Validar que sea base64 de imagen
      return val.startsWith("data:image/");
    }, "Debe ser una imagen válida en formato base64")
    .refine((val) => {
      if (!val) return true;

      // Aproximar tamaño base64 (~1.37x del real)
      const sizeInBytes = (val.length * 3) / 4;
      return sizeInBytes <= 5 * 1024 * 1024;
    }, "La imagen no puede exceder los 5MB")
});

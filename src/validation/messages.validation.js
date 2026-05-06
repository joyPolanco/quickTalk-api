import { z } from "zod";



// Validator Zod para mensajes con varias imágenes

export const messageValidator = z.object({
  message: z.string().optional(),
  images: z
    .array(z.any())
    .optional()
    .refine(
      (files) => !files || files.every(f => f.mimetype.startsWith("image/")),
      { message: "Todos los archivos deben ser imágenes válidas" }
    )
}).refine(
  (data) => data.message?.trim() || (data.images && data.images.length > 0),
  {
    message: "El mensaje debe contener texto, al menos una imagen o ambos",
    path: ["message"]
  }
);
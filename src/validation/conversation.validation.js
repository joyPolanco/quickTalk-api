
import { z } from "zod";

export const getConversationParamsSchema = z.object({
  id: z
    .string()
    .min(24, "El ID debe tener 24 caracteres")  
    .max(24, "El ID debe tener 24 caracteres")  
    .regex(/^[0-9a-fA-F]{24}$/, "ID inválido") 
});



export const createSingleConversationSchema = z.object({
  userId: z.string({
    required_error: "Se espera el ID del usuario",
  }).regex(/^[0-9a-fA-F]{24}$/, "ID de Mongo inválido"),

}).strict();




export const createGroupChatSchema = z.object({
  participants: z
    .array(
      z.string().min(1, "ID de usuario inválido")
    )
    .min(2, "Se requieren al menos 2 participantes"),

  groupName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(15, "El nombre no puede exceder 15 caracteres")
    .optional(),
})
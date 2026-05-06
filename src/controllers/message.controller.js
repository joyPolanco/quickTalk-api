import { getIO } from "../lib/socket.js";
import Message from "../models/Message.js";
import asyncHandler from "express-async-handler";



export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(id);

  if (!message) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }

  if (String(message.sender) !== String(userId)) {
    return res.status(403).json({ error: "No autorizado" });
  }

  message.isDeleted = true;
  message.text = "";
  message.images = [];

  await message.save();

  const io = getIO();

  io.to(message.conversation.toString()).emit("delete-message", {
    messageId: message._id,
  });

  res.json({ success: true });
});
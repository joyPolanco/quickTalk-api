import asyncHandler from "express-async-handler";
import multer from "multer";
import streamifier from "streamifier";
import { z } from "zod";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import { messageValidator } from "../validation/messages.validation.js";
import { getIO } from "../lib/socket.js";
import ChatEvents from "../models/ChatEvents.js";

import crypto from "crypto";




export const getChatPartners = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const chats = await Conversation.aggregate([
    {
      $match: {
        "participants.userId": userId,
      },
    },

    {
      $lookup: {
        from: "users",
        let: { ids: "$participants.userId" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$ids"] },
            },
          },
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              phone: 1,
              profilePic: 1,
            },
          },
        ],
        as: "usersInfo",
      },
    },

{
  $lookup: {
    from: "messages",
    localField: "_id",
    foreignField: "conversation", 
    as: "messages",
  },
},

    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$messages", -1] },
      },
    },

    {
      $project: {
        participants: 1,
        type: 1,
        displayName: 1,
        profilePic: 1,
        usersInfo: 1,
        lastMessage: 1,
        updatedAt: 1,
      },
    },

    {
      $sort: { updatedAt: -1 },
    },
  ]);
  res.status(200).json(chats);
});

export const getConversationMessages = asyncHandler (async (req, res) => {
const conversationId = req.params.id;

const conversation = await Conversation.findById(conversationId);

if (!conversation) {
  
  res.status(404).json({ message: "Conversación no encontrada" });
}

const isParticipant = conversation.participants.some(
  p => p.userId.toString() === req.user._id.toString()
);

if (!isParticipant) {
  const error = new Error("No autorizado");
  error.status = 403;
  console.log(`Acceso denegado: el usuario ${req.user._id}  no es participante de la conversación ${conversationId}`);
  throw error;
}


const messages = await Message.find({
  conversation: conversationId
}).sort({ createdAt: 1 });

return res.status(200).json(messages);
});

export const createConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const currentUser = req.user;

  if (!userId) {
    return res.status(400).json({ message: "userId es requerido" });
  }

  if (userId === currentUser._id.toString()) {
    return res.status(400).json({
      message: "No se puede crear chat consigo mismo",
    });
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [
        { $elemMatch: { userId: currentUser._id } },
        { $elemMatch: { userId } },
      ],
    },
    type: "private",
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [
        { userId: currentUser._id },
        { userId },
      ],
      type: "private",
    });
  }

  const result = await Conversation.aggregate([
    {
      $match: {
        _id: conversation._id,
      },
    },

    {
      $lookup: {
        from: "users",
        let: { ids: "$participants.userId" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$ids"] },
            },
          },
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              phone: 1,
              profilePic: 1,
            },
          },
        ],
        as: "usersInfo",
      },
    },

    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "conversation",
        as: "messages",
      },
    },

    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$messages", -1] },
      },
    },

    {
      $project: {
        participants: 1,
        type: 1,
        groupName: 1,
        groupImage: 1,
        usersInfo: 1,
        lastMessage: 1,
        updatedAt: 1,
      },
    },
  ]);

  return res.status(200).json(result[0]);
});

  export const createGroupChat = asyncHandler(async (req, res) => {
  const { participants, groupName } = req.body;
  const currentUser = req.user;

  if (!participants || !Array.isArray(participants) || participants.length < 1) {
    return res.status(400).json({
      message: "Se requieren al menos 2 participantes",
    });
  }

  const allParticipants = [...new Set([currentUser._id.toString(), ...participants])];

  const users = await User.find({ _id: { $in: allParticipants } });

  if (users.length !== allParticipants.length) {
    return res.status(404).json({
      message: "Uno o más usuarios no existen",
    });
  }

  // Crear grupo
  const newGroup = await Conversation.create({
    participants: allParticipants.map((id) => ({
      userId: id,
    })),
    type: "group",
    displayName: groupName || "Grupo",
    createdByUser: currentUser._id

  });
const chat = await Conversation.aggregate([
  {
    $match: {
      _id: newGroup._id,
    },
  },

  {
    $lookup: {
      from: "users",
      let: { ids: "$participants.userId" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$ids"] },
          },
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            username: 1,
            phone: 1,
            profilePic: 1,
          },
        },
      ],
      as: "usersInfo",
    },
  },

  {
    $lookup: {
      from: "messages",
      localField: "_id",
      foreignField: "conversation",
      as: "messages",
    },
  },

  {
    $addFields: {
      lastMessage: { $arrayElemAt: ["$messages", -1] },
    },
  },

  {
    $project: {
      participants: 1,
      type: 1,
      displayName: 1,
      usersInfo: 1,
      lastMessage: 1,
      updatedAt: 1,
    },
  },
]);

return res.status(201).json(chat[0]);
});



const upload = multer({ storage: multer.memoryStorage() });

// Función helper para subir buffer a Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const sendMessage = [
  upload.array("images", 5),
  asyncHandler(async (req, res) => {
    const conversationId = req.params.id;
    const userId = req.user._id;

    console.log("entro al send message")
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const { message } = req.body;
    const imagesFiles = req.files;

    try {
      messageValidator.parse({ message, images: imagesFiles });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      throw err;
    }

    // 🔹 Subir imágenes
    let imagesUrls = [];

    if (imagesFiles?.length) {
      for (const file of imagesFiles) {
        try {
          const uploadResponse = await uploadFromBuffer(file.buffer);
          imagesUrls.push(uploadResponse.secure_url);
        } catch (err) {
          console.log("Error subiendo imagen:", file.originalname);
        }
      }
    }

    // 🔹 Crear mensaje
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: userId,
      text: message?.trim() || null,
      images: imagesUrls,
    });

    // 🔹 Normalizar
    const formattedMessage = {
      ...newMessage.toObject(),
      sender: userId.toString(),
    };

    const io = getIO();

    io.to(conversationId).emit("new-message", {
      chatId: conversationId,
      message: formattedMessage,
    });

    return res.status(201).json({
      message: "Mensaje enviado correctamente",
      data: formattedMessage,
    });
  }),
];



export const HandleConversationUpdateProfile = async (req, res) => {
  const chatId = req.params.id;
  console.log("update chat")
  if (!chatId) {
    return res.status(400).json({ message: "Falta el ID del chat" });
  }
  console.log("update chat")

  const { displayName } = req.body;
  const file = req.file;

  try {
    let imageUrl = null;

    if (file) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "groups" }
      );
      imageUrl = result.secure_url;
    }

    const conversation = await Conversation.findByIdAndUpdate(
      chatId,
      {
        displayName,
        ...(imageUrl && { profilePic: imageUrl }),
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    const event = await ChatEvents.create({
      type: "update", 
      from: req.user._id,
      to: null, 
      chatId,
    });

    const io = getIO();
    io.to(chatId).emit("user-updated-info", {
      chatId,
      user: req.user,
      displayName,
      profilePic: imageUrl,
    });

    res.status(200).json({ conversation, event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando grupo" });
  }
};


export const generateInviteLink = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Generar el token
  const token = crypto.randomBytes(24).toString("hex");

  // Asegúrate de que el chatId sea válido
  const chat = await Conversation.findById(id);
  if (!chat) {
    return res.status(404).json({ message: "Chat no encontrado" });
  }

  // Actualizar el documento de la conversación con el nuevo token y la fecha de expiración
  chat.inviteLinkToken = token;
  chat.inviteLinkExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

  await chat.save(); // Guardar los cambios

  // Crear el enlace con el token generado
  const link = `https://${process.env.CLIENT_URL}/join?token=${token}`;
  res.json({ link });
});
const getValidInviteChat = async (token) => {
  const chat = await Conversation.findOne({
    inviteLinkToken: token,
  });

  if (!chat) return null;

  if (chat.inviteLinkExpires && chat.inviteLinkExpires < new Date()) {
    return "expired";
  }

  return chat;
};

export const joinByLink = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const userId = req.user._id;

  const chat = await getValidInviteChat(token);

  if (!chat) {
    return res.status(400).json({
      success: false,
      message: "Link inválido",
    });
  }

  if (chat === "expired") {
    return res.status(410).json({
      success: false,
      message: "Link expirado",
    });
  }

  const alreadyInGroup = chat.participants.some(
    (p) => String(p.userId) === String(userId)
  );

  if (!alreadyInGroup) {
    chat.participants.push({ userId });
    await chat.save();

    await ChatEvents.create({
      chatId: chat._id,
      type: "enter",
      from: userId,
    });

    const io = getIO();
    io.to(chat._id.toString()).emit("user-joined-group", {
      chatId: chat._id,
      user: req.user,
    });
  }

  return res.json({
    success: true,
    joined: !alreadyInGroup,
    chat,
  });
});
export const getChatEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const events = await ChatEvents.find({ chatId: id })
    .populate("from", "username phone ")
    .populate("to", " username phone ")
    .sort({ createdAt: 1 });

  res.json(events);
});


export const leaveGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const chat = await Conversation.findById(id);

  chat.participants = chat.participants.filter(
    (p) => String(p.userId) !== String(userId)
  );

  await chat.save();

  await ChatEvents.create({
    chatId:id,
    type: "leave",
    from: userId,
  });

  const io = getIO();

  io.to(id).emit("user-left-group", {
    chatId:id,
    user: req.user,
  });

  res.json({ success: true });
});

export const validateInviteLink = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      valid: false,
      message: "Token requerido",
    });
  }

  const chat = await Conversation.findOne({
    inviteLinkToken: token,
  }).select("displayName type profilePic inviteLinkExpires");

  if (!chat) {
    return res.status(404).json({
      valid: false,
      status: "invalid",
      message: "Link inválido",
    });
  }

  if (chat.inviteLinkExpires && chat.inviteLinkExpires < new Date()) {
    return res.status(410).json({
      valid: false,
      status: "expired",
      message: "El link ha expirado",
    });
  }

  return res.status(200).json({
    valid: true,
    chat: {
      id: chat._id,
      name: chat.displayName,
      type: chat.type,
      profilePic: chat.profilePic,
    },
  });
});
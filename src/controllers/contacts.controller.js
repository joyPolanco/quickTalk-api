import Contacts from "../models/Contacts.js";
import Conversation from "../models/Conversation.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";


export const getAllContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const contacts = await Contacts.find({ requester: userId })
    .populate("recipient", "fullName profilePic email phone username");
  res.status(200).json(contacts);
});

export const createContact = asyncHandler(async (req, res) => {
  const { phone, saveAs } = req.body;
  const userId = req.user._id;

  const userWithNumber = await User.findOne({ phone });

  if (!userWithNumber) {
    return res.status(404).json({
      message: "Número no asociado a una cuenta",
    });
  }

  if (userWithNumber._id.toString() === userId.toString()) {
    return res.status(400).json({
      message: "No puedes agregarte a ti mismo",
    });
  }

  const existingContact = await Contacts.findOne({
    requester: userId,
    recipient: userWithNumber._id,
  });

  if (existingContact) {
    return res.status(409).json({
      message: "Este contacto ya existe",
    });
  }

  await Contacts.create({
    requester: userId,
    recipient: userWithNumber._id,
    saveAs,
  });

  // 👇 traer TODOS los contactos del usuario
  const contacts = await Contacts.find({
    requester: userId,
  }).populate("recipient", "fullName profilePic email phone username");

  res.status(201).json({
    message: "Contacto creado correctamente",
    contacts,
  });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const contact = await Contacts.findOne({
    _id: id,
    requester: userId,
  });

  if (!contact) {
    return res.status(404).json({
      message: "Contacto no encontrado",
    });
  }

  await Contacts.deleteOne({ _id: id });

  res.status(200).json({
    message: "Contacto eliminado correctamente",
  });
});

export const editContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { saveAs } = req.body;
  const userId = req.user._id;

  if(!id) return res.status(400).json({message:"El contacto id es necesario"})
  const contact = await Contacts.findOne({
    _id: id,
    requester: userId,
  });

  if (!contact) {
    return res.status(404).json({
      message: "Contacto no encontrado",
    });
  }

  contact.saveAs = saveAs || contact.saveAs;
  await contact.save();
})

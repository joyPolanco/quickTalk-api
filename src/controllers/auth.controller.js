import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // ajusta la ruta según tu proyecto
import { CLIENT_URL, EXPIRES_IN, JWT_KEY } from "../../config/env.js";
import { GenerateJwtToken, removeAccessToken } from "../../utils/jwt.js";
import { emailQueue } from "../queues/emailQueue.js";
import { tr } from "zod/v4/locales";
import cloudinary from "../lib/cloudinary.js";
import { sanitizeEmail, sanitizeHtml } from "../../utils/StringSanitizer.js";
import admin from "../../config/firebase.js";

export const HandleSignUp = asyncHandler(async (req, res) => {
  const { fullName, email, password ,username} = req.body;

  const cleanName = sanitizeHtml(fullName);
  const cleanEmail = sanitizeEmail(email);
  const cleanUsername = sanitizeHtml(username);

  const userExists = await User.findOne({ email: cleanEmail });

  if (userExists) {
    const error = new Error("Email ya registrado");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: cleanName,
    email: cleanEmail,
    password: hashedPassword,
    username:cleanUsername
  });

  try {
    emailQueue.add({
      email: cleanEmail,
      fullName: cleanName,
      clientUrl: CLIENT_URL,
      handlerName: "welcome",
    });
  } catch (error) {
    console.log("Error al agregar email a la cola", error);
  }

  GenerateJwtToken(user, res);

  res.status(201).json({
    fullName: user.fullName,
    email: user.email,
    id: user._id,
  });
});

export const HandleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    const error = new Error("Correo o contraseña incorrecto");
    error.status = 401;
    throw error;
  }

  const isValidPass = await bcrypt.compare(password, userExists.password);

  if (!isValidPass) {
    const error = new Error("Correo o contraseña incorrecto");
    error.status = 401;
    throw error;
  }

  const accessToken = GenerateJwtToken(userExists,res);

   return res.status(200).json({
    fullName: userExists.fullName,
    profilePic: userExists.profilePic,
    email: userExists.email,
    id: userExists._id,
  });

});

export const HandleLogout = (req, res) => {
  try {
    removeAccessToken(req, res);
  } catch (error) {
    let err = new Error("Error en auth controller, al cerrar sesión");
    err.status = 500;
    throw error;
  }
};

export const HandleUpdateProfileImage = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.id;

    if (!profilePic) {
      return res.status(400).json({ message: "Imagen requerida" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};



export const handleUpdateProfile = async (req, res) => {
  try {
    const { username, fullName, phoneNumber, profilePic } = req.body;
    const userId = req.user.id;

    const updateData = {};


    if (fullName) {
      updateData.fullName = sanitizeHtml(fullName).slice(0, 40);
    }

    if (username) {
      updateData.username = sanitizeHtml(username).slice(0, 12);
    }

    if (phoneNumber) {
      // limpiar caracteres raros (solo números y +)
      const cleanedPhone = phoneNumber.replace(/[^\d+]/g, "");

      updateData.phoneNumber = cleanedPhone;
    }

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "profiles",
      });

      updateData.profilePic = uploadResponse.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No hay datos para actualizar",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in update profile", error);

    res.status(500).json({
      message: "Error updating profile",
    });
  }
};







export const verifyPhone = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Token requerido",
    });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    const { phone_number, uid } = decoded;

    if (!phone_number) {
      return res.status(400).json({
        message: "El token no contiene número telefónico",
      });
    }

    const existingUser = await User.findOne({
      phone: phone_number,
    });

    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({
        message: "Este número ya está registrado en otra cuenta",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        phone: phone_number,
        phoneVerified: true,
        firebaseUid: uid,
        phoneVerifiedAt: new Date(), 
      },
      { new: true }
    ).select("-password"); 

    return res.status(200).json({
      message: "Número verificado correctamente",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error verifyPhone:", error);

    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};
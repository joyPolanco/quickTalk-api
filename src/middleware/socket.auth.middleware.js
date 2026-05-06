import cookie from "cookie";
import { JWT_KEY } from "../../config/env.js";
import User from "../models/User.js";
import  jwt  from "jsonwebtoken";
export const socketAuthMiddleware = async (socket, next) => {
  try {
    //extract token from http-only cookie
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.jwt;

    const decoded = jwt.verify(token, JWT_KEY);
    if (!decoded) {
      console.log("Conexion rechazada");
      return next(new Error("Unauthorized -token inválido"));
    }

  
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    console.log("Socket autenticado para usuario " + user.fullName);

    next();
  } catch (error) {

    console.log("Error en la autenciacion del socket", error)
    next(new Error("Unauthorized, autenticacion fallida"))
  }
};

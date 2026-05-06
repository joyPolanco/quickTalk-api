import jwt from "jsonwebtoken";
import { JWT_KEY } from "../../config/env.js";
import User from "../models/User.js";

 export const authorize = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res.status(401).json({
        message: "Unathorized -No token provided",
      });

    const decoded = jwt.verify(token, JWT_KEY);
    if (!decoded)
      return res.status(401).json({
        message: "Unathorized -Invalid token",
      });

      const user= await User.findById(decoded.id).select("-password")
 

      if(!user) return res.status(404).json({message:"user not found"})
        req.user= user;
        next();
  } catch (error){


    console.log("Error in authorize middleware", error);
    res.status(500).json({message:"Error del servidor"})
  }
};


import jwt from "jsonwebtoken";
import { EXPIRES_IN, JWT_KEY } from "../config/env.js";



export const GenerateJwtToken= (user ,res)=>{
    const accessToken= jwt.sign(
        { id: user._id, email:user.email},
        JWT_KEY,
        {expiresIn:EXPIRES_IN}
    
    
    );
    res.cookie("jwt", accessToken, {
        maxAge: getMaxAgeInMilliseconds(EXPIRES_IN),
        httpOnly: true,
        sameSite: "none",
        secure: true 
    })



}
export const removeAccessToken = (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({ message: "Logout exitoso", success: true });
}



const getMaxAgeInMilliseconds = (expires) => {
  const unit = expires.slice(-1); 
  const amount = parseInt(expires.slice(0, -1)); 

  switch(unit) {
    case 'd':
      return amount * 24 * 60 * 60 * 1000; 
    case 'h':
      return amount * 60 * 60 * 1000; 
    case 'm':
      return amount * 60 * 1000; 
    default:
      throw new Error("Unidad no válida, usar 'd', 'h' o 'm'");
  }
}
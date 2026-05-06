import mongoose from "mongoose";
import { minLength } from "zod";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
      minLength: 6,
    },
    username:   {
      type: String,
      require: false,
      minLength: 1,}
      ,

      phone:{
        type: String,
        require: false,
        minLength:12
      },
    password: {
      type: String,
      require: true,
    },
      profilePic: {
        type: String,
        default: "",
      },
      firebaseuid:{
        type: String,
        require: false,
      },
      phoneverified:{
        type: Boolean,
        default: false,
      }
    
    

  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema)

export default User;
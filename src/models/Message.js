import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],    
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);



export default mongoose.model("Message", messageSchema);
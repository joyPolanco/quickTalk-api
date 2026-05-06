import mongoose from "mongoose";

const chatEventsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["enter", "leave", "delete", "add", "update"],
    },

    // usuario que realiza la acción
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // usuario afectado (solo en algunos casos)
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatEvents = mongoose.model("ChatEvents", chatEventsSchema);

export default ChatEvents;
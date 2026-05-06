import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    saveAs: {
      type: String,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
  },
  { timestamps: true }
);

contactSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("Contact", contactSchema);
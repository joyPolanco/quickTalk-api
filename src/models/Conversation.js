import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
  participants: [
    {
      userId: mongoose.Schema.Types.ObjectId,
    },
   
  ],
  type:{
    type: String,
    enum: ["private", "group"],
    default: "private"
  },

  displayName:{
    type: String,
    required:false,
    min:2,
    max:15,

  },
    profilePic:{
    type: String,
    require:false
  },

  createdByUser:{
    type: mongoose.Types.ObjectId
  },
  inviteLinkToken:{
  type: String,
  require:false,
    default: null,

  } ,
inviteLinkExpires: {
  type: Date,
  default: null,
}


}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);


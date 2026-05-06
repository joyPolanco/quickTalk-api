import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { get } from "mongoose";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
import {
  createConversation,
  createGroupChat,
  getConversationMessages,
  HandleConversationUpdateProfile,
  sendMessage,
  getChatPartners,
  getChatEvents,
  generateInviteLink,
  joinByLink,
  validateInviteLink,
  leaveGroup
} from "../controllers/chats.controller.js";


import { messageValidator } from "../validation/messages.validation.js";
import { authorize } from "../middleware/auth.middleware.js";
import { createGroupChatSchema, createSingleConversationSchema } from "../validation/conversation.validation.js";
const router = Router();
/** */
router.use(authorize);

router.get("/", getChatPartners);

//Conversacion grupal
router.post("/groups", validate(createGroupChatSchema),createGroupChat);

//Conversacion 1;14
router.post("/",validate(createSingleConversationSchema), createConversation);

router.get(
  "/:id/messages",
  getConversationMessages,
);

router.post(
  "/:id/messages",
  sendMessage,
);


router.put(
  "/:id",
   upload.single("profilePic"),
   HandleConversationUpdateProfile
);
router.get(
  "/:id/events",
  getChatEvents,
);

router.get(
  "/:id/invite-link",
  generateInviteLink,
);
router.get("/invite/:token/validate", authorize,validateInviteLink);
router.post("/invite/:token/join", authorize, joinByLink);
router.post("/:id/leave", authorize, leaveGroup);

export default router;

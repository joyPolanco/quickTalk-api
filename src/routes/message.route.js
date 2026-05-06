import { Router  } from "express";
import { deleteMessage } from "../controllers/message.controller.js";
import { authorize } from "../middleware/auth.middleware.js";
const messagesRouter= Router();
/** */
messagesRouter.use(authorize);

messagesRouter.delete("/:id", deleteMessage);



export default messagesRouter;
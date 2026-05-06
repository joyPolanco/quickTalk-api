// app.js
import express from "express";
import { emailQueue } from "./queue.js";
import { PORT } from "../../../config/env.js";

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
    const {email,name,clientUrl,handlerName} = req.body;

    await emailQueue.add({ email,name,clientUrl,handlerName});

    res.status(200).json({ message: "Email en cola, se enviará pronto" });
});

app.listen(PORT, () => console.log("Server corriendo en http://localhost:3000"));
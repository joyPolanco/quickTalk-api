import Queue from "bull";
import { sendWelcomeEmail } from "../../../emails/emailHandlers.js";

console.log("🚀 Worker de email iniciado...");

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: "default",
    password: process.env.REDIS_PASSWORD,
  },
});

emailQueue.on("ready", () => {
  console.log("🟢 Conectado a Redis");
});

emailQueue.on("error", (err) => {
  console.log("🔴 Error en Redis:", err.message);
});

emailQueue.on("waiting", (jobId) => {
  console.log("📩 Job en espera:", jobId);
});

emailQueue.on("active", (job) => {
  console.log("⚙️ Procesando job:", job.id);
});

emailQueue.process(async (job) => {
  const { email, fullName, clientUrl, handlerName } = job.data;

  console.log("📨 Job recibido:", job.data);

  try {
    const handler = getHandlerByName(handlerName);

    if (!handler) {
      throw new Error("Handler no válido");
    }

    await handler(email, fullName, clientUrl);

    console.log("✅ Job procesado:", job.id);

  } catch (err) {
    console.error("❌ Error enviando correo:", err.message);
    throw err;
  }
});

const getHandlerByName = (handlerName) => {
  switch (handlerName) {
    case "welcome":
      return sendWelcomeEmail;
    default:
      return null;
  }
};
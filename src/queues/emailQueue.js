import Queue from "bull";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../../config/env.js";

let emailQueue = null;

if (REDIS_HOST && REDIS_PORT) {
  try {
    emailQueue = new Queue("emailQueue" ,{
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        username: "default",
        password: REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: () => null
      },
    });

    emailQueue.on("error", (err) => {
      console.log("Error en la cola (ignorado):", err.message);
    });
emailQueue.on("waiting", (job) => {
  console.log("🟡 Job en espera:", job);
});

emailQueue.on("active", (job) => {
  console.log("🔵 Procesando job:", job);
});

emailQueue.on("completed", (job, result) => {
  console.log("🟢 Job completado:", job);
});

emailQueue.on("failed", (job, err) => {
  console.log("🔴 Job falló:", job?.id, err.message);
});
  } catch (error) {
    console.log("No se pudo inicializar la cola:", error.message);
    emailQueue = null;
  }
}

export { emailQueue };
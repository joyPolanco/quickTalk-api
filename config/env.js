import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// subir un nivel y entrar a backend
config({
  path: path.join(__dirname, "../.env.development.local")
});


export  const{
PORT,
MONGO_URI,
JWT_KEY,
EXPIRES_IN,
REDIS_HOST,
REDIS_PORT,
REDIS_PASSWORD,
EMAIL_API_KEY,
EMAIL_FROM,
EMAIL_FROM_NAME,
CLIENT_URL,
CLOUD_NAME,
CLOUD_API_KEY,
CLOUD_API_SECRET,
ARCJET_KEY,
ARCJET_MODE,
FIREBASE_API_KEY,
FIREBASE_AUTH_DOMAIN,
FIREBASE_PROJECT_ID,
FIREBASE_STORAGE_BUCKET,
FIREBASE_MESSAGING_SENDER_ID,
FIREBASE_APP_ID,
FIREBASE_MEASUREMENT_ID 



}= process.env;
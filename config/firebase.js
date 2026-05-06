import admin from "firebase-admin";

const serviceAccount = {
  project_id: process.env.FIREBASE_JSON_PROJECT_ID,
  private_key_id: process.env.FIREBASE_JSON_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_JSON_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_JSON_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_JSON_CLIENT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
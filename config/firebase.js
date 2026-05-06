import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("config/firebase.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
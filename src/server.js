import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar Firebase utilizando las variables de entorno
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Reemplazar saltos de línea
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com/",
});

const db = admin.database();
const ref = db.ref("ledState");

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para cambiar el estado del LED
app.post("/api/led/:state", (req, res) => {
  const state = req.params.state;
  ref
    .set(state)
    .then(() => {
      console.log(`LED set to ${state}`);
      res.status(200).send(`LED is turned ${state}`);
    })
    .catch((error) => {
      console.error("Error setting LED state:", error);
      res.status(500).send(error.message);
    });
});

// Endpoint para obtener el estado actual del LED
app.get("/api/led/status", (req, res) => {
  ref
    .once("value")
    .then((snapshot) => {
      console.log("LED status retrieved:", snapshot.val());
      res.send(snapshot.val());
    })
    .catch((error) => {
      console.error("Error getting LED status:", error);
      res.status(500).send(error.message);
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

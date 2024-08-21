import express from "express";
import cors from "cors";
import admin from "firebase-admin";

// Configuración de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert("./firebase-adminsdk.json"),
  databaseURL: "https://iot-patty-default-rtdb.firebaseio.com/",
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
    .set(state) // Actualiza el estado en la base de datos
    .then(() => res.status(200).send(`LED is turned ${state}`))
    .catch((error) => res.status(500).send(error.message));
});

// Endpoint para obtener el estado actual del LED
app.get("/api/led/status", (req, res) => {
  ref
    .once("value")
    .then((snapshot) => res.send(snapshot.val()))
    .catch((error) => res.status(500).send(error.message));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

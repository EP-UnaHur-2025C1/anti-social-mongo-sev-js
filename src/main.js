const express = require("express");
const conectarDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Rutas
const { postImageRoute } = require("./routes");
const { userRoute } = require("./routes");

conectarDB();

app.use(express.json());
//solo para probar
app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/users", userRoute);
app.use("/postimages", postImageRoute);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
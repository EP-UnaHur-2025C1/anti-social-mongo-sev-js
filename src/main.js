const express = require("express");
const conectarDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Rutas
const { 
  userRoute, 
  postRoute,
  tagRoute,
  postImageRoute, 
  followRoute 
} = require("./routes");

conectarDB();

app.use(express.json());

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/tags", tagRoute);
app.use("/postimages", postImageRoute);
app.use("/follows", followRoute);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
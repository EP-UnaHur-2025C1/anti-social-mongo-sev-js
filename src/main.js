const express = require("express");
const conectarDB = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./src/swagger.yml");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Rutas
const {
  userRoute,
  postRoute,
  tagRoute,
  postImageRoute,
  followRoute,
  commentRoute,
} = require("./routes");

conectarDB();

app.use(express.json());

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/tags", tagRoute);
app.use("/postimages", postImageRoute);
app.use("/follows", followRoute);
app.use("/comments", commentRoute);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación Swagger: http://localhost:${PORT}/api-docs`);
});

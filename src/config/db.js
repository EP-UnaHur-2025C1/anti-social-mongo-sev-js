const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL ?? "mongodb://admin:admin123@localhost:27017/antisocial?authSource=admin";

const conectarDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("Error en conectar con MongoDB: ", error.message);
  }
};

module.exports = conectarDB;

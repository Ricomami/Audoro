const mongoose = require("mongoose");

const conectarBD = async () => {
    try {
      await mongoose.connect (process.env.MONGO_URL);
    console.log("✅ Conectado a MongoDB Atlas correctamente");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error);
    process.exit(1); // Detiene la app si falla la conexión
  }
};


const conectarCompass = async () => {
    try {
      await mongoose.connect (process.env.MONGO_LOCAL);
    console.log("✅ Conectado a Mongo Compass correctamente");
  } catch (error) {
    console.error("❌ Error al conectar a Mongo Compass:", error);
    process.exit(1); // Detiene la app si falla la conexión
  }
};

module.exports = {conectarBD, conectarCompass};
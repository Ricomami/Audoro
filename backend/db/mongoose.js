const mongoose = require("mongoose");

const conectarBD = async () => {
    try {
      await mongoose.connect (process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB correctamente");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1); // Detiene la app si falla la conexión
  }
};

module.exports = conectarBD;
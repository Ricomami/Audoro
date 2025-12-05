//MODELO CON MONGOOSE
const mongoose = require("mongoose")

const eventos_artistaSchema = new mongoose.Schema({
    evento_id_sql: {
    type: Number,
    required: true
  },
  artista_id_sql: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['Activo','Inactivo','Pendiente','Archivado'],
    default: 'Activo'
  }
}, { timestamps: true });

eventos_artistaSchema.index({ evento_id: 1, artista_id: 1 }, { unique: true });

module.exports = mongoose.model("Eventos_artista", eventos_artistaSchema);
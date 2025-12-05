//MODELO CON MONGOOSE 
const mongoose = require("mongoose");

const artistaSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    },
    nombre_artista: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    genero: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    imagen_artista: {
        type: String,
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Pendiente', 'Suspendido', 'Archivado'],
        default: 'Activo',
    }
}, { timestamps: true,
    versionKey: false  }); // timestamps crea automáticamente createdAt y updatedAt

module.exports = mongoose.model("Artista", artistaSchema, 'artistas');
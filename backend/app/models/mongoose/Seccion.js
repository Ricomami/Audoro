//MODELO CON MONGOOSE 
const mongoose = require("mongoose");

const seccionSchema = new mongoose.Schema ({
    id_sql:{
        type: Number,
        required: false
    },
    nombre_seccion: {
        type: String, 
        required: true,
        trim: true
    },
    precio_base: {
        type: Number,
        min: [0, "El precio base no puede ser negativo."]
    },
    auditorio_id: {
        type: Number,
        ref: "Auditorio",
        required: true
    },
    imagen_seccion: {
        type: String
    },
    estado: {
        type: String,
        enum:  ['Activo','Inactivo','Pendiente','Archivado'],
        default: 'Activo'
    }
}, {timestamps: true,
    versionKey: false });

module.exports = mongoose.model("Seccion", seccionSchema, 'secciones');
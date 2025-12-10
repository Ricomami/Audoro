//MODELO CON MONGOOSE 
const mongoose = require("mongoose");

const auditorioSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    }, 
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    capacidad: {
        type: Number,
        required: true,
        min: [0, "La capacidad del auditorio no puede ser negativa."]
    },
    direccion: {
        type: String,
        trim: true
    },
    imagen_auditorio: {
        type: String,
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Mantenimiento'],
        default: 'Activo',
    }
}, { timestamps: true,
    versionKey: false  });

module.exports = mongoose.model("Auditorio", auditorioSchema, 'auditorios');
//MODELO CON MONGOOSE 
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    },
    nombre_usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    contraseña: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "La contraseña debe contener al menos 6 caracteres."]
    },
    rol: {
        type: String,
        required: true
    },
    imagen_usuario: {
        type: String,
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Pendiente', 'Suspendido', 'Archivado'],
        default: 'Activo'
    }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", usuarioSchema);

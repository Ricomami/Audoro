//MODELOS CON MONGOOSE
const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido_pat: {
        type: String,
        required: true,
        trim: true
    },
    apellido_mat: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        trim: true,
        match: [/^[\w.-]+@[\w.-]+\.\w+$/, "Correo invalido"]
    },
    telefono: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10,
        match: [/^\d{10}$/, "El teléfono debe teer 10 dígitos."]
    },
    imagen_cliente: {
        type: String
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Suspendido'],
        default: 'Activo'
    },
}, { timestamps: true,
    versionKey: false  });

module.exports = mongoose.model("Cliente", clienteSchema, 'clientes');
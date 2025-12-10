//MODELO CON MONGOOSE
const mongoose = require("mongoose");

const entradaSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    },
    asiento_id: {
        type: Number,
        required: true,
    },
    pago_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pago",
        required: true
    },
    funcion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Funcion",
        required: true
    },
    cliente_id: {
        type: Number,
        required: true
    },
    precio_final: {
        type: Number,
        min: [0, "El precio no puede ser negativo"]
    },
    estado: {
        type: String,
        enum: ['Activo','Inactivo','Pendiente','Archivado'],
        default: 'Activo'
    }
}, {
    timestamps: true,
    versionKey: false 
});

module.exports = mongoose.model("Entrada", entradaSchema, 'entradas');
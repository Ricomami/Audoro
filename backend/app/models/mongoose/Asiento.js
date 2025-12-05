//MODELO CON MONGOOSE
const mongoose = require("mongoose");

const asientoSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    },
    seccion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seccion",
        required: true,
    },
    fila: {
        type: String,
        uppercase: true,
        required: true,
        trim: true,
        minlenght: 1,
        maxlenght: 1,
        match: /^[A-Z]$/,
    },
    numero_asiento: {
        type: Number,
        required: true,
        min: [1, "El número de asiento debe ser mayor a 0"],
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Pendiente'],
        default: 'Activo'
    }
}, { timestamps: true });

module.exports = mongoose.model("Asiento", asientoSchema);

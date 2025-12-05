//MODELO CON MONGOOSE
const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false
    },
    cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },
    metodo_pago: { 
        type: String, 
        required: true,
        trim: true
    },
    monto: {
        type: Number,
        required: true,
        min: [0, "El monto no puede ser negativo"]
    },
    fecha_pago: {
        type: Date,
        validate: {
            validator: function(v) {
                return v <= new Date();
            },
            message: "La fecha de pago no puede ser futura."
        }
    },
    estado: {
        type: String,
        enum: ['Activo','Inactivo','Pendiente','Suspendido','Archivado'],
        default: 'Activo'
    }
}, {timestamps: true});

module.exports = mongoose.model("Pago", pagoSchema);
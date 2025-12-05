//MODELOS CON MONGOOSE 
const mongoose = require("mongoose")

const eventoSchema = new mongoose.Schema({
    id_sql: {
        type: Number,
        required: false // no obligatorio por si solo se inserta a mongo
    },
    nombre_evento: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    imagen_evento: {
        type: String
    },
    fecha: {
        type: Date,
        required: true,
        min: [new Date(), "La fecha no puede ser pasada."]
    },
    hora_fin: {
        type: Date,
        required: true,
    },
    aforo: {
        type: Number,
        min: [0, "El aforo del evento no puede ser negativo."]
    },
    auditorio_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auditorio",
        required: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Pendiente', 'Archivado'],
        default: 'Activo'
    }
}, { timestamps: true,
    versionKey: false  });

module.exports = mongoose.model("Evento", eventoSchema), 'eventos';
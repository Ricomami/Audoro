//MODELO CON MONGOOSE
const mongoose = require("mongoose");

const funcionSchema = mongoose.Schema({
    id_sql: {
        type: Number,
        required: false
    },
    evento_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento", 
        required: true,
    },
    fecha_hora_funcion: {
       type: Date,
       required: true,
        validate: {
            validator: function (v) {
                return v >= new Date();
            },
            message: "La fecha no puede ser pasada."
        }
    },
    estado: {
        type: String,
        enum: ['Activo','Inactivo','Pendiente','Suspendido'],
        default: 'Activo'
    }
},  { timestamps: true,
    versionKey: false });

module.exports = mongoose.model("Funcion", funcionSchema, 'funciones');
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../db/mysql');
const Evento = require('./Evento');

const Funcion = sequelize.define('Funcion', {
    id_funcion: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    evento_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_hora_funcion: { type: DataTypes.DATE, allowNull: false },
    estado: { 
        type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Suspendido'), 
        defaultValue: 'Activo' 
    },
}, {
    tableName: 'funciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación FK con Evento
Funcion.belongsTo(Evento, { foreignKey: 'evento_id' });
Evento.hasMany(Funcion, { foreignKey: 'evento_id' });

module.exports = Funcion;

// //MODELO CON MONGOOSE

// const mongoose = require("mongoose");

// const funcionSchema = mongoose.Schema({
//     evento_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Evento", 
//         required: true,
//     },
//     fecha_hora_funcion: {
//        type: Date,
//        required: true,
//         validate: {
//             validator: function (v) {
//                 return v >= new Date();
//             },
//             message: "La fecha no puede ser pasada."
//         }
//     },
//     estado: {
//         type: String,
//         enum: ['Activo','Inactivo','Pendiente','Suspendido'],
//         default: 'Activo'
//     }
// },  { timestamps: true});

// module.exports = mongoose.model("Funcion", funcionSchema);
// const { DataTypes } = require('sequelize');
// const sequelize = require('../../db/mysql');
// const Auditorio = require('./Auditorio'); // FK hacia auditorio

// const Seccion = sequelize.define('Seccion', {
//     id_seccion: { 
//         type: DataTypes.INTEGER, 
//         autoIncrement: true, 
//         primaryKey: true 
//     },
//     nombre_seccion: { type: DataTypes.STRING(50), allowNull: false },
//     precio_base: { type: DataTypes.DECIMAL(10,2) },
//     auditorio_id: { type: DataTypes.INTEGER, allowNull: false },
//     imagen_seccion: { type: DataTypes.STRING(512) },
//     estado: { 
//         type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Archivado'), 
//         defaultValue: 'Activo' },
// }, {
//     tableName: 'secciones',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
// });

// // Relación FK con Auditorio
// Seccion.belongsTo(Auditorio, { foreignKey: 'auditorio_id' });
// Auditorio.hasMany(Seccion, { foreignKey: 'auditorio_id' });

// module.exports = Seccion;

//MODELO CON MONGOOSE 
const mongoose = require("mongoose");

const seccionSchema = new mongoose.Schema ({
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
        type: mongoose.Schema.Types.ObjectId,
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
}, {timestamps: true});

module.exports = mongoose.model("Seccion", seccionSchema);
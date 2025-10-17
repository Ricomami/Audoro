// const { DataTypes } = require('sequelize');
// const sequelize = require('../../db/mysql');

// const Auditorio = sequelize.define('Auditorio', {
//     id_auditorio: { 
//     type: DataTypes.INTEGER, 
//     autoIncrement: true, 
//     primaryKey: true 
//     },
//     nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
//     capacidad: { type: DataTypes.INTEGER, allowNull: false },
//     direccion: { type: DataTypes.STRING(255) },
//     imagen_auditorio: { type: DataTypes.STRING(512) },
//     estado: { 
//         type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Archivado'), 
//         defaultValue: 'Activo'
//     },
// }, {
//     tableName: 'auditorios',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
// });

// module.exports = Auditorio;

//MODELO CON MONGOOSE 
const mongoose = require("mongoose");

const auditorioSchema = new mongoose.Schema({
  nombre_auditorio: {
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
    enum: ['Activo', 'Inactivo', 'Pendiente','Archivado'],
    default: 'Activo',
  }
}, { timestamps: true });

module.exports = mongoose.model("Auditorio", auditorioSchema);

const { DataTypes } = require('sequelize');
const sequelize = require('../../db/mysql');
const Auditorio = require('./Auditorio');

const Evento = sequelize.define('Evento', {
    id_evento: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nombre_evento: { type: DataTypes.STRING(50), allowNull: false },
    descripcion: { type: DataTypes.STRING(200) },
    imagen_evento: { type: DataTypes.STRING(512) },
    fecha: { type: DataTypes.DATE, allowNull: false },
    hora_fin: { type: DataTypes.DATE, allowNull: false },
    aforo: { type: DataTypes.INTEGER },
    auditorio_id: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Archivado'), defaultValue: 'Activo' },
}, {
    tableName: 'eventos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación FK con Auditorio
Evento.belongsTo(Auditorio, { foreignKey: 'auditorio_id' });
Auditorio.hasMany(Evento, { foreignKey: 'auditorio_id' });

module.exports = Evento;

//MODELOS CON MONGOOSE 

const mongoose = require("mongoose")

const eventoSchema = new mongoose.Schema({
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
        enum: ['Activo','Inactivo','Pendiente','Archivado'],
        default: 'Activo'
    }
}, {timestamps: true});

module.exports = mongoose.model("Evento", eventoSchema);
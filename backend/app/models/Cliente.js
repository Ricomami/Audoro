const { DataTypes } = require('sequelize');
const sequelize = require('../../db/mysql');

const Cliente = sequelize.define('Cliente', {
    id_cliente: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido_pat: { type: DataTypes.STRING(50), allowNull: false },
    apellido_mat: { type: DataTypes.STRING(50) },
    correo: { type: DataTypes.STRING(150) },
    telefono: { type: DataTypes.CHAR(10) },
    imagen_cliente: { type: DataTypes.STRING(512) },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('Activo','Inactivo'), defaultValue: 'Activo' },
    }, {
        tableName: 'clientes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
});

module.exports = Cliente;


//MODELOS CON MONGOOSE
const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nombre_cliente: {
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
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.\w+$/, "Correo invalido"]
    },
    telefono: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10,
        match: [/^\d{10}$/, "El teléfono debe teer 10 dígitos."]
    },
    imagen_cliente:{
        type: String
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Suspendido'],
        default: 'Activo'
    },
    }, { timestamps: true });

module.exports = mongoose.model("Cliente", clienteSchema);
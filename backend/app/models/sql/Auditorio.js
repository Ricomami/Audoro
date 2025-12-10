const { DataTypes } = require('sequelize');
const {sequelize} = require('../../../db/mysql');

const Auditorio = sequelize.define('Auditorio', {
    id_auditorio: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    capacidad: { type: DataTypes.INTEGER, allowNull: false },
    direccion: { type: DataTypes.STRING(255) },
    imagen_auditorio: { type: DataTypes.STRING(512) },
    estado: { 
        type: DataTypes.ENUM('Activo','Inactivo','Mantenimiento'), 
        defaultValue: 'Activo'
    },
}, {
    tableName: 'auditorios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Auditorio;
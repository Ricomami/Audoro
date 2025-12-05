const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/mysql');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_usuario: { type: DataTypes.STRING(100), allowNull: false },
    contraseña: { type: DataTypes.STRING(255), allowNull: false },
    rol: { type: DataTypes.STRING(50), allowNull: false },
    imagen_usuario: { type: DataTypes.STRING(255) },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo', 'Pendiente', 'Suspendido', 'Archivado')
    },
},
    {
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
module.exports = Usuario; 
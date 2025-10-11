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

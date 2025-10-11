const { DataTypes } = require('sequelize');
const sequelize = require('../../db/mysql');
const Auditorio = require('./Auditorio'); // FK hacia auditorio

const Seccion = sequelize.define('Seccion', {
    id_seccion: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nombre_seccion: { type: DataTypes.STRING(50), allowNull: false },
    precio_base: { type: DataTypes.DECIMAL(10,2) },
    auditorio_id: { type: DataTypes.INTEGER, allowNull: false },
    imagen_seccion: { type: DataTypes.STRING(512) },
    estado: { 
        type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Archivado'), 
        defaultValue: 'Activo' },
}, {
    tableName: 'secciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación FK con Auditorio
Seccion.belongsTo(Auditorio, { foreignKey: 'auditorio_id' });
Auditorio.hasMany(Seccion, { foreignKey: 'auditorio_id' });

module.exports = Seccion;

const { DataTypes } = require('sequelize');
const {sequelize} = require('../../../db/mysql');
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
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

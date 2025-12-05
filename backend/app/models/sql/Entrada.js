const { DataTypes } = require('sequelize');
const {sequelize} = require('../../../db/mysql');
const Asiento = require('./Asiento');
const Funcion = require('./Funcion'); // aún falta crear, pero ya preparamos
const Cliente = require('./Cliente');
const Pago = require('./Pago');

const Entrada = sequelize.define('Entrada', {
    id_entrada: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    asiento_id: { type: DataTypes.INTEGER, allowNull: false },
    pago_id: { type: DataTypes.INTEGER, allowNull: false },
    funcion_id: { type: DataTypes.INTEGER, allowNull: false },
    cliente_id: { type: DataTypes.INTEGER, allowNull: false },
    precio_final: { type: DataTypes.DECIMAL(10,2) },
    estado: { 
        type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Archivado'), 
        defaultValue: 'Activo' },
}, {  
    tableName:  'entradas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relaciones FK
Entrada.belongsTo(Asiento, { foreignKey: 'asiento_id' });
Asiento.hasMany(Entrada, { foreignKey: 'asiento_id' });

Entrada.belongsTo(Funcion, { foreignKey: 'funcion_id' });
Funcion.hasMany(Entrada, { foreignKey: 'funcion_id' });

Entrada.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Entrada, { foreignKey: 'cliente_id' });

Entrada.belongsTo(Pago, { foreignKey: 'pago_id' });
Pago.hasMany(Entrada, { foreignKey: 'pago_id' });

module.exports = Entrada;
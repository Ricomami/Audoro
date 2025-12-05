const { DataTypes } = require('sequelize');
const {sequelize} = require('../../db/mysql');
const Cliente = require('./Cliente');

const Pago = sequelize.define('Pago', {
    id_pago: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    cliente_id: { type: DataTypes.INTEGER, allowNull: false },
    metodo_pago: { type: DataTypes.STRING(50), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    fecha_pago: { type: DataTypes.DATE },
    estado: { 
        type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Suspendido','Archivado'), 
        defaultValue: 'Activo' 
    },
}, {
    tableName: 'pagos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación FK con Cliente
Pago.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Pago, { foreignKey: 'cliente_id' });

module.exports = Pago;
// const { DataTypes } = require('sequelize');
// const sequelize = require('../../db/mysql');
// const Cliente = require('./Cliente');

// const Pago = sequelize.define('Pago', {
//     id_pago: { 
//         type: DataTypes.INTEGER, 
//         autoIncrement: true, 
//         primaryKey: true 
//     },
//     cliente_id: { type: DataTypes.INTEGER, allowNull: false },
//     metodo_pago: { type: DataTypes.STRING(50), allowNull: false },
//     monto: { type: DataTypes.DECIMAL(10,2), allowNull: false },
//     fecha_pago: { type: DataTypes.DATE },
//     estado: { 
//         type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Suspendido','Archivado'), 
//         defaultValue: 'Activo' 
//     },
// }, {
//     tableName: 'pagos',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
// });

// // Relación FK con Cliente
// Pago.belongsTo(Cliente, { foreignKey: 'cliente_id' });
// Cliente.hasMany(Pago, { foreignKey: 'cliente_id' });

// module.exports = Pago;

//MODELO CON MONGOOSE

const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
    cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },
    metodo_pago: { 
        type: String, 
        required: true,
        trim: true
    },
    monto: {
        type: Number,
        required: true,
        min: [0, "El monto no puede ser negativo"]
    },
    fecha_pago: {
        type: Date,
        validate: {
            validator: function(v) {
                return v <= new Date();
            },
            message: "La fecha de pago no puede ser futura."
        }
    },
    estado: {
        type: String,
        enum: ['Activo','Inactivo','Pendiente','Suspendido','Archivado'],
        default: 'Activo'
    }
}, {timestamps: true});

module.exports = mongoose.model("Pago", pagoSchema);
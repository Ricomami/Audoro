const { DataTypes } = require('sequelize');
const {sequelize} = require('../../db/mysql');
const Seccion = require('./Seccion'); // lo usaremos para la FK

const Asiento = sequelize.define('Asiento', {
    id_asiento: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    seccion_id: { type: DataTypes.INTEGER, allowNull: false },
    fila: { type: DataTypes.CHAR(1), allowNull: false },
    numero_asiento: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.ENUM('Activo','Inactivo','Pendiente'), defaultValue: 'Activo' },
}, {
    tableName: 'asientos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación FK con Seccion
Asiento.belongsTo(Seccion, { foreignKey: 'seccion_id' });
Seccion.hasMany(Asiento, { foreignKey: 'seccion_id' });

module.exports = Asiento;


// //MODELO CON MONGOOSE
// const mongoose = require("mongoose");

// const asientoSchema = new mongoose.Schema({
//   seccion_id:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Seccion",
//     required: true,
//   },
//   fila:{
//     type: String,
//     uppercase: true,
//     required: true,
//     trim: true,
//     minlenght: 1,
//     maxlenght: 1,
//     match: /^[A-Z]$/,
//   },
//   numero_asiento: {
//     type: Number, 
//     required: true,
//     min: [1, "El número de asiento debe ser mayor a 0"],
//   },
//   estado: { 
//     type: String,
//     enum: ['Activo','Inactivo','Pendiente'],
//     default: 'Activo'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Asiento", asientoSchema);

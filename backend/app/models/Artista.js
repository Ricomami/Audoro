const { DataTypes } = require('sequelize');
const {sequelize} = require('../../db/mysql')

const Artista = sequelize.define('Artista', {
    id_artista: {
        type:DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
    },
    nombre_artista: {type: DataTypes.STRING(100), allowNull: false, unique: true },
    genero: {type:DataTypes.STRING(100), allowNull: false },
    descripcion: {type:DataTypes.STRING(255) },
    imagen_artista: {type:DataTypes.STRING(512) },
    estado: {
        type:DataTypes.ENUM('Activo','Inactivo','Pendiente','Suspendido','Archivado'),
        defaultValue: 'Activo'
    },
}, {
    tableName: 'artistas', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = Artista;

// //MODELO CON MONGOOSE 
// const mongoose = require("mongoose");

// const artistaSchema = new mongoose.Schema({
//   // id_artista: {
//   //   type: Number,
//   //   required: true,
//   //   unique: true
//   // },
//   nombre_artista: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   genero: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   descripcion: {
//     type: String,
//     trim: true,
//   },
//   imagen_artista: {
//     type: String,
//   },
//   estado: {
//     type: String,
//     enum: ['Activo', 'Inactivo', 'Pendiente', 'Suspendido', 'Archivado'],
//     default: 'Activo',
//   }
// }, { timestamps: true }); // timestamps crea automáticamente createdAt y updatedAt

// module.exports = mongoose.model("Artista", artistaSchema);

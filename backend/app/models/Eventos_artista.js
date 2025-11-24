const { DataTypes } = require('sequelize');
const {sequelize} = require('../../db/mysql');
const Evento = require('./Evento');
const Artista = require('./Artista');

const EventosArtistas = sequelize.define('EventosArtistas', {
  evento_id: { type: DataTypes.INTEGER, primaryKey: true },
  artista_id: { type: DataTypes.INTEGER, primaryKey: true },
  estado: { type: DataTypes.ENUM('Activo','Inactivo','Pendiente','Suspendido','Archivado'), defaultValue: 'Activo' },
}, {
  tableName: 'eventos_artistas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relaciones N:M
Evento.belongsToMany(Artista, { through: EventosArtistas, foreignKey: 'evento_id', otherKey: 'artista_id' });
Artista.belongsToMany(Evento, { through: EventosArtistas, foreignKey: 'artista_id', otherKey: 'evento_id' });

module.exports = EventosArtistas;

// //MODELO CON MONGOOSE

// const mongoose = require("mongoose")

// const eventos_artistaSchema = new mongoose.Schema({
//   evento_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Evento", 
//     required: true
//   },
//   artista_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Artista",
//     required: true
//   },
//   estado: {
//     type: String,
//     enum: ['Activo','Inactivo','Pendiente','Archivado'],
//     default: 'Activo'
//   }
// }, { timestamps: true });

// eventos_artistaSchema.index({ evento_id: 1, artista_id: 1 }, { unique: true });

// module.exports = mongoose.model("Eventos_artista", eventos_artistaSchema);
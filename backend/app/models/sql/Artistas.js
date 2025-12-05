const { DataTypes } = require('sequelize');
const {sequelize} = require('../../../db/mysql')

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
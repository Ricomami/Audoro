const { validationResult } = require('express-validator');

// IMPORTACIÓN DE MODELOS
const EventosArtistasSQL = require('../models/sql/Eventos_artista'); 
const EventosArtistasMongo = require('../models/mongoose/Eventos_artista'); // Ruta ajustada

// --- INDEX (Lectura SQL) ---
async function index(req, res) {
    try {
        const relaciones = await EventosArtistasSQL.findAll();
        res.status(200).json({ datos: relaciones });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener relaciones', error: error.message });
    }
}

// --- SHOW (Lectura SQL con Llave Compuesta) ---
async function show(req, res) {
    try {
        const { evento_id, artista_id } = req.params;

        // Búsqueda por ambos IDs
        const relacion = await EventosArtistasSQL.findOne({
            where: { 
                evento_id: evento_id, 
                artista_id: artista_id 
            }
        });

        if (!relacion) {
            return res.status(404).json({ mensaje: 'Relación Evento-Artista no encontrada' });
        }

        res.status(200).json({ datos: relacion });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar relación', error: error.message });
    }
}

// --- STORE (Creación Dual) ---
async function store(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const datos = req.body;

    try {
        // 1. Crear en MySQL
        const nuevaRelacionSQL = await EventosArtistasSQL.create({
            evento_id: datos.evento_id,
            artista_id: datos.artista_id,
            estado: datos.estado
        });

        // 2. Crear en MongoDB (Espejo)
            const nuevaRelacionMongo = await EventosArtistasMongo.create({
            evento_id_sql: datos.evento_id,
            artista_id_sql: datos.artista_id,
            estado: datos.estado
        });

        res.status(200).json({ 
            datos: nuevaRelacionSQL, 
            mongo_data: nuevaRelacionMongo 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la relación.', error: error.message });
    }
}

// --- UPDATE (Actualización Dual) ---
async function update(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    // Obtenemos los IDs "originales" de la URL
    const { evento_id, artista_id } = req.params;
    const datos = req.body;

    try {
        // Buscar registro original en SQL
        const relacionSQL = await EventosArtistasSQL.findOne({
            where: { evento_id: evento_id, artista_id: artista_id }
        });

        if(!relacionSQL) return res.status(404).json({mensaje: "Relación no encontrada"});

        // Actualizar SQL
        // Nota: Si cambias los IDs en el body, Sequelize moverá la relación
        await relacionSQL.update({
            evento_id: datos.evento_id,
            artista_id: datos.artista_id,
            estado: datos.estado
        });

        // Actualizar Mongo
        // Buscamos por los IDs "viejos" (los de params) y actualizamos a los nuevos (del body)
        await EventosArtistasMongo.findOneAndUpdate(
            { 
                evento_id_sql: evento_id, 
                artista_id_sql: artista_id 
            },
            {
                evento_id_sql: datos.evento_id,
                artista_id_sql: datos.artista_id,
                estado: datos.estado
            }
        );

        res.status(200).json({ 
            mensaje: 'Relación actualizada correctamente', 
            datos: relacionSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
}

// --- DESTROY (Borrado Lógico Dual) ---
async function destroy(req, res) {
    // IMPORTANTE: Necesitamos ambos IDs para borrar
    const { evento_id, artista_id } = req.params;

    try {
        const relacionSQL = await EventosArtistasSQL.findOne({
            where: { evento_id: evento_id, artista_id: artista_id }
        });

        if(!relacionSQL) return res.status(404).json({mensaje: "Relación no encontrada"});

        // Borrado lógico SQL
        await relacionSQL.update({ estado: 'Inactivo' });

        // Borrado lógico Mongo
        await EventosArtistasMongo.findOneAndUpdate(
            { 
                evento_id_sql: evento_id, 
                artista_id_sql: artista_id 
            },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Relación dada de baja', datos: relacionSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
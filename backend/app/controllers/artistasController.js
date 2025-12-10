const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const ArtistaSQL = require('../models/sql/Artista'); 
const ArtistaMongo = require('../models/mongoose/Artista');

// Helper para borrar imagen
const borrarImagen = (ruta) => {
    if (ruta && fs.existsSync(path.resolve(ruta))) {
        fs.unlinkSync(path.resolve(ruta));
    }
};

// --- INDEX ---
async function index(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const artistas = await ArtistaSQL.findAll();

        const datosTransformados = artistas.map(a => {
            const artista = a.toJSON();
            return {
                ...artista,
                imagen_artista: artista.imagen_artista
                    ? `${baseUrl}/${artista.imagen_artista.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener artistas', error: error.message });
    }
}

// --- SHOW ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        const artistaInstance = await ArtistaSQL.findByPk(id);

        if (!artistaInstance) {
            return res.status(404).json({ mensaje: 'Artista no encontrado' });
        }

        const artista = artistaInstance.toJSON();
        artista.imagen_artista = artista.imagen_artista
            ? `${baseUrl}/${artista.imagen_artista.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: artista });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar artista', error: error.message });
    }
}

// --- STORE (Dual Write) ---
async function store(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const datos = req.body;
    let rutaRelativa = null;

    try {
        // 1. Crear en MySQL
        const nuevoArtistaSQL = await ArtistaSQL.create({
            nombre_artista: datos.nombre_artista,
            genero: datos.genero,
            descripcion: datos.descripcion,
            estado: datos.estado
        });

        const nuevo_id = nuevoArtistaSQL.id_artista;

        // 2. Imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'artistas', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/artistas/${nuevoNombre}`;

            nuevoArtistaSQL.imagen_artista = rutaRelativa;
            await nuevoArtistaSQL.save();
        }

        // 3. Crear en MongoDB (Espejo)
        const nuevoArtistaMongo = await ArtistaMongo.create({
            id_sql: nuevo_id,
            nombre_artista: datos.nombre_artista,
            genero: datos.genero,
            descripcion: datos.descripcion,
            estado: datos.estado,
            imagen_artista: rutaRelativa
        });

        res.status(201).json({ 
            datos: nuevoArtistaSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevoArtistaMongo 
        });

    } catch (error) {
        if(rutaRelativa) borrarImagen(rutaRelativa);
        res.status(400).json({ mensaje: 'Error al crear artista', error: error.message });
    }
}

// --- UPDATE (Dual Write) ---
async function update(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const id = req.params.id;
    const datos = req.body;

    try {
        const artistaSQL = await ArtistaSQL.findByPk(id);
        if(!artistaSQL) return res.status(404).json({mensaje: "Artista no encontrado"});

        let rutaImagen = artistaSQL.imagen_artista;

        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "artistas", nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            if (rutaImagen) borrarImagen(rutaImagen);
            rutaImagen = `uploads/artistas/${nuevoNombre}`;
        }

        // Actualizar SQL
        await artistaSQL.update({
            nombre_artista: datos.nombre_artista,
            genero: datos.genero,
            descripcion: datos.descripcion,
            estado: datos.estado,
            imagen_artista: rutaImagen
        });

        // Actualizar Mongo
        await ArtistaMongo.findOneAndUpdate(
            { id_sql: id },
            {
                nombre_artista: datos.nombre_artista,
                genero: datos.genero,
                descripcion: datos.descripcion,
                estado: datos.estado,
                imagen_artista: rutaImagen
            }
        );

        res.status(200).json({ 
            mensaje: "Artista actualizado correctamente.",
            datos: artistaSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar artista.", error: error.message });
    }
}

// --- DESTROY (Dual Write) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const artistaSQL = await ArtistaSQL.findByPk(id);
        if(!artistaSQL) return res.status(404).json({mensaje: "Artista no encontrado"});

        await artistaSQL.update({ estado: 'Inactivo' });

        await ArtistaMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Artista dado de baja.', datos: artistaSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta.', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
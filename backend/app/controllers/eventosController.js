const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const EventoSQL = require('../models/sql/Evento'); 
const EventoMongo = require('../models/mongoose/Evento'); // Asegúrate que la ruta sea correcta

// Helper para borrar imagen física
const borrarImagen = (ruta) => {
    if (ruta && fs.existsSync(path.resolve(ruta))) {
        fs.unlinkSync(path.resolve(ruta));
    }
};

// --- INDEX ---
async function index(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const eventos = await EventoSQL.findAll();

        const datosTransformados = eventos.map(e => {
            const evento = e.toJSON();
            return {
                ...evento,
                imagen_evento: evento.imagen_evento
                    ? `${baseUrl}/${evento.imagen_evento.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener eventos', error: error.message });
    }
}

// --- SHOW ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        const eventoInstance = await EventoSQL.findByPk(id);

        if (!eventoInstance) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }

        const evento = eventoInstance.toJSON();
        evento.imagen_evento = evento.imagen_evento
            ? `${baseUrl}/${evento.imagen_evento.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: evento });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar evento', error: error.message });
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
        const nuevoEventoSQL = await EventoSQL.create({
            nombre_evento: datos.nombre_evento,
            descripcion: datos.descripcion,
            fecha: datos.fecha,
            hora_fin: datos.hora_fin,
            aforo: datos.aforo,
            auditorio_id: datos.auditorio_id,
            estado: datos.estado
        });

        const nuevo_id = nuevoEventoSQL.id_evento;

        // 2. Imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'eventos', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/eventos/${nuevoNombre}`;

            nuevoEventoSQL.imagen_evento = rutaRelativa;
            await nuevoEventoSQL.save();
        }

        // 3. Crear en MongoDB
        const nuevoEventoMongo = await EventoMongo.create({
            id_sql: nuevo_id,
            nombre_evento: datos.nombre_evento,
            descripcion: datos.descripcion,
            fecha: datos.fecha,
            hora_fin: datos.hora_fin,
            aforo: datos.aforo,
            auditorio_id: datos.auditorio_id, // ID numérico
            estado: datos.estado,
            imagen_evento: rutaRelativa
        });

        res.status(200).json({ 
            datos: nuevoEventoSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevoEventoMongo 
        });

    } catch (error) {
        if(rutaRelativa) borrarImagen(rutaRelativa);
        res.status(400).json({ mensaje: 'Error al crear evento', error: error.message });
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
        const eventoSQL = await EventoSQL.findByPk(id);
        if(!eventoSQL) return res.status(404).json({mensaje: "Evento no encontrado"});

        let rutaImagen = eventoSQL.imagen_evento;

        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "eventos", nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            if (rutaImagen) borrarImagen(rutaImagen);
            rutaImagen = `uploads/eventos/${nuevoNombre}`;
        }

        // Actualizar SQL
        await eventoSQL.update({
            nombre_evento: datos.nombre_evento,
            descripcion: datos.descripcion,
            fecha: datos.fecha,
            hora_fin: datos.hora_fin,
            aforo: datos.aforo,
            auditorio_id: datos.auditorio_id,
            estado: datos.estado,
            imagen_evento: rutaImagen
        });

        // Actualizar Mongo
        await EventoMongo.findOneAndUpdate(
            { id_sql: id },
            {
                nombre_evento: datos.nombre_evento,
                descripcion: datos.descripcion,
                fecha: datos.fecha,
                hora_fin: datos.hora_fin,
                aforo: datos.aforo,
                auditorio_id: datos.auditorio_id,
                estado: datos.estado,
                imagen_evento: rutaImagen
            }
        );

        res.status(200).json({ 
            mensaje: 'Evento actualizado', 
            datos: eventoSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
}

// --- DESTROY (Dual Write) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const eventoSQL = await EventoSQL.findByPk(id);
        if(!eventoSQL) return res.status(404).json({mensaje: "Evento no encontrado"});

        await eventoSQL.update({ estado: 'Inactivo' });

        await EventoMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Evento dado de baja', datos: eventoSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
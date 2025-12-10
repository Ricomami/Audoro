const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const AuditorioSQL = require('../models/sql/Auditorio'); 
const AuditorioMongo = require('../models/mongoose/Auditorio');

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
        const auditorios = await AuditorioSQL.findAll();

        const datosTransformados = auditorios.map(a => {
            const auditorio = a.toJSON();
            return {
                ...auditorio,
                imagen_auditorio: auditorio.imagen_auditorio
                    ? `${baseUrl}/${auditorio.imagen_auditorio.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener auditorios', error: error.message });
    }
}

// --- SHOW ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        const auditorioInstance = await AuditorioSQL.findByPk(id);

        if (!auditorioInstance) {
            return res.status(404).json({ mensaje: 'Auditorio no encontrado' });
        }

        const auditorio = auditorioInstance.toJSON();
        auditorio.imagen_auditorio = auditorio.imagen_auditorio
            ? `${baseUrl}/${auditorio.imagen_auditorio.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: auditorio });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar auditorio', error: error.message });
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
        const nuevoAuditorioSQL = await AuditorioSQL.create({
            nombre: datos.nombre,
            capacidad: datos.capacidad,
            direccion: datos.direccion,
            estado: datos.estado
        });

        const nuevo_id = nuevoAuditorioSQL.id_auditorio;

        // 2. Imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'auditorios', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/auditorios/${nuevoNombre}`;

            nuevoAuditorioSQL.imagen_auditorio = rutaRelativa;
            await nuevoAuditorioSQL.save();
        }

        // 3. Crear en MongoDB (Espejo)
        const nuevoAuditorioMongo = await AuditorioMongo.create({
            id_sql: nuevo_id,
            nombre: datos.nombre,
            capacidad: datos.capacidad,
            direccion: datos.direccion,
            estado: datos.estado,
            imagen_auditorio: rutaRelativa
        });

        res.status(201).json({ 
            datos: nuevoAuditorioSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevoAuditorioMongo 
        });

    } catch (error) {
        if(rutaRelativa) borrarImagen(rutaRelativa);
        res.status(400).json({ mensaje: 'Error al crear auditorio', error: error.message });
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
        const auditorioSQL = await AuditorioSQL.findByPk(id);
        if(!auditorioSQL) return res.status(404).json({mensaje: "Auditorio no encontrado"});

        let rutaImagen = auditorioSQL.imagen_auditorio;

        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "auditorios", nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            if (rutaImagen) borrarImagen(rutaImagen);
            rutaImagen = `uploads/auditorios/${nuevoNombre}`;
        }

        // Actualizar SQL
        await auditorioSQL.update({
            nombre: datos.nombre,
            capacidad: datos.capacidad,
            direccion: datos.direccion,
            estado: datos.estado,
            imagen_auditorio: rutaImagen
        });

        // Actualizar Mongo
        await AuditorioMongo.findOneAndUpdate(
            { id_sql: id },
            {
                nombre: datos.nombre,
                capacidad: datos.capacidad,
                direccion: datos.direccion,
                estado: datos.estado,
                imagen_auditorio: rutaImagen
            }
        );

        res.status(200).json({ 
            mensaje: "Auditorio actualizado correctamente.",
            datos: auditorioSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar auditorio.', error: error.message });
    }
}

// --- DESTROY (Dual Write) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const auditorioSQL = await AuditorioSQL.findByPk(id);
        if(!auditorioSQL) return res.status(404).json({mensaje: "Auditorio no encontrado"});

        await auditorioSQL.update({ estado: 'Inactivo' });

        await AuditorioMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: "Auditorio dado de baja.", datos: auditorioSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta.', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
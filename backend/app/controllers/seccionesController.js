const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const SeccionSQL = require('../models/sql/Seccion'); 
const SeccionMongo = require('../models/mongoose/Seccion');

// Helper para borrar imagen física
const borrarImagen = (ruta) => {
    if (ruta && fs.existsSync(path.resolve(ruta))) {
        fs.unlinkSync(path.resolve(ruta));
    }
};

// --- INDEX (Lectura SQL) ---
async function index(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        // Sequelize: findAll
        const secciones = await SeccionSQL.findAll();

        const datosTransformados = secciones.map(s => {
            const seccion = s.toJSON();
            return {
                ...seccion,
                imagen_seccion: seccion.imagen_seccion
                    ? `${baseUrl}/${seccion.imagen_seccion.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener secciones', error: error.message });
    }
}

// --- SHOW (Lectura SQL) ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        const seccionInstance = await SeccionSQL.findByPk(id);

        if (!seccionInstance) {
            return res.status(404).json({ mensaje: 'Sección no encontrada' });
        }

        const seccion = seccionInstance.toJSON();
        seccion.imagen_seccion = seccion.imagen_seccion
            ? `${baseUrl}/${seccion.imagen_seccion.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: seccion });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar sección', error: error.message });
    }
}

// --- STORE (Creación Dual) ---
async function store(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const datos = req.body;
    let rutaRelativa = null;

    try {
        // 1. Crear en MySQL
        const nuevaSeccionSQL = await SeccionSQL.create({
            nombre_seccion: datos.nombre_seccion,
            precio_base: datos.precio_base,
            auditorio_id: datos.auditorio_id,
            estado: datos.estado
        });

        const nuevo_id = nuevaSeccionSQL.id_seccion;

        // 2. Manejo de Imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'secciones', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/secciones/${nuevoNombre}`;

            // Actualizar registro SQL
            nuevaSeccionSQL.imagen_seccion = rutaRelativa;
            await nuevaSeccionSQL.save();
        }

        // 3. Crear en MongoDB (Espejo)
        const nuevaSeccionMongo = await SeccionMongo.create({
            id_sql: nuevo_id,
            nombre_seccion: datos.nombre_seccion,
            precio_base: datos.precio_base,
            auditorio_id: datos.auditorio_id, // Guardamos el ID numérico
            estado: datos.estado,
            imagen_seccion: rutaRelativa
        });

        res.status(201).json({ 
            datos: nuevaSeccionSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevaSeccionMongo 
        });

    } catch (error) {
        if(rutaRelativa) borrarImagen(rutaRelativa);
        res.status(400).json({ mensaje: 'Error al crear la sección.', error: error.message });
    }
}

// --- UPDATE (Actualización Dual) ---
async function update(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const id = req.params.id;
    const datos = req.body;

    try {
        const seccionSQL = await SeccionSQL.findByPk(id);
        if(!seccionSQL) return res.status(404).json({mensaje: "Sección no encontrada"});

        let rutaImagen = seccionSQL.imagen_seccion;

        // Manejo de nueva imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "secciones", nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            
            // Borrar anterior
            if (rutaImagen) borrarImagen(rutaImagen);

            rutaImagen = `uploads/secciones/${nuevoNombre}`;
        }

        // Actualizar SQL
        await seccionSQL.update({
            nombre_seccion: datos.nombre_seccion,
            precio_base: datos.precio_base,
            auditorio_id: datos.auditorio_id,
            estado: datos.estado,
            imagen_seccion: rutaImagen
        });

        // Actualizar Mongo
        await SeccionMongo.findOneAndUpdate(
            { id_sql: id },
            {
                nombre_seccion: datos.nombre_seccion,
                precio_base: datos.precio_base,
                auditorio_id: datos.auditorio_id,
                estado: datos.estado,
                imagen_seccion: rutaImagen
            }
        );

        res.status(200).json({ 
            mensaje: 'Seccion actualizada correctamente.', 
            filasModificadas: {
                id,
                ...datos,
                imagen_seccion: rutaImagen || "Sin cambios",
            }
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la seccion.', error: error.message });
    }
}

// --- DESTROY (Borrado Lógico Dual) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const seccionSQL = await SeccionSQL.findByPk(id);
        if(!seccionSQL) return res.status(404).json({mensaje: "Sección no encontrada"});

        // Borrado lógico SQL
        await seccionSQL.update({ estado: 'Inactivo' });

        // Borrado lógico Mongo
        await SeccionMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Seccion dada de baja', datos: seccionSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
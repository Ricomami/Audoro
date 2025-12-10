const { validationResult } = require('express-validator');

// IMPORTACIÓN DE MODELOS
const AsientoSQL = require('../models/sql/Asiento'); 
const AsientoMongo = require('../models/mongoose/Asiento');

// --- INDEX ---
async function index(req, res) {
    try {
        const asientos = await AsientoSQL.findAll();
        res.status(200).json({ datos: asientos });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener asientos', error: error.message });
    }
}

// --- SHOW ---
async function show(req, res) {
    try {
        const id = req.params.id;
        const asiento = await AsientoSQL.findByPk(id);

        if (!asiento) {
            return res.status(404).json({ mensaje: 'Asiento no encontrado' });
        }

        res.status(200).json({ datos: asiento });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar asiento', error: error.message });
    }
}

// --- STORE (Dual Write) ---
async function store(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const datos = req.body;

    try {
        // 1. Crear en MySQL
        const nuevoAsientoSQL = await AsientoSQL.create({
            seccion_id: datos.seccion_id,
            fila: datos.fila,
            numero_asiento: datos.numero_asiento,
            estado: datos.estado
        });

        const nuevo_id = nuevoAsientoSQL.id_asiento;

        // 2. Crear en MongoDB (Espejo)
        const nuevoAsientoMongo = await AsientoMongo.create({
            id_sql: nuevo_id,
            seccion_id: datos.seccion_id, // ID numérico
            fila: datos.fila,
            numero_asiento: datos.numero_asiento,
            estado: datos.estado
        });

        res.status(200).json({ 
            datos: nuevoAsientoSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevoAsientoMongo 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear asiento', error: error.message });
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
        const asientoSQL = await AsientoSQL.findByPk(id);
        if(!asientoSQL) return res.status(404).json({mensaje: "Asiento no encontrado"});

        // Actualizar SQL
        await asientoSQL.update({
            seccion_id: datos.seccion_id,
            fila: datos.fila,
            numero_asiento: datos.numero_asiento,
            estado: datos.estado
        });

        // Actualizar Mongo
        await AsientoMongo.findOneAndUpdate(
            { id_sql: id },
            {
                seccion_id: datos.seccion_id,
                fila: datos.fila,
                numero_asiento: datos.numero_asiento,
                estado: datos.estado
            }
        );

        res.status(200).json({ 
            mensaje: 'Asiento actualizado', 
            datos: asientoSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
}

// --- DESTROY (Dual Write) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const asientoSQL = await AsientoSQL.findByPk(id);
        if(!asientoSQL) return res.status(404).json({mensaje: "Asiento no encontrado"});

        // Borrado lógico SQL
        await asientoSQL.update({ estado: 'Inactivo' });

        // Borrado lógico Mongo
        await AsientoMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Asiento dado de baja', datos: asientoSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
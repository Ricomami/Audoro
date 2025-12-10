const { validationResult } = require('express-validator');

// IMPORTACIÓN DE MODELOS
const FuncionSQL = require('../models/sql/Funcion'); 
const FuncionMongo = require('../models/mongoose/Funcion');

// --- INDEX (Lectura SQL) ---
async function index(req, res) {
    try {
        const funciones = await FuncionSQL.findAll();
        res.status(200).json({ datos: funciones });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener funciones', error: error.message });
    }
}

// --- SHOW (Lectura SQL) ---
async function show(req, res) {
    try {
        const id = req.params.id;
        const funcion = await FuncionSQL.findByPk(id);

        if (!funcion) {
            return res.status(404).json({ mensaje: 'Función no encontrada' });
        }

        res.status(200).json({ datos: funcion });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar función', error: error.message });
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
        const nuevaFuncionSQL = await FuncionSQL.create({
            evento_id: datos.evento_id,
            fecha_hora_funcion: datos.fecha_hora_funcion,
            estado: datos.estado
        });

        const nuevo_id = nuevaFuncionSQL.id_funcion;

        // 2. Crear en MongoDB (Espejo)
        const nuevaFuncionMongo = await FuncionMongo.create({
            id_sql: nuevo_id,
            evento_id: datos.evento_id, // Guardamos el ID numérico
            fecha_hora_funcion: datos.fecha_hora_funcion,
            estado: datos.estado
        });

        res.status(200).json({ 
            datos: nuevaFuncionSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevaFuncionMongo 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la función.', error: error.message });
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
        const funcionSQL = await FuncionSQL.findByPk(id);
        if(!funcionSQL) return res.status(404).json({mensaje: "Función no encontrada"});

        // Actualizar SQL
        await funcionSQL.update({
            evento_id: datos.evento_id,
            fecha_hora_funcion: datos.fecha_hora_funcion,
            estado: datos.estado
        });

        // Actualizar Mongo
        await FuncionMongo.findOneAndUpdate(
            { id_sql: id },
            {
                evento_id: datos.evento_id,
                fecha_hora_funcion: datos.fecha_hora_funcion,
                estado: datos.estado
            }
        );

        res.status(200).json({ 
            mensaje: 'Función actualizada correctamente', 
            datos: funcionSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar función', error: error.message });
    }
}

// --- DESTROY (Borrado Lógico Dual) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const funcionSQL = await FuncionSQL.findByPk(id);
        if(!funcionSQL) return res.status(404).json({mensaje: "Función no encontrada"});

        // Borrado lógico SQL
        await funcionSQL.update({ estado: 'Inactivo' });

        // Borrado lógico Mongo
        await FuncionMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Función dada de baja', datos: funcionSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
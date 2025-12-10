const { validationResult } = require('express-validator');

// IMPORTACIÓN DE MODELOS
const EntradaSQL = require('../models/sql/Entrada'); 
const EntradaMongo = require('../models/mongoose/Entrada');

// --- INDEX (Lectura SQL) ---
async function index(req, res) {
    try {
        const entradas = await EntradaSQL.findAll();
        res.status(200).json({ datos: entradas });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener entradas', error: error.message });
    }
}

// --- SHOW (Lectura SQL) ---
async function show(req, res) {
    try {
        const id = req.params.id;
        const entrada = await EntradaSQL.findByPk(id);

        if (!entrada) {
            return res.status(404).json({ mensaje: 'Entrada no encontrada' });
        }

        res.status(200).json({ datos: entrada });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar entrada', error: error.message });
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
        const nuevaEntradaSQL = await EntradaSQL.create({
            asiento_id: datos.asiento_id,
            pago_id: datos.pago_id,
            funcion_id: datos.funcion_id,
            cliente_id: datos.cliente_id,
            precio_final: datos.precio_final,
            estado: datos.estado
        });

        const nuevo_id = nuevaEntradaSQL.id_entrada;

        // 2. Crear en MongoDB (Espejo)
        const nuevaEntradaMongo = await EntradaMongo.create({
            id_sql: nuevo_id,
            asiento_id: datos.asiento_id,   // ID numérico
            pago_id: datos.pago_id,         // ID numérico
            funcion_id: datos.funcion_id,   // ID numérico
            cliente_id: datos.cliente_id,   // ID numérico
            precio_final: datos.precio_final,
            estado: datos.estado
        });

        res.status(200).json({ 
            datos: nuevaEntradaSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevaEntradaMongo 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar entrada.', error: error.message });
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
        const entradaSQL = await EntradaSQL.findByPk(id);
        if(!entradaSQL) return res.status(404).json({mensaje: "Entrada no encontrada"});

        // Actualizar SQL
        await entradaSQL.update({
            asiento_id: datos.asiento_id,
            pago_id: datos.pago_id, // Si permites cambiar el pago asociado
            funcion_id: datos.funcion_id,
            cliente_id: datos.cliente_id,
            precio_final: datos.precio_final,
            estado: datos.estado
        });

        // Actualizar Mongo
        await EntradaMongo.findOneAndUpdate(
            { id_sql: id },
            {
                asiento_id: datos.asiento_id,
                pago_id: datos.pago_id,
                funcion_id: datos.funcion_id,
                cliente_id: datos.cliente_id,
                precio_final: datos.precio_final,
                estado: datos.estado
            }
        );

        res.status(200).json({ 
            mensaje: 'Entrada actualizada correctamente', 
            datos: entradaSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar entrada', error: error.message });
    }
}

// --- DESTROY (Borrado Lógico Dual) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const entradaSQL = await EntradaSQL.findByPk(id);
        if(!entradaSQL) return res.status(404).json({mensaje: "Entrada no encontrada"});

        // Borrado lógico SQL
        await entradaSQL.update({ estado: 'Inactivo' });

        // Borrado lógico Mongo
        await EntradaMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Entrada dada de baja', datos: entradaSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
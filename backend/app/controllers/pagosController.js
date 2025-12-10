const { validationResult } = require('express-validator');

// IMPORTACIÓN DE MODELOS
const PagoSQL = require('../models/sql/Pago'); 
const PagoMongo = require('../models/mongoose/Pago');

// --- INDEX (Lectura SQL) ---
async function index(req, res) {
    try {
        const pagos = await PagoSQL.findAll();
        res.status(200).json({ datos: pagos });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener pagos', error: error.message });
    }
}

// --- SHOW (Lectura SQL) ---
async function show(req, res) {
    try {
        const id = req.params.id;
        const pago = await PagoSQL.findByPk(id);

        if (!pago) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }

        res.status(200).json({ datos: pago });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar pago', error: error.message });
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
        const nuevoPagoSQL = await PagoSQL.create({
            cliente_id: datos.cliente_id,
            metodo_pago: datos.metodo_pago,
            monto: datos.monto,
            fecha_pago: datos.fecha_pago || new Date(), // Si no viene fecha, usa la actual
            estado: datos.estado
        });

        const nuevo_id = nuevoPagoSQL.id_pago;

        // 2. Crear en MongoDB (Espejo)
        const nuevoPagoMongo = await PagoMongo.create({
            id_sql: nuevo_id,
            cliente_id: datos.cliente_id, // ID Numérico
            metodo_pago: datos.metodo_pago,
            monto: datos.monto,
            fecha_pago: datos.fecha_pago || new Date(),
            estado: datos.estado
        });

        res.status(200).json({ 
            datos: nuevoPagoSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevoPagoMongo 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar el pago.', error: error.message });
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
        const pagoSQL = await PagoSQL.findByPk(id);
        if(!pagoSQL) return res.status(404).json({mensaje: "Pago no encontrado"});

        // Actualizar SQL
        await pagoSQL.update({
            cliente_id: datos.cliente_id,
            metodo_pago: datos.metodo_pago,
            monto: datos.monto,
            fecha_pago: datos.fecha_pago,
            estado: datos.estado
        });

        // Actualizar Mongo
        await PagoMongo.findOneAndUpdate(
            { id_sql: id },
            {
                cliente_id: datos.cliente_id,
                metodo_pago: datos.metodo_pago,
                monto: datos.monto,
                fecha_pago: datos.fecha_pago,
                estado: datos.estado
            }
        );

        res.status(200).json({ 
            mensaje: 'Pago actualizado correctamente.', 
            datos: pagoSQL
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar pago.', error: error.message });
    }
}

// --- DESTROY (Borrado Lógico Dual) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const pagoSQL = await PagoSQL.findByPk(id);
        if(!pagoSQL) return res.status(404).json({mensaje: "Pago no encontrado"});

        // Borrado lógico SQL
        await pagoSQL.update({ estado: 'Inactivo' });

        // Borrado lógico Mongo
        await PagoMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Pago dado de baja', datos: pagoSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
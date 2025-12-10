const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const ClienteSQL = require('../models/sql/Cliente'); 
const ClienteMongo = require('../models/mongoose/Cliente');

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
        const clientes = await ClienteSQL.findAll();

        const datosTransformados = clientes.map(c => {
            const cliente = c.toJSON();
            return {
                ...cliente,
                imagen_cliente: cliente.imagen_cliente
                    ? `${baseUrl}/${cliente.imagen_cliente.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener clientes', error: error.message });
    }
}

// --- SHOW ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        const clienteInstance = await ClienteSQL.findByPk(id);

        if (!clienteInstance) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const cliente = clienteInstance.toJSON();
        cliente.imagen_cliente = cliente.imagen_cliente
            ? `${baseUrl}/${cliente.imagen_cliente.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: cliente });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar cliente', error: error.message });
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
        const nuevoClienteSQL = await ClienteSQL.create({
            nombre: datos.nombre,
            apellido_pat: datos.apellido_pat,
            apellido_mat: datos.apellido_mat,
            correo: datos.correo,
            telefono: datos.telefono,
            estado: datos.estado
        });

        const nuevo_id = nuevoClienteSQL.id_cliente;

        // 2. Imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'clientes', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/clientes/${nuevoNombre}`;

            nuevoClienteSQL.imagen_cliente = rutaRelativa;
            await nuevoClienteSQL.save();
        }

        // 3. Crear en MongoDB (Espejo)
        const nuevoClienteMongo = await ClienteMongo.create({
            id_sql: nuevo_id,
            nombre: datos.nombre, // <--- CORREGIDO (Antes era nombre_cliente)
            apellido_pat: datos.apellido_pat,
            apellido_mat: datos.apellido_mat,
            correo: datos.correo,
            telefono: datos.telefono,
            estado: datos.estado,
            imagen_cliente: rutaRelativa
        });

        res.status(201).json({ 
            datos: nuevoClienteSQL, 
            idCreada: nuevo_id,
            mongo_data: nuevoClienteMongo 
        });

    } catch (error) {
        if(rutaRelativa) borrarImagen(rutaRelativa);
        res.status(400).json({ mensaje: 'Error al crear cliente', error: error.message });
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
        const clienteSQL = await ClienteSQL.findByPk(id);
        if(!clienteSQL) return res.status(404).json({mensaje: "Cliente no encontrado"});

        let rutaImagen = clienteSQL.imagen_cliente;

        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "clientes", nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            if (rutaImagen) borrarImagen(rutaImagen);
            rutaImagen = `uploads/clientes/${nuevoNombre}`;
        }

        // Actualizar SQL
        await clienteSQL.update({
            nombre: datos.nombre,
            apellido_pat: datos.apellido_pat,
            apellido_mat: datos.apellido_mat,
            correo: datos.correo,
            telefono: datos.telefono,
            estado: datos.estado,
            imagen_cliente: rutaImagen
        });

        // Actualizar Mongo
        await ClienteMongo.findOneAndUpdate(
            { id_sql: id },
            {
                nombre: datos.nombre, // <--- CORREGIDO
                apellido_pat: datos.apellido_pat,
                apellido_mat: datos.apellido_mat,
                correo: datos.correo,
                telefono: datos.telefono,
                estado: datos.estado,
                imagen_cliente: rutaImagen
            }
        );

        res.status(200).json({ 
            mensaje: 'Cliente actualizado', 
            datos: clienteSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
}

// --- DESTROY (Dual Write) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        const clienteSQL = await ClienteSQL.findByPk(id);
        if(!clienteSQL) return res.status(404).json({mensaje: "Cliente no encontrado"});

        await clienteSQL.update({ estado: 'Inactivo' });

        await ClienteMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ mensaje: 'Cliente dado de baja', datos: clienteSQL });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
}

module.exports = { index, show, store, update, destroy };
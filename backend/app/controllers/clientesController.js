const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        //Tomamos la URL base para construir la URL completa de la imagen
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const [respuesta] = await c.query('SELECT * FROM clientes');

        const datosTransformados = respuesta.map(cliente => ({
            ...cliente,
            imagen_cliente: cliente.imagen_cliente
                ? `${baseUrl}/${cliente.imagen_cliente.replace(/\\/g, "/")}`
                : null
        }));
        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function show(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        var id = req.params.id;
        const [respuesta] = await c.query('SELECT * FROM clientes WHERE id_cliente=? ', [id]);
        if (respuesta.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const cliente = respuesta[0];
        cliente.imagen_cliente = cliente.imagen_cliente
            ? `${baseUrl}/${cliente.imagen_cliente.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: cliente });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function store(req, res) {

    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    let c;
    try {
        c = await con.conectarBD();
        const datos = req.body;
        const [respuesta] = await c.query(
            'INSERT INTO clientes (nombre, apellido_pat, apellido_mat, correo, telefono, estado) VALUES (?,?,?,?,?,?) ',
            [datos.nombre, datos.apellido_pat, datos.apellido_mat, datos.correo, datos.telefono, datos.estado]
        );

        const nuevo_id = respuesta.insertId;
        //Si existe una imagen, actualizar el registro con la ruta de la imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'clientes', nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/clientes/${nuevoNombre}`;

            //Actualizamos el campo de la imagen en la BD
            await c.query('UPDATE clientes SET imagen_cliente=? WHERE id_cliente=?',
                [rutaRelativa, nuevo_id]
            );
        }

        //Consultamos el registro completo
        const [nuevoCliente] = await c.query('SELECT * FROM clientes WHERE id_cliente=?', [nuevo_id]);
        res.status(201).json({ datos: nuevoCliente, idCreada: nuevo_id });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear al cliente', error: error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function update(req, res) {

    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    let c;
    try {
        c = await con.conectarBD();
        var id = req.params.id;
        const datos = req.body;

        //Obtener los datos actuales del cliente
        const [rows] = await c.query(
            'SELECT imagen_cliente FROM clientes WHERE id_cliente=?',
            [id]
        );

        let rutaImagen = rows[0]?.imagen_cliente || null;

        //Si viene una nueva umagen dentro de la peticion
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'clientes', nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/clientes/${nuevoNombre}`;

            //Si habia una imagen anterior, eliminarla
            if (rutaImagen) {
                const rutaAbsoluta = path.resolve(rutaImagen);

                if (fs.existsSync(rutaAbsoluta)) {
                    fs.unlinkSync(rutaAbsoluta);
                    console.log("Imagen anterior eliminada", rutaAbsoluta);
                }
            }

            rutaImagen = rutaRelativa;
        }

        //Actualizamos todos los campos del cliente, incluyendo la imagen.
        const [respuesta] = await c.query(
            `UPDATE clientes
            SET nombre=?, apellido_pat=?, apellido_mat=?, correo=?, telefono=?, imagen_cliente=?, estado=? 
            WHERE id_cliente=?`,
            [datos.nombre, datos.apellido_pat, datos.apellido_mat, datos.correo, datos.telefono, rutaImagen, datos.estado, id]
        );

        res.status(200).json({
            mensaje: 'Artista actualizado correctamente',
            filasModificadas: respuesta.affectedRows,
            datosActualizados: {
                id,
                ...datos,
                imagen: rutaImagen || "Sin cambios",
            },
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: 'Error al actualizar cliente.', error: error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function destroy(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        var id = req.params.id;
        const [respuesta] = await c.query('UPDATE clientes SET estado=? WHERE id_cliente=?',
            ['Inactivo', id]);
        res.status(200).json({ mensaje: 'Cliente dado de baja', datos: respuesta });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    }
};

module.exports = {
    index, show, store, update, destroy
}
const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const Seccion = require('../models/Seccion');
const path = require('path');
const fs = require('fs');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const [respuesta] = await c.query('SELECT * FROM secciones');

        const datosTransformados = respuesta.map(seccion => ({
            ...seccion,
            imagen_seccion: seccion.imagen_seccion
                ? `${baseUrl}/${seccion.imagen_seccion.replace(/\\/g, "/")}`
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
        const id = req.params.id;
        const [respuesta] = await c.query('SELECT * FROM secciones WHERE id_seccion=? ', [id]);
        if (respuesta.length === 0) {
            return res.status(404).json({ mensaje: 'Sección no encontrada' });
        }

        const seccion = respuesta[0];
        seccion.imagen_seccion = seccion.imagen_seccion
            ? `${baseUrl}/${seccion.imagen_seccion.replace(/\\/g, "/")}`
            : null;
        res.status(200).json({ datos: seccion });
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
            'INSERT INTO secciones (nombre_seccion, precio_base, auditorio_id, estado) VALUES (?,?,?,?) ',
            [datos.nombre_seccion, datos.precio_base, datos.auditorio_id, datos.estado]
        );

        const nuevo_id = respuesta.insertId;
        //Si existe una imagen, la renombramos con el ID
        let rutaRelativa = null;
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'secciones', nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/secciones/${nuevoNombre}`;

            //Actualizamos el campo imagen dentro de la BD
            await c.query('UPDATE secciones SET imagen_seccion=? WHERE id_seccion=?',
                [rutaRelativa, nuevo_id]
            );
        }

        //Consultamos el registro completo
        const [nuevaSeccion] = await c.query('SELECT * FROM secciones WHERE id_seccion=?', [nuevo_id]);
        res.status(201).json({ datos: nuevaSeccion, idCreada: nuevo_id });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la seccion.', error: error.message });
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
        const id = req.params.id;
        const datos = req.body;

        //Obtenemos los datos actuales del artista
        const [rows] = await c.query(
            'SELECT imagen_seccion FROM secciones WHERE id_seccion=?',
            [id]
        );

        let rutaImagen = rows[0]?.imagen_seccion || null;

        //Si existe una nueva imagen en la peticion
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "secciones", nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/secciones/${nuevoNombre}`;

            
            //Si habia una imagen anterior, la eliminamos
            if (rutaImagen) {
                const rutaAbsoluta = path.resolve(rutaImagen);

                if (fs.existsSync(rutaAbsoluta)) {
                    fs.unlinkSync(rutaAbsoluta);
                    console.log('Imagen anterior eliminada: ', rutaAbsoluta);
            }
        }

        rutaImagen = rutaRelativa;
    }

    //Actualizamos todos los campos, incluyendo la imagen (si existe)
    const [respuesta] = await c.query(
        `UPDATE secciones 
        SET nombre_seccion=?, precio_base=?, auditorio_id=?, imagen_seccion=?, estado=? 
        WHERE id_seccion=?`,
            [
                datos.nombre_seccion, 
                datos.precio_base, 
                datos.auditorio_id, 
                rutaImagen, 
                datos.estado, 
                id
            ]
        );

        res.status(200).json({ 
            mensaje: 'Seccion actualizada correctamente.', 
            filasModificadas: {
                id,
                ...datos,
                imagen_seccion: rutaImagen || "Sin cambios",
            },
        });
    } catch (error) {
        res
        .status(400)
        .json({ mensaje: 'Error al actualizar la seccion.', error: error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function destroy(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        var id = req.params.id;
        const [respuesta] = await c.query('UPDATE secciones SET estado=? WHERE id_seccion=?',
            ['Inactivo', id]);
        res.status(200).json({ mensaje: 'Seccion dada de baja', datos: respuesta });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    }
};

module.exports = {
    index, show, store, update, destroy
}
const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const Evento = require ('../models/Evento');
const path = require ('path');
const fs = require ('fs');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const [respuesta] = await c.query('SELECT * FROM eventos');

        const datosTransformados = respuesta.map(evento => ({
            ...evento,
            imagen_evento: evento.imagen_evento
                ? `${baseUrl}/${evento.imagen_evento.replace(/\\/g, "/")}`
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
        const [respuesta] = await c.query('SELECT * FROM eventos WHERE id_evento=? ', [id]);
        if (respuesta.length === 0) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }

        const evento = respuesta[0];
        evento.imagen_evento = evento.imagen_evento
            ? `${baseUrl}/${evento.imagen_evento.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: evento });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function store(req, res) {
            
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty() ){
        return res.status(422).json({ errors : result.array() });
    }

    let c;
    try {
        c = await con.conectarBD();
        const datos = req.body;
        const [respuesta] = await c.query(
            'INSERT INTO eventos (nombre_evento, descripcion, fecha, hora_fin, aforo, auditorio_id, estado) VALUES (?,?,?,?,?,?,?) ',
            [datos.nombre_evento, datos.descripcion, datos.fecha, datos.hora_fin, datos.aforo, datos.auditorio_id, datos.estado]
        );

        const nuevo_id = respuesta.insertId;
        //Si existe un nuevo archivo, lo renombramos con el ID
        let rutaRelativa = null;
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads','eventos', nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/eventos/${nuevoNombre}`;

            //actualizamos el campo de  imagen en la BD
            await c.query('UPDATE eventos SET imagen_evento=? WHERE id_evento=?', 
                [rutaRelativa, nuevo_id]
            );
        }

        //Consultamos el registro completo
        const [nuevoEvento] = await c.query('SELECT * FROM eventos WHERE id_evento=?', [nuevo_id]);

        res.status(201).json({ datos: nuevoEvento, idCreada: nuevo_id });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el evento', error : error.message });
    } finally {
        await con.desconectarDB(c);
    }
};

async function update(req, res) {
            
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty() ){
        return res.status(422).json({ errors : result.array() });
    }

    let c;
    try {
        c = await con.conectarBD();
        var id = req.params.id;
        const datos = req.body;

        //Obtenemos los datos actuales del artista
        const [rows] = await c.query(
            'SELECT imagen_evento FROM eventos WHERE id_evento=?',
            [id]
        );

        let rutaImagen = rows[0]?.imagen_evento || null;

        //Si existe una nueva imagen en la peticion
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'eventos', nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            const rutaRelativa = `uploads/eventos/${nuevoNombre}`;

            //Si ya existia una imagen anteriormente, la eliminamos
            if (rutaImagen) {
                const rutaAbsoluta = path.resolve(rutaImagen);

                if (fs.existsSync(rutaAbsoluta)) {
                    fs.unlinkSync(rutaAbsoluta);
                    console.log("Imagen anterior eliminada: ", rutaAbsoluta);
                }
        }

        rutaImagen = rutaRelativa;
    }

    //Actualizamos todos los campos, incliuyendo la imagen (si existe)
        const [respuesta] = await c.query(
            `UPDATE eventos 
            SET nombre_evento=?, descripcion=?, imagen_evento=?, fecha=?, hora_fin=?, aforo=?, auditorio_id=?, estado=? 
            WHERE id_evento=?`,
            [
                datos.nombre_evento, 
                datos.descripcion, 
                rutaImagen, 
                datos.fecha, 
                datos.hora_fin, 
                datos.aforo, 
                datos.auditorio_id, 
                datos.estado, 
                id
            ]
        );
        res.status(200).json({ 
            mensaje : 'Evento actualizado correctamente.', 
            filasModificadas:respuesta.affectedRows,
            datosActualizados: {
                id,
                ...datos,
                imagen_evento: rutaImagen || "Sin cambios",
            },
        });
    } catch (error) {
        res
        .status(400)
        .json({mensaje : 'Error al actualizar el evento.', error:error.message});
    } finally{
        await con.desconectarDB(c);
    }
};

async function destroy (req, res) {
    let c;
    try {
        c = await con.conectarBD(); 
        var id = req.params.id;
        const [respuesta] = await c.query('UPDATE eventos SET estado=? WHERE id_evento=?',
            ['Inactivo', id]);
        res.status(200).json({mensaje : 'Evento dado de baja', datos : respuesta});
    } catch (error) {
        res.status(400).json({mensaje : 'Error en la consulta', error : error.message});
    } finally {
        await con.desconectarDB(c);
    }
};

module.exports = {
    index, show, store, update, destroy
}
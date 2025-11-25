const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const path = require('path');
const fs = require('fs');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const [respuesta] = await c.query('SELECT * FROM usuarios');

        const datosTransformados = respuesta.map(usuario => ({
            ...usuario,
            imagen_usuario: usuario.imagen_usuario
                ? `${baseUrl}/${usuario.imagen_usuario.replace(/\\/g, "/")}`
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
        const [respuesta] = await c.query('SELECT * FROM usuarios WHERE id_usuario=? ', [id]);
        if (respuesta.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado'})
        }

        const usuario = respuesta[0];
        usuario.imagen_usuario = usuario.imagen_usuario
            ? `${baseUrl}/${usuario.imagen_usuario.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: usuario });
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
            'INSERT INTO usuarios (nombre_usuario, contraseña, rol, estado) VALUES (?,?,?,?) ',
            [datos.nombre_usuario, datos.password, datos.rol, datos.estado]
        );
        
        const nuevo_id = respuesta.insertId;
        //Si se subió una imagen, actualizar el nombre con la nueva ID
        let rutaRelativa = null;
        if(req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'usuarios', nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/usuarios/${nuevoNombre}`;

            //Actualizamos el campo de imagen en la BD 
            await c.query('UPDATE usuarios SET imagen_usuario=? WHERE id_usuario=?',
                [rutaRelativa, nuevo_id]
            );

        }
        //Consultamos el registro completo
        const [nuevoUsuario] = await c.query('SELECT * FROM usuarios WHERE id_usuario=? ', [nuevo_id]);

        res.status(200).json({ datos: nuevoUsuario, idCreada: nuevo_id });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el usuario.', error : error.message });
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
        const id = req.params.id;
        const datos = req.body;

        //Obrenemos los datos actuales del usuario
        const [rows] = await c.query(
            'SELECT * FROM usuarios WHERE id_usuario=?', 
            [id]
        );
        
        let rutaImagen = rows[0]?.imagen_usuario || null;

        //Si se subió un archivo en la peticion
        if(req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "usuarios", nuevoNombre);
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/usuarios/${nuevoNombre}`;
            
            //Si habia una imagen anterior la eliminamos
            if (rutaImagen) {
                const rutaAbsoluta = path.resolve(rutaImagen);

                if (fs.existsSync(rutaAbsoluta)) {
                    fs.unlinkSync(rutaAbsoluta);
                    console.log('Imagen anterior eliminada:', rutaAbsoluta);
                }
            }

            rutaImagen = rutaRelativa;
        }
        
        //Actualizamos todos los campos, incluyendo la imagen (si existe)
        const [respuesta] = await c.query(
            `UPDATE usuarios SET nombre_usuario=?, contraseña=?, rol=?, estado=?, imagen_usuario=? 
            WHERE id_usuario=?`,
            [
                datos.nombre_usuario, 
                datos.password, 
                datos.rol, 
                datos.estado, 
                rutaImagen, 
                id
            ]
        );

        res.status(200).json({ 
            mensaje: "Usuario actualizado correctamente",
            filasModificadas:respuesta.affectedRows,
        datosActualizados: {
            id,
            ...datos,
            imagen_usuario: rutaImagen || "Sin cambios",
        },
     });
    } catch (error) {
        res.status(400).json({mensaje : 'Error al actualizar al usuario.', error:error.message});
    } finally{
        await con.desconectarDB(c);
    }
};

async function destroy (req, res) {
    let c;
    try {
        c = await con.conectarBD(); 
        var id = req.params.id;
        const [respuesta] = await c.query('UPDATE usuarios SET estado=? WHERE id_usuario=?',
            ['Inactivo', id]);
        res.status(200).json({mensaje : 'Usuario dado de baja', datos : respuesta});
    } catch (error) {
        res.status(400).json({mensaje : 'Error en la consulta', error : error.message});
    } finally {
        await con.desconectarDB(c);
    }
};

module.exports = {
    index, show, store, update, destroy
}
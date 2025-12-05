const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Importamos los Modelos
const UsuarioSQL = require('../models/sql/Usuario'); 
const UsuarioMongo = require('../models/mongoose/Usuario'); 

// Helper para borrar imagen física (reutilizable)
const borrarImagen = (ruta) => {
    if (ruta && fs.existsSync(path.resolve(ruta))) {
        fs.unlinkSync(path.resolve(ruta));
    }
};

// --- INDEX (Lectura SQL) ---
async function index(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        const usuarios = await UsuarioSQL.findAll();

        const datosTransformados = usuarios.map(u => {
            const usuario = u.toJSON();
            return {
                ...usuario,
                imagen_usuario: usuario.imagen_usuario
                    ? `${baseUrl}/${usuario.imagen_usuario.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json({ datos: datosTransformados });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
}

// --- SHOW (Lectura SQL) ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        const usuarioInstance = await UsuarioSQL.findByPk(id);

        if (!usuarioInstance) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = usuarioInstance.toJSON();
        usuario.imagen_usuario = usuario.imagen_usuario
            ? `${baseUrl}/${usuario.imagen_usuario.replace(/\\/g, "/")}`
            : null;

        res.status(200).json({ datos: usuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al buscar usuario', error: error.message });
    }
}

// --- STORE (Creación Dual - SQL y Mongo) ---
async function store(req, res) {
    // 1. Validaciones de Express Validator
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const datos = req.body;
    let rutaRelativa = null;

    try {
        // 2. Crear en MySQL (Sequelize)
        const nuevoUsuarioSQL = await UsuarioSQL.create({
            nombre_usuario: datos.nombre_usuario,
            password: datos.password, 
            rol: datos.rol,
            estado: datos.estado
        });
        
        const nuevo_id = nuevoUsuarioSQL.id_usuario;

        // 3. Manejo de Imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'usuarios', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/usuarios/${nuevoNombre}`;

            // Actualizar la ruta en el objeto SQL creado
            nuevoUsuarioSQL.imagen_usuario = rutaRelativa;
            await nuevoUsuarioSQL.save();
        }

        // 4. Crear en MongoDB (Espejo)
        // Demostramos la integración guardando el ID de SQL
        const nuevoUsuarioMongo = await UsuarioMongo.create({
            id_sql: nuevo_id,          // <--- CAMPO CLAVE PARA VINCULAR
            nombre_usuario: datos.nombre_usuario,
            password: datos.password,
            rol: datos.rol,
            estado: datos.estado,
            imagen_usuario: rutaRelativa
        });

        res.status(200).json({ 
            mensaje: "Usuario creado en MySQL y MongoDB exitosamente",
            mysql_data: nuevoUsuarioSQL,
            mongo_data: nuevoUsuarioMongo
        });

    } catch (error) {
        // Rollback manual de imagen si falla
        if(rutaRelativa) borrarImagen(rutaRelativa);
        console.error(error); // Ver error en consola de servidor
        res.status(400).json({ mensaje: 'Error al crear el usuario.', error: error.message });
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
        // Buscar usuario SQL
        const usuarioSQL = await UsuarioSQL.findByPk(id);
        if(!usuarioSQL) return res.status(404).json({mensaje: "Usuario no encontrado"});

        let rutaImagen = usuarioSQL.imagen_usuario;

        // Si viene nueva imagen
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join("uploads", "usuarios", nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            
            // Borrar imagen vieja si existía
            if (rutaImagen) borrarImagen(rutaImagen);

            rutaImagen = `uploads/usuarios/${nuevoNombre}`;
        }

        // Actualizar SQL
        await usuarioSQL.update({
            nombre_usuario: datos.nombre_usuario,
            password: datos.password,
            rol: datos.rol,
            estado: datos.estado,
            imagen_usuario: rutaImagen
        });

        // Actualizar Mongo (Sincronización)
        // Buscamos por el id_sql que guardamos al crear
        await UsuarioMongo.findOneAndUpdate(
            { id_sql: id }, 
            { 
                nombre_usuario: datos.nombre_usuario,
                password: datos.password,
                rol: datos.rol,
                estado: datos.estado,
                imagen_usuario: rutaImagen
            }
        );

        res.status(200).json({ 
            mensaje: "Usuario actualizado correctamente",
            datos: usuarioSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
}

// --- DESTROY (Borrado Lógico Dual) ---
async function destroy(req, res) {
    const id = req.params.id;

    try {
        // 1. Buscar en SQL
        const usuarioSQL = await UsuarioSQL.findByPk(id);
        
        if (!usuarioSQL) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // 2. Borrado Lógico en SQL (Update estado)
        // .update() actualiza automáticamente el campo updated_at
        await usuarioSQL.update({ estado: 'Inactivo' });

        // 3. Borrado Lógico en Mongo (Para mantener coherencia)
        await UsuarioMongo.findOneAndUpdate(
            { id_sql: id },
            { estado: 'Inactivo' }
        );

        res.status(200).json({ 
            mensaje: 'Usuario dado de baja con borrado lógico', 
            usuario: usuarioSQL 
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
    // NOTA: Ya no necesitamos 'finally' para cerrar conexión, 
    // Sequelize gestiona el pool automáticamente.
}

module.exports = { index, show, store, update, destroy };
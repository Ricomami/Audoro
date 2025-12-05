const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// 1. IMPORTAMOS AMBOS MODELOS
// Renombramos para no confundirnos
const UsuarioSQL = require('../../models/sql/Usuario'); 
const UsuarioMongo = require('../../models/nosql/Usuario');

// Helper para borrar imagen (reutilizable)
const borrarImagen = (ruta) => {
    if (ruta && fs.existsSync(path.resolve(ruta))) {
        fs.unlinkSync(path.resolve(ruta));
    }
};

// --- MÉTODO INDEX (Lectura con Sequelize) ---
// Es mucho más corto que tu versión con raw SQL
async function index(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        // Sequelize: findAll reemplaza a "SELECT * FROM..."
        const usuarios = await UsuarioSQL.findAll();

        const datosTransformados = usuarios.map(u => {
            const usuario = u.toJSON(); // Convertir instancia a objeto plano
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

// --- MÉTODO SHOW (Lectura con Sequelize) ---
async function show(req, res) {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const id = req.params.id;

        // Sequelize: findByPk busca por Primary Key
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

// --- MÉTODO STORE (LA DEMOSTRACIÓN DE DOBLE ESCRITURA) ---
async function store(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const datos = req.body;
    let rutaRelativa = null;

    try {
        // 1. Guardar primero en MySQL con Sequelize
        // Esto te genera el ID relacional que podrías necesitar
        const nuevoUsuarioSQL = await UsuarioSQL.create({
            nombre_usuario: datos.nombre_usuario,
            contraseña: datos.password, // Asegúrate que tu modelo SQL tenga este campo mapeado
            rol: datos.rol,
            estado: datos.estado
        });
        
        const nuevo_id = nuevoUsuarioSQL.id_usuario; // Asumiendo que esa es tu PK

        // 2. Manejo de Imagen (igual que tenías, pero usando el objeto de Sequelize)
        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
            const nuevaRuta = path.join('uploads', 'usuarios', nuevoNombre);
            
            fs.renameSync(req.file.path, nuevaRuta);
            rutaRelativa = `uploads/usuarios/${nuevoNombre}`;

            // Actualizamos el registro SQL con la ruta
            nuevoUsuarioSQL.imagen_usuario = rutaRelativa;
            await nuevoUsuarioSQL.save();
        }

        // 3. AQUÍ LA "TRAMPA": Guardar TAMBIÉN en Mongo (Mongoose)
        // Usamos los mismos datos para crear un documento espejo
        // Nota: En Mongo no definimos el ID manual usualmente, dejamos que cree su _id
        const nuevoUsuarioMongo = await UsuarioMongo.create({
            sql_ref_id: nuevo_id, // Tip: Guarda la ID de SQL en Mongo para referencia futura
            nombre_usuario: datos.nombre_usuario,
            contraseña: datos.password,
            rol: datos.rol,
            estado: datos.estado,
            imagen_usuario: rutaRelativa // Guardamos la misma ruta de imagen
        });

        // Respuesta
        res.status(200).json({ 
            mensaje: "Usuario creado en MySQL y MongoDB exitosamente",
            mysql_data: nuevoUsuarioSQL,
            mongo_data: nuevoUsuarioMongo
        });

    } catch (error) {
        // Si falla, idealmente deberías borrar la imagen si se subió
        if(rutaRelativa) borrarImagen(rutaRelativa);
        res.status(400).json({ mensaje: 'Error al crear el usuario.', error: error.message });
    }
}

// --- MÉTODO UPDATE (Simplificado con Sequelize) ---
async function update(req, res) {
    // ... validaciones ...
    const id = req.params.id;
    const datos = req.body;

    try {
        const usuarioSQL = await UsuarioSQL.findByPk(id);
        if(!usuarioSQL) return res.status(404).json({mensaje: "Usuario no encontrado"});

        let rutaImagen = usuarioSQL.imagen_usuario;

        if (req.file) {
             // Lógica de reemplazo de imagen...
             // ...
             // Al final actualizas rutaImagen
        }

        // Actualizar SQL
        await usuarioSQL.update({
            nombre_usuario: datos.nombre_usuario,
            contraseña: datos.password,
            rol: datos.rol,
            estado: datos.estado,
            imagen_usuario: rutaImagen
        });

        // Opcional: Actualizar Mongo también (búscalo por sql_ref_id o nombre)
        // await UsuarioMongo.findOneAndUpdate({ sql_ref_id: id }, { ...datos ... });

        res.status(200).json({ mensaje: "Usuario actualizado" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ... destroy similar con usuarioSQL.update({ estado: 'Inactivo' }) ...

module.exports = { index, show, store, update, destroy };
const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const path = require('path');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const [respuesta] = await c.query('SELECT * FROM artistas');
        res.status(200).json({ datos: respuesta });
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
        var id = req.params.id;
        var [respuesta] = await c.query('SELECT * FROM artistas WHERE id_artista=? ', [id]);
        res.status(200).json({ datos: respuesta[0] });
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
        // res.json({datos});  
        const [respuesta] = await c.query('INSERT INTO artistas (nombre_artista, genero, descripcion) VALUES (?,?,?) ',
            [datos.nombre_artista, datos.genero, datos.descripcion]);
        res.status(200).json({ datos: respuesta, idCreada: respuesta.insertId });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en la consulta', error : error.message });
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
        // res.json({datos : datos});
        const [respuesta] = await c.query('UPDATE artistas SET nombre_artista=?, genero=?, descripcion=?, estado=? WHERE id_artista=?',
            [datos.nombre_artista, datos.genero, datos.descripcion, datos.estado, id]);
        res.status(200).json({ datos: respuesta, mensaje : 'Filas actualizadas', filasModificadas : respuesta.affectedRows });
    } catch (error) {
        res.status(400).json({mensaje : 'Error en la consulta', error:error.message});
    } finally{
        await con.desconectarDB(c);
    }
};

async function destroy (req, res) {
    let c;
    try {
        c = await con.conectarBD(); 
        var id = req.params.id;
        const [respuesta] = await c.query('UPDATE artistas SET estado=? WHERE id_artista=?',
            ['Inactivo', id]);
        res.status(200).json({mensaje : 'Artista  dado de baja', datos : respuesta});
    } catch (error) {
        res.status(400).json({mensaje : 'Error en la consulta', error : error.message});
    }finally{
        await con.desconectarDB(c);
    }
};

const uploadImagenArtista = async (req, res) => {
    let c;
    try {
        c = await con.conectarBD();
        //Verificar que se haya subido el archivo
        if (!req.file) {
            return res.status(400).json({ mensaje : 'No se subió ninguna imagen' });
        } 

        //Se extraen los datos del archivo
        const id = req.params.id;
        const rutaArchivo = path.join('uploads', 'artistas', req.file.filename);
        //Guardamos en la BD
        await c.query('UPDATE artistas SET imagen_artista = ? WHERE id_artista=?',
            [rutaArchivo, id]
        );
        res.status(200).json({ mensaje : "Imagen del artista ${id} subida correctamente", archivo: rutaArchivo})


    } catch (error) {
        console.error(error);
        return res.status(400).json({ mensaje : "Error al subir la imagen", error : error.message});
    }
};

module.exports = { 
    uploadImagenArtista,
    index, show, store, update, destroy
}
const con = require('../../db/mysql');
const { validationResult } = require('express-validator');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const [respuesta] = await c.query('SELECT * FROM secciones');
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
        const [respuesta] = await c.query('SELECT * FROM secciones WHERE id_seccion=? ', [id]);
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
        const [respuesta] = await c.query('INSERT INTO secciones (nombre_seccion, precio_base, auditorio_id) VALUES (?,?,?) ',
            [datos.nombre_seccion, datos.precio_base, datos.auditorio_id]);
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
        const [respuesta] = await c.query('UPDATE secciones SET nombre_seccion=?, precio_base=?, auditorio_id=?, estado=? WHERE id_seccion=?',
            [datos.nombre_seccion, datos.precio_base, datos.auditorio_id, datos.estado, id]);
        res.status(200).json({ datos: respuesta, mensaje : 'Filas actualizadas', filasModificadas:respuesta.affectedRows });
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
        const [respuesta] = await c.query('UPDATE secciones SET estado=? WHERE id_seccion=?',
            ['Inactivo', id]);
        res.status(200).json({mensaje : 'Seccion dada de baja', datos : respuesta});
    } catch (error) {
        res.status(400).json({mensaje : 'Error en la consulta', error : error.message});
    }
};

module.exports = {
    index, show, store, update, destroy
}
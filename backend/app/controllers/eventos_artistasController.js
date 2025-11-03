const con = require('../../db/mysql');
const { validationResult } = require('express-validator');

async function index(req, res) {
    let c;
    try {
        c = await con.conectarBD();
        const [respuesta] = await c.query('SELECT * FROM eventos_artistas');
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
        var evento_id = req.params.evento_id;
        var artista_id = req.params.artista_id;
        const [respuesta] = await c.query('SELECT * FROM eventos_artistas WHERE evento_id=? AND artista_id=?', [evento_id, artista_id]);
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
        const [respuesta] = await c.query('INSERT INTO eventos_artistas (evento_id, artista_id, estado) VALUES (?,?,?) ',
            [datos.evento_id, datos.artista_id, datos.estado]);
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
        const {evento_id, artista_id} = req.params;
        const datos = req.body;
        const [respuesta] = await c.query('UPDATE eventos_artistas SET evento_id=?, artista_id=?, estado=? WHERE evento_id=? AND artista_id=?',
            [datos.evento_id, datos.artista_id, datos.estado, evento_id, artista_id]);
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
        var evento_id = req.params.evento_id;
        var artista_id = req.params.artista_id;
        const [respuesta] = await c.query('UPDATE eventos_artistas SET estado=? WHERE evento_id=? AND artista_id=?',
            ['Inactivo', evento_id, artista_id]);
        res.status(200).json({mensaje : 'Evento de artista  dado de baja', datos : respuesta});
    } catch (error) {
        res.status(400).json({mensaje : 'Error en la consulta', error : error.message});
    }
};

module.exports = {
    index, show, store, update, destroy
}
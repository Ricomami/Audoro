const con = require('../../db/mysql');
const { validationResult } = require('express-validator');

async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const [respuesta] = await c.query('SELECT * FROM auditorios');
    res.status(200).json({ datos: respuesta });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

async function show(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const id = req.params.id;
    const [respuesta] = await c.query(
      'SELECT * FROM auditorios WHERE id_auditorio=?',
      [id]
    );
    res.status(200).json({ datos: respuesta });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}


async function store(req, res) {
  //VALIDACION DE DATOS INGRESADOS
  //resultado validado del express-validator
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
      'INSERT INTO auditorios (id_auditorio, nombre, capacidad, direccion, estado) VALUES (?,?,?,?,?)',
      [datos.id_auditorio, datos.nombre, datos.capacidad, datos.direccion, datos.estado]
    );
    res.status(200).json({ datos: datos, idCreada: respuesta.insertId });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

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
    const [respuesta] = await c.query(
      'UPDATE auditorios SET nombre=?, capacidad=?, direccion=?, estado=? WHERE id_auditorio=?',
      [datos.nombre, datos.capacidad, datos.direccion, datos.estado, id]
    );
    res.status(200).json({ mensaje: "Filas actualizadas", filasmodificadas: respuesta.affectedRows });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

async function destroy(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const id = req.params.id;
    const [respuesta] = await c.query(
      'UPDATE auditorios SET estado=? WHERE id_auditorio=?',
      ['Inactivo', id]
    );
    res.status(200).json({ mensaje: "Auditorio dado de baja", filasmodificadas: respuesta.affectedRows });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy };

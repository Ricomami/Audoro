const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const [respuesta] = await c.query('SELECT * FROM auditorios');

    const datosTransformados = respuesta.map(auditorio => ({
      ...auditorio,
      imagen_auditorio: auditorio.imagen_auditorio
        ? `${baseUrl}/${auditorio.imagen_auditorio.replace(/\\/g, "/")}`
        : null
    }));
    res.status(200).json({ datos: datosTransformados });
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
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const id = req.params.id;
    const [respuesta] = await c.query('SELECT * FROM auditorios WHERE id_auditorio=?', [id]);
    if (respuesta.length === 0) {
      return res.status(404).json({ mensaje: 'Auditorio no encontrado' });
    }

    const auditorio = respuesta[0];
    auditorio.imagen_auditorio = auditorio.imagen_auditorio
      ? `${baseUrl}/${auditorio.imagen_auditorio.replace(/\\/g, "/")}`
      : null;

    res.status(200).json({ datos: auditorio });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}


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
      'INSERT INTO auditorios (id_auditorio, nombre, capacidad, direccion, estado) VALUES (?,?,?,?,?)',
      [datos.id_auditorio, datos.nombre, datos.capacidad, datos.direccion, datos.estado]
    );

    const nuevo_id = respuesta.insertId;
    //Si existe un archivo de imagen, lo renombramos con el ID
    let rutaRelativa = null;
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
      const nuevaRuta = path.join('uploads', 'auditorios', nuevoNombre);
      fs.renameSync(req.file.path, nuevaRuta);
      rutaRelativa = `uploads/auditorios/${nuevoNombre}`;

      //Actualizamos el campo de imagen en la BD
      await c.query('UPDATE auditorios SET imagen_auditorio=? WHERE  id_auditorio=?',
        [rutaRelativa, nuevo_id]
      );
    }

    //Consultamos el registro completo
    const [nuevoAuditorio] = await c.query('SELECT * FROM auditorios WHERE id_auditorio=?', [nuevo_id]);

    res.status(201).json({ datos: nuevoAuditorio, idCreada: nuevo_id });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el auditorio', error: error.message });
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

    // Previo a la insersión, obtenemosla imagen actual del auditorio
    const [rows] = await c.query(
      "SELECT imagen_auditorio FROM auditorios WHERE id_auditorio = ?",
      [id]
    );

    let rutaImagen = rows[0]?.imagen_auditorio || null;

    // Si viene una nueva imagen en la petición
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const nuevoNombre = `${id}-${Date.now()}${extension}`;
      const nuevaRuta = path.join("uploads", "auditorios", nuevoNombre);
      fs.renameSync(req.file.path, nuevaRuta);
      rutaRelativa = `uploads/auditorios/${nuevoNombre}`;


      // Si había una imagen anterior, la eliminamos
      if (rutaImagen) {
        const rutaAbsoluta = path.resolve(rutaImagen);

        if (fs.existsSync(rutaAbsoluta)) {
          fs.unlinkSync(rutaAbsoluta);
          console.log("Imagen anterior eliminada:", rutaAbsoluta);
        }
      }

      rutaImagen = rutaRelativa;
    }

    //Actualizamos todos los campos del cliente, incluyendo la imagen.

    const [respuesta] = await c.query(
      'UPDATE auditorios SET nombre=?, capacidad=?, direccion=?, imagen_auditorio=?, estado=? WHERE id_auditorio=?',
      [datos.nombre, datos.capacidad, datos.direccion, rutaImagen, datos.estado, id]
    );
    res.status(200).json({
      mensaje: "Auditorio actualizado correctamente.",
      filasModificadas: respuesta.affectedRows,
      datosActualizados: {
        id,
        ...datos,
        imagen_auditorio: rutaImagen || "Sin cambios",
      },
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar auditorio.', error: error.message });
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
    res.status(200).json({ mensaje: "Auditorio dado de baja.", filasmodificadas: respuesta.affectedRows });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta.', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy };

const con = require('../../db/mysql');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const [respuesta] = await c.query('SELECT * FROM artistas');

    const datosTransformados = respuesta.map(artista => ({
      ...artista,
      imagen_artista: artista.imagen_artista
        ? `${baseUrl}/${artista.imagen_artista.replace(/\\/g, "/")}`
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
    const [respuesta] = await c.query('SELECT * FROM artistas WHERE id_artista=? ', [id]);
    if (respuesta.length === 0) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    const artista = respuesta[0];
    artista.imagen_artista = artista.imagen_artista
      ? `${baseUrl}/${artista.imagen_artista.replace(/\\/g, "/")}`
      : null;

    res.status(200).json({ datos: artista });
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
      'INSERT INTO artistas (nombre_artista, genero, descripcion, estado) VALUES (?,?,?,?) ',
      [datos.nombre_artista, datos.genero, datos.descripcion, datos.estado]
    );

    const nuevo_id = respuesta.insertId;
    //Si existe un archivo, lo renombramos con el ID
    let rutaRelativa = null;
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const nuevoNombre = `${nuevo_id}-${Date.now()}${extension}`;
      const nuevaRuta = path.join('uploads', 'artistas', nuevoNombre);
      fs.renameSync(req.file.path, nuevaRuta);
      rutaRelativa = `uploads/artistas/${nuevoNombre}`;

      //Actualizamos el campo imagen en la BD
      await c.query('UPDATE artistas SET imagen_artista=? WHERE id_artista=?',
        [rutaRelativa, nuevo_id]
      );
    }

    //Consultamos el registro completo
    const [nuevoArtista] = await c.query('SELECT * FROM artistas WHERE id_artista=?', [nuevo_id]);

    res.status(201).json({ datos: nuevoArtista, idCreada: nuevo_id });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el artista', error: error.message });
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
    
    // Obtener los datos actuales del artista
    const [rows] = await c.query(
      "SELECT imagen_artista FROM artistas WHERE id_artista = ?",
      [id]
    );

    let rutaImagen = rows[0]?.imagen_artista || null;

    // Si viene una nueva imagen en la petición
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const nuevoNombre = `${id}-${Date.now()}${extension}`;
      const nuevaRuta = path.join("uploads", "artistas", nuevoNombre);
      fs.renameSync(req.file.path, nuevaRuta);
      rutaRelativa = `uploads/artistas/${nuevoNombre}`;


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

    // Actualizamos todos los campos, incluyendo la imagen (si existe)
    const [respuesta] = await c.query(
      `UPDATE artistas 
       SET nombre_artista=?, genero=?, descripcion=?, estado=?, imagen_artista=?
       WHERE id_artista=?`,
      [
        datos.nombre_artista,
        datos.genero,
        datos.descripcion,
        datos.estado,
        rutaImagen,
        id,
      ]
    );

    res.status(200).json({
      mensaje: "Artista actualizado correctamente.",
      filasModificadas: respuesta.affectedRows,
      datosActualizados: {
        id,
        ...datos,
        imagen: rutaImagen || "Sin cambios",
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ mensaje: "Error al actualizar artista.", error: error.message });
  } finally {
    if (c) await con.desconectarDB(c);
  }
}


async function destroy(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    var id = req.params.id;
    const [respuesta] = await c.query('UPDATE artistas SET estado=? WHERE id_artista=?',
      ['Inactivo', id]);
    res.status(200).json({ mensaje: 'Artista dado de baja.', datos: respuesta });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error en la consulta.', error: error.message });
  } finally {
    await con.desconectarDB(c);
  }
};


module.exports = {
  index, show, store, update, destroy
}
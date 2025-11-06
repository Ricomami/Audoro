const path = require('path');
const con = require('../../db/mysql'); // o tu archivo de conexión
// Aquí suponemos que cada tabla tiene un campo imagen_*

const uploadImagenGenerica = async (req, res) => {
  try {
    const { tipo, id } = req.params;

    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ninguna imagen' });
    }

    const rutaRelativa = `/uploads/${tipo}/${req.file.filename}`;

    // 🔥 Definir a qué tabla actualizar según tipo
    let campoImagen;
    switch (tipo) {
    case 'artistas':
        campoImagen = 'imagen_artista';
        break;
    case 'auditorios':
        campoImagen = 'imagen_auditorio';
        break;
    case 'clientes':
        campoImagen = 'imagen_cliente';
        break;
    case 'eventos':
        campoImagen = 'imagen_evento';
        break;
    case 'usuarios':
        campoImagen = 'imagen_usuario';
        break;
      default:
        return res.status(400).json({ mensaje: `Tipo no manejado: ${tipo}` });
    }

    const c = await con.conectarBD();
    await c.query(
      `UPDATE ${tipo} SET ${campoImagen}=? WHERE id_${tipo.slice(0, -1)}=?`, 
      [rutaRelativa, id]
    );

    res.status(200).json({
      mensaje: `Imagen de ${tipo.slice(0, -1)} ${id} subida correctamente`,
      archivo: rutaRelativa
    });
    console.log("Imagen subida correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al subir la imagen', error: error.message });
  }
};

module.exports = { uploadImagenGenerica };
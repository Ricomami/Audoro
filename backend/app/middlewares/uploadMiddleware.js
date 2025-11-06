const multer = require('multer');
const path = require('path');
const fs = require('fs');

///Tipos de carpetas permitidos (seguridad)
const tiposValidos = ['artistas','clientes','auditorios','secciones','usuarios','eventos'];

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        const tipo = req.params.tipo; //'artistas', 'clientes' o 'eventos'

        //Verificamos que el tipo sea válido
        if (!tiposValidos.includes(tipo)) {
            return cb(new Error(`Tipo de entidad no válido: ${tipo}`));
        }

        const carpetaDestino = path.join(__dirname, `../uploads/${tipo}`);

        //Si no existe la carpeta se crea
        if (!fs.existsSync(carpetaDestino)) {
            fs.mkdirSync(carpetaDestino, { recursive: true});
        }

        cb(null, carpetaDestino);
    },
    filename: (req, file, cb) => {
        const id = req.params.id; //ID del registro de artistas, auditorios, clientes, eventos, secciones y usuarios
        const extension = path.extname(file.originalname);
        const nombreArchivo = `${id}-${Date.now()}${extension}`;
        cb(null, nombreArchivo);

        // const id = req.params.id; //ID del registro de artistas, auditorios, clientes, eventos, secciones y usuarios
        // const extension = path.extname(file.originalname);
        // const nombreArchivo = `${id}-${Date.now()}
        // ${extension}`;
        // cb(null, nombreArchivo);
    }
});

//Validar tipo de arhivo
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const esValido = tiposPermitidos.test(file.mimetype);

  if (esValido) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
};


//Configuracion final de multer
const upload = multer({
    storage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } //3 MB maximo
});

module.exports = upload;
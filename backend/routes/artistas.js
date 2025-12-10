const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const artistasController = require('../app/controllers/artistasController');

// --- MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/artistas/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });

// --- LECTURAS ---
router.get('/', artistasController.index);
router.get('/:id', artistasController.show);

// --- VALIDACIONES ---
const rules = [
    body('nombre_artista')
        .trim()
        .notEmpty().withMessage("El nombre del artista es requerido"),
    
    body('genero')
        .trim()
        .notEmpty().withMessage("El género del artista es requerido"),
    
    body('descripcion')
        .optional()
        .trim(),

    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Suspendido','Archivado'])
        .withMessage("Estado no válido")
];

// --- ESCRITURAS ---
// Nota: 'imagen' es el nombre del campo que envías desde Angular/Postman
router.post('/', upload.single("imagen"), rules, artistasController.store);
router.put('/:id', upload.single("imagen"), rules, artistasController.update);
router.delete('/:id', artistasController.destroy);

module.exports = router;
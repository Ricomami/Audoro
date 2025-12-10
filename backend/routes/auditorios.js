const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { body } = require('express-validator');
const auditoriosController = require('../app/controllers/auditoriosController'); 

// --- MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/auditorios/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });

// --- LECTURAS ---
router.get('/', auditoriosController.index);
router.get('/:id', auditoriosController.show);

// --- VALIDACIONES ---
const rules = [
    body('nombre')
        .trim()
        .notEmpty().withMessage("El nombre no puede estar vacío"),
    
    body('capacidad')
        .trim()
        .notEmpty().withMessage("La capacidad es requerida")
        .isInt({ min: 1 }).withMessage("La capacidad debe ser un entero positivo"),
    
    body('direccion')
        .optional()
        .trim(),
    
    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Archivado'])
];

// --- ESCRITURAS ---
router.post('/', upload.single("imagen_auditorio"), rules, auditoriosController.store);
router.put('/:id', upload.single("imagen_auditorio"), rules, auditoriosController.update);
router.delete('/:id', auditoriosController.destroy);

module.exports = router;
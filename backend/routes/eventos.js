const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const eventosController = require('../app/controllers/eventosController');

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/eventos/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });

// --- LECTURAS ---
router.get('/', eventosController.index);
router.get('/:id', eventosController.show);

// --- VALIDACIONES ---
const rules = [
    body('nombre_evento')
        .trim()
        .notEmpty().withMessage("El nombre del evento es requerido"),
    
    body('auditorio_id')
        .trim()
        .notEmpty().withMessage("El auditorio es requerido")
        .isInt().withMessage("El ID de auditorio debe ser entero"),

    body('fecha')
        .notEmpty().withMessage("La fecha de inicio es requerida")
        .isISO8601().withMessage("Formato de fecha inválido (YYYY-MM-DDTHH:mm)")
        .toDate(),

    body('hora_fin')
        .notEmpty().withMessage("La hora de fin es requerida")
        .isISO8601().withMessage("Formato de hora fin inválido")
        .toDate(),
    
    body('aforo')
        .optional()
        .isInt({ min: 0 }).withMessage("El aforo debe ser un número positivo"),
    
    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Archivado'])
];

// --- ESCRITURAS ---
router.post('/', upload.single('imagen_evento'), rules, eventosController.store);
router.put('/:id', upload.single('imagen_evento'), rules, eventosController.update);
router.delete('/:id', eventosController.destroy);

module.exports = router;
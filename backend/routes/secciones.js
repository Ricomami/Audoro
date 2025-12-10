const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator'); // No necesitas validationResult aqui, eso va en el controller
const seccionesController = require('../app/controllers/seccionesController');

// --- CONFIGURACIÓN MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que esta carpeta exista
        cb(null, "uploads/secciones/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });

// --- RUTAS ---

router.get('/', seccionesController.index);
router.get('/:id', seccionesController.show);

// --- VALIDACIONES PARA CREAR (STORE) ---
const rulesStore = [
    body('nombre_seccion')
        .trim() // Quita espacios al inicio/final
        .notEmpty().withMessage("El nombre de la sección es requerido")
        // Esta Regex permite letras (a-z), acentos, ñ y ESPACIOS (\s), pero no símbolos
        .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d10-9\s]+$/).withMessage("El nombre contiene caracteres no válidos"),
    
    body('auditorio_id')
        .trim()
        .notEmpty().withMessage("El auditorio es requerido")
        .bail()
        .isInt().withMessage("El ID del auditorio debe ser un número entero"),
    
    // Opcional: Validar estado si lo envías al crear
    body('estado').optional().trim()
];

// Ojo: 'imagen_seccion' debe coincidir con el name del input en Angular/Postman
router.post('/', upload.single('imagen_seccion'), rulesStore, seccionesController.store);

// --- VALIDACIONES PARA EDITAR (UPDATE) ---
const rulesUpdate = [
    body('nombre_seccion')
        .optional()
        .trim()
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d10-9\s]+$/).withMessage("Caracteres no válidos"),

    body('auditorio_id')
        .optional()
        .trim()
        .isInt().withMessage("El ID del auditorio debe ser entero"),

    body('estado')
        .trim()
        .notEmpty().withMessage("El estado es requerido")
        .bail()
        // isAlpha PROHÍBE espacios. Si tu estado es "En Espera" fallará.
        // Como usas un ENUM fijo (Activo, Inactivo), isIn es mejor:
        .isIn(['Activo','Inactivo','Pendiente','Suspendido','Archivado'])
        .withMessage("Estado no válido")
];

router.put('/:id', upload.single('imagen_seccion'), rulesUpdate, seccionesController.update);

router.delete('/:id', seccionesController.destroy);

module.exports = router;
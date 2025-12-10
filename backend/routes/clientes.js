const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const clientesController = require('../app/controllers/clientesController');

// --- MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/clientes/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });

// --- LECTURAS ---
router.get('/', clientesController.index);
router.get('/:id', clientesController.show);

// --- VALIDACIONES ---
const rules = [
    body('nombre')
        .trim()
        .notEmpty().withMessage("El nombre es requerido"),
    
    body('apellido_pat')
        .trim()
        .notEmpty().withMessage("El apellido paterno es requerido"),
    
    body('apellido_mat')
        .optional()
        .trim(),

    body('correo')
        .trim()
        .notEmpty().withMessage("El correo es requerido")
        .isEmail().withMessage("Formato de correo inválido"),

    body('telefono')
        .trim()
        .notEmpty().withMessage("El teléfono es requerido")
        .isLength({ min: 10, max: 10 }).withMessage("El teléfono debe tener 10 dígitos")
        .isNumeric().withMessage("Solo números"),

    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Suspendido'])
        .withMessage("Estado no válido")
];

// --- ESCRITURAS ---
router.post('/', upload.single("imagen_cliente"), rules, clientesController.store);
router.put('/:id', upload.single("imagen_cliente"), rules, clientesController.update);
router.delete('/:id', clientesController.destroy);

module.exports = router;
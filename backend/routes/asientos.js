const express = require('express');
const router = express.Router(); // Cambié 'routes' por 'router' por convención estándar
const { body } = require('express-validator');
const asientosController = require('../app/controllers/asientosController');

// --- LECTURAS ---
router.get('/', asientosController.index);
router.get('/:id', asientosController.show);

// --- VALIDACIONES ---
const rules = [
    body('seccion_id')
        .trim()
        .notEmpty().withMessage("El ID de la sección es requerido")
        .isInt().withMessage("El ID de la sección debe ser entero"),
    
    body('fila')
        .trim()
        .notEmpty().withMessage("La fila es requerida")
        .isAlpha().withMessage("La fila solo puede ser una letra")
        .isLength({ min: 1, max: 1 }).withMessage("La fila debe ser un solo caracter")
        .toUpperCase(), // Convierte a mayúscula automáticamente
    
    body('numero_asiento')
        .trim()
        .notEmpty().withMessage("El número de asiento es requerido")
        .isInt({ min: 1 }).withMessage("El número de asiento debe ser positivo"),

    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente'])
        .withMessage("Estado no válido")
];

// --- ESCRITURAS ---
router.post('/', rules, asientosController.store);
router.put('/:id', rules, asientosController.update);
router.delete('/:id', asientosController.destroy);

module.exports = router;
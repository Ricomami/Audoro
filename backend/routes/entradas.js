const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const entradasController = require('../app/controllers/entradasController');

// --- LECTURAS ---
router.get('/', entradasController.index);
router.get('/:id', entradasController.show);

// --- VALIDACIONES COMUNES ---
const validacionesEntrada = [
    body('asiento_id')
        .trim()
        .notEmpty().withMessage("El ID del asiento es requerido")
        .isInt().withMessage("El ID del asiento debe ser entero"),

    body('pago_id')
        .trim()
        .notEmpty().withMessage("El ID del pago es requerido")
        .isInt().withMessage("El ID del pago debe ser entero"),

    body('funcion_id')
        .trim()
        .notEmpty().withMessage("El ID de la función es requerido")
        .isInt().withMessage("El ID de la función debe ser entero"),

    body('cliente_id')
        .trim()
        .notEmpty().withMessage("El ID del cliente es requerido")
        .isInt().withMessage("El ID del cliente debe ser entero"),
    
    // Agregué validación de precio_final al crear también
    body('precio_final')
        .optional()
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),

    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Archivado'])
        .withMessage("Estado no válido")
];

// --- ESCRITURAS ---
router.post('/', validacionesEntrada, entradasController.store);
router.put('/:id', validacionesEntrada, entradasController.update);
router.delete('/:id', entradasController.destroy);

module.exports = router;
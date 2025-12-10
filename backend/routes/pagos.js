const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pagosController = require('../app/controllers/pagosController');

// --- LECTURAS ---
router.get('/', pagosController.index);
router.get('/:id', pagosController.show);

// --- VALIDACIONES COMUNES ---
const validacionesPago = [
    body('cliente_id')
        .trim()
        .notEmpty().withMessage("El ID del cliente es requerido")
        .isInt().withMessage("El ID del cliente debe ser un número entero"),
    
    body('metodo_pago')
        .trim()
        .notEmpty().withMessage("El método de pago es requerido"),
        // .isIn(['Efectivo', 'Tarjeta', 'Transferencia']) // Podrías agregar esto si quieres
    
    body('monto')
        .trim()
        .notEmpty().withMessage("El monto es requerido")
        .isFloat({ min: 0 }).withMessage("El monto debe ser un número positivo")
        .toFloat(), // Convierte el string a número decimal

    body('fecha_pago')
        .optional()
        .isISO8601().withMessage("Formato de fecha inválido (Use YYYY-MM-DD)"),

    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Suspendido','Archivado'])
];

// --- ESCRITURAS ---
router.post('/', validacionesPago, pagosController.store);
router.put('/:id', validacionesPago, pagosController.update);
router.delete('/:id', pagosController.destroy);

module.exports = router;
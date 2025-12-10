const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const funcionesController = require('../app/controllers/funcionesController');

// --- LECTURAS ---
router.get('/', funcionesController.index);
router.get('/:id', funcionesController.show);

// --- VALIDACIONES COMUNES ---
const validacionesFuncion = [
    body('evento_id')
        .trim()
        .notEmpty().withMessage("El ID del evento es requerido")
        .isInt().withMessage("El ID del evento debe ser un número entero"),

    body('fecha_hora_funcion')
        .trim()
        .notEmpty().withMessage("La fecha y hora es requerida")
        // Valida que el string tenga formato de fecha (YYYY-MM-DD o ISO)
        .isISO8601().withMessage("Formato de fecha inválido (Use formato ISO: YYYY-MM-DDTHH:mm:ss)")
        .toDate(), // Convierte el string a objeto Date para el controlador

    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Suspendido'])
        .withMessage("Estado no válido")
];

// --- ESCRITURAS ---
router.post('/', validacionesFuncion, funcionesController.store);
router.put('/:id', validacionesFuncion, funcionesController.update);
router.delete('/:id', funcionesController.destroy);

module.exports = router;
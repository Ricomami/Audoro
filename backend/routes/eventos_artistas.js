const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const eventos_artistasController = require('../app/controllers/eventos_artistasController');

// --- LECTURAS ---
router.get('/', eventos_artistasController.index);

// OJO: Necesitamos dos parámetros en la URL
router.get('/:evento_id/:artista_id', eventos_artistasController.show);

// --- VALIDACIONES ---
const rules = [
    body('evento_id')
        .trim()
        .notEmpty().withMessage("El id del evento es requerido")
        .isInt().withMessage("El id del evento debe ser entero"),
        
    body('artista_id')
        .trim()
        .notEmpty().withMessage("El id del artista es requerido")
        .isInt().withMessage("El id del artista debe ser entero"),
    
    body('estado')
        .optional()
        .trim()
        .isIn(['Activo','Inactivo','Pendiente','Archivado'])
        .withMessage("Estado no válido")
];

// --- ESCRITURAS ---
router.post('/', rules, eventos_artistasController.store);

router.put('/:evento_id/:artista_id', rules, eventos_artistasController.update);

// CORRECCIÓN IMPORTANTE: Borrar requiere ambos IDs
router.delete('/:evento_id/:artista_id', eventos_artistasController.destroy);

module.exports = router;
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const entradasController = require('../app/controllers/entradasController')

router.get('/', entradasController.index
//     (req, res) => {
//     res.json({ok:true,msg:`Muestra todas las entradas, SELECT * FROM entradas`})
// }
);

router.get('/:id', entradasController.show
//     (req,res) =>{
//     res.json({ok:true, msg:`Muestra solo la entrada con el id=${req.params.id}, SELECT FROM entradas WHERE id=${req.params.id} `})
// }
);
const rules = [
    body('asiento_id')
        .escape()
        .notEmpty()
        .withMessage("El id del asiento de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del asiento solo puede ser un numero entero"),
    body('pago_id')
        .escape()
        .notEmpty()
        .withMessage("El id del pago de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del pago solo puede ser un numero entero"),
    body('funcion_id')
        .escape()
        .notEmpty()
        .withMessage("El id de la funcion de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id de la funcion solo puede ser un numero entero"),
    body('cliente_id')
        .escape()
        .notEmpty()
        .withMessage("El id del cliente de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del cliente solo puede ser un numero entero"),
];

router.post('/', rules, entradasController.store
//     (req, res) =>[
//     res.json({ok:true,msg:`Funcion para insertar una nueva entrada, INSERT INTO entradas...`})
// ]
);

const rules2 = [
    body('asiento_id')
        .escape()
        .notEmpty()
        .withMessage("El id del asiento de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del asiento solo puede ser un numero entero"),
    body('pago_id')
        .escape()
        .notEmpty()
        .withMessage("El id del pago de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del pago solo puede ser un numero entero"),
    body('funcion_id')
        .escape()
        .notEmpty()
        .withMessage("El id de la funcion de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id de la funcion solo puede ser un numero entero"),
    body('cliente_id')
        .escape()
        .notEmpty()
        .withMessage("El id del cliente de la entrada es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del cliente solo puede ser un numero entero"),
    body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
];
router.put('/:id', rules2, entradasController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para actualizar la entrada con id=${req.params.id}, UPDATE INTO entradas WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', entradasController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Funcion para eliminar la entrada con el id=${req.params.id}, DELETE FROM entradas WHERE id=${req.params.id}`})
// }
);

module.exports=router;
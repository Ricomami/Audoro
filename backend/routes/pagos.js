const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pagosController = require('../app/controllers/pagosController')

router.get('/', pagosController.index
//     (req, res) => {
//     res.json({ok:true,msg:`Muestra todos los pagos, SELECT * FROM pagos`})
// }
);

router.get('/:id', pagosController.show
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo el pago con id=${req.params.id}, SELECT FROM pagos WHERE id=${req.params.id}`})
// }
);


const rules = [
    body('cliente_id')
        .escape()
        .notEmpty()
        .withMessage("El id del cliente del pago es requerido!")
        .bail()
        .isInt()
        .withMessage("El id del cliente solo puede ser un numero entero"),
    body('metodo_pago')
        .escape()
        .notEmpty()
        .withMessage("El metodo de pago es requerido!"),
    body('monto')
        .escape()
        .notEmpty()
        .withMessage("El monto del pago es requerido!")
        .bail()
        .isInt()
        .withMessage("El monto del pago solo puede incluir numeros"),
]
router.post('/', rules, pagosController.store
    //     (req, res) =>[
        //     res.json({ok:true,msg:`Funcion para insertar un nuevo pago, INSERT INTO pagos...`})
        // ]
    );
    
    const rules2 = [
        body('cliente_id')
            .escape()
            .notEmpty()
            .withMessage("El id del cliente del pago es requerido!")
            .bail()
            .isInt()
            .withMessage("El id del cliente solo puede ser un numero entero"),
        body('metodo_pago')
            .escape()
            .notEmpty()
            .withMessage("El metodo de pago es requerido!"),
        body('monto')
            .escape()
            .notEmpty()
            .withMessage("El monto del pago es requerido!")
            .bail()
            .isFloat({min:0})
            .withMessage("El monto del pago solo puede incluir numeros")
            .toFloat(),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
    ]
router.put('/:id', rules2, pagosController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para actualizar el pago con id=${req.params.id}, UPDATE pagos WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', pagosController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Fucion para eliminar el pago con el id=${req.params.id}, DELETE FROM pagos WHERE id=${req.params.id}`})
// }
);

module.exports=router;
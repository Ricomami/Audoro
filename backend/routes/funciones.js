const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const funcionesController = require('../app/controllers/funcionesController')

router.get('/', funcionesController.index
//     (req, res) => {
//     res.json({ok:true,msg:`Muestra todas las funciones, SELECT * FROM funciones`})
// }
);

router.get('/:id', funcionesController.show
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo la funcion con id=${req.params.id}, SELECT FROM funciones WHERE id=${req.params.id}`})
// }
);


const rules = [
    body('evento_id')
        .escape()
        .notEmpty()
        .withMessage("El id del evento es requerida!")
        .bail()
        .isInt()
        .withMessage("El id del evento solo puede ser un numero entero"),
    body('fecha_hora_funcion')
        .escape()
        .notEmpty()
        .withMessage("La fecha y hora de la funcion es requerida!"),
]
router.post('/', rules, funcionesController.store
    //     (req, res) =>[
        //     res.json({ok:true,msg:`Funcion para insertar una nueva funcion, INSERT INTO funciones...`})
        // ]
    );
    
    const rules2 = [
        body('evento_id')
            .escape()
            .notEmpty()
            .withMessage("El id del evento es requerida!")
            .bail()
            .isInt()
            .withMessage("El id del evento solo puede ser un numero entero"),
        body('fecha_hora_funcion')
            .escape()
            .notEmpty()
            .withMessage("La fecha y hora de la funcion es requerida!"),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
    ]
router.put('/:id', rules2, funcionesController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para editar la funcion con id=${req.params.id}, UPDATE funciones WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', funcionesController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Fucion para eliminar la funcion con el id=${req.params.id}, DELETE FROM funciones WHERE id=${req.params.id}`})
// }
);

module.exports=router;
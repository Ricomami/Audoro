const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const eventosController = require('../app/controllers/eventosController');

//Podemos ver
router.get('/', eventosController.index
//     (req, res) => {
//     res.json({ok:true,msg:`Muestra todos los eventos, SELECT * FROM eventos`})
//     res.send('CRUD muestra todos los registros SELECT * FROM eventos')
// }
);

router.get('/:id', eventosController.show
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo el evento con id=${req.params.id}, SELECT INTO eventos WHERE id=${req.params.id} `})
// }
);

const rules = [
    body('nombre_evento')
        .escape()
        .notEmpty()
        .withMessage("El nombre del evento es requerido!"),
    body('fecha')
        .escape()
        .notEmpty()
        .withMessage("la fecha es requerida!"),
    body('hora_fin')
        .escape()
        .notEmpty()
        .withMessage("La fecha de finalizacion del evento es requerida!"),
    body('auditorio_id')
        .escape()
        .notEmpty()
        .withMessage("El id del auditorio del evento es requerida!")
        .bail()
        .isInt()
        .withMessage("El id del evento solo puede ser un numero entero"),
]

router.post('/', rules, eventosController.store
//     (req, res) =>[
//     res.json({ok:true,msg:`Funcion para insertar un nuevo evento, INSERT INTO EVENTOS...`})
// ]
);

const rules2 = [
    body('nombre_evento')
        .escape()
        .notEmpty()
        .withMessage("El nombre del evento es requerido!"),
    body('fecha')
        .escape()
        .notEmpty()
        .withMessage("la fecha es requerida!"),
    body('hora_fin')
        .escape()
        .notEmpty()
        .withMessage("La fecha de finalizacion del evento es requerida!"),
    body('auditorio_id')
        .escape()
        .notEmpty()
        .withMessage("El id del auditorio del evento es requerida!")
        .bail()
        .isInt()
        .withMessage("El id del evento solo puede ser un numero entero"),
    body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
]
router.put('/:id', rules2, eventosController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para actualizar el evento con id=${req.params.id}, UPDATE INTO eventos WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', eventosController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Funcion para eliminar el evento con id=${req.params.id}, DELETE FROM eventos WHERE id=${req.params.id}`})
// }
)

module.exports=router;
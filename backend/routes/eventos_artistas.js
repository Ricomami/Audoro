const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const eventos_artistasController = require('../app/controllers/eventos_artistasController');

router.get('/', eventos_artistasController.index
//     (req, res) => {
//     res.json({ok:true,msg:`Muestra todos los eventos de artistas, SELECT * FROM evento_artistas`})
// }
);

router.get('/:id', eventos_artistasController.show
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo los eventos de artistas con id=${req.params.id}, SELECT INTO evento+artistas WHERE id=${req.params.id}`})
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
    body('artista_id')
        .escape()
        .notEmpty()
        .withMessage("El id del artista es requerida!")
        .bail()
        .isInt()
        .withMessage("El id del artista solo puede ser un numero entero"),
]
router.post('/', rules, eventos_artistasController.store
    //     (req, res) =>[
//     res.json({ok:true,msg:`Funcion para insertar nuevos eventos de artistas, INSERT INTO evento_artistas...`})
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
    body('artista_id')
        .escape()
        .notEmpty()
        .withMessage("El id del artista es requerida!")
        .bail()
        .isInt()
        .withMessage("El id del artista solo puede ser un numero entero"),
    body('estado')
        .escape()
        .notEmpty()
        .withMessage("El estado es requerido")
        .bail()
        .isAlpha()
        .withMessage("El estado solo incluye letras")
]
router.put('/:id', rules2, eventos_artistasController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para actualizar el evento de artistas con id=${req.params.id}, UPDATE INTO evento_artistas WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', eventos_artistasController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Funcion para eliminar el evento de artistas con id=${req.params.id}, DELETE FROM evento_artistas WHERE id=${req.params.id}`})
// }
);

module.exports=router;
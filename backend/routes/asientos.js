const express = require('express');
const routes = express.Router();
const { body } = require('express-validator');
const asientosController = require('../app/controllers/asientosController')

routes.get('/', asientosController.index
//     (req,res) => {
//     res.json({ok:true,msg:`Muestra todos los asientos, SELECT * FROM asientos`})
// }
);

routes.get('/:id', asientosController.show
//     (req,res) => {
//     res.json({ok:true,msg:`Muestra solo el asiento con el id=${req.params.id}, SELECT FROM asientos WHERE id=${req.params.id}`})
// }
);


const rules = [
    body('seccion_id')
        .escape()
        .notEmpty()
        .withMessage("El id de la seccion para asignar el asiento es requerido!")
        .bail()
        .isInt()
        .withMessage("El id de la seccion solo puede ser un numero entero!"),
    body('fila')
        .escape()
        .notEmpty()
        .withMessage("La fila a asignar del asiento no puede estar vacia!")
        .bail()
        .isAlpha()
        .withMessage("La fila del asiento solo puede ser una letra!"),
    body('numero_asiento')
        .escape()
        .notEmpty()
        .withMessage("El numero de asiento no puede ir vacio")
        .bail()
        .isInt()
        .withMessage("El numero de asiento solo puede ser un numero entero")
]
routes.post('/', rules, asientosController.store
    //     (req,res) => {
        //     res.json({ok:true,msg:`Funcion para insertar un nuevo asiento, INSERT INTO asientos...`})
        // }
    );
    
    const rules2 = [
        body('seccion_id')
            .escape()
            .notEmpty()
            .withMessage("El id de la seccion para asignar el asiento es requerido!")
            .bail()
            .isInt()
            .withMessage("El id de la seccion solo puede ser un numero entero!"),
        body('fila')
            .escape()
            .notEmpty()
            .withMessage("La fila a asignar del asiento no puede estar vacia!")
            .bail()
            .isAlpha()
            .withMessage("La fila del asiento solo puede ser una letra!"),
        body('numero_asiento')
            .escape()
            .notEmpty()
            .withMessage("El numero de asiento no puede ir vacio")
            .bail()
            .isInt()
            .withMessage("El numero de asiento solo puede ser un numero entero"),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
    ]
    routes.put('/:id', rules2, asientosController.update
//     (req,res) => {
//     res.json({ok:true,msg:`Funcion para actualizar el asiento con el id=${req.params.id}, UPDATE INTO asientos WHERE id=${req.params.id} `})
// }
);

routes.delete('/:id', asientosController.destroy
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para eliminar el asiento con el id=${req.params.id}, DELETE FROM asientos WHERE id=${req.params.id}`})
// }
);

module.exports=routes;
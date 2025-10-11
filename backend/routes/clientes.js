const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const clientesControler = require('../app/controllers/clientesController')

router.get('/', clientesControler.index
//     (req, res) => {
//     res.json({ol:true,msg:`Muestra todos los clientes, SELECT * FROM clientes`})
// }
);

router.get('/:id', clientesControler.show
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo el cliente con id=${req.params.id}, SELECT FROM clientes WHERE id=${req.params.id}`})
// }
);

const rules = [
    body('nombre_cliente')
        .escape()
        .notEmpty()
        .withMessage("El nombre del cliente es requerido!")
        .bail()
        .isAlpha()
        .withMessage("El nombre del cliente solo puede incluir letras"),
    body('apellido_pat')
        .escape()
        .notEmpty()
        .withMessage("El apellido paterno del clienete es requerido!")
        .bail()
        .isAlpha()
        .withMessage("Los apellidos del cliente solo pueden incluir letras"),
    body('apellido_mat')
        .bail()
        .isAlpha()
        .withMessage("Los apellidos del cliente solo pueden incluir letras")    
]
router.post('/', rules, clientesControler.store
    //     (req, res) =>[
        //     res.json({ok:true,msg:`Funcion para insertar un nuevo cliente, INSERT INTO clientes...`})
        // ]
    );
    
    const rules2 = [
        body('nombre_cliente')
            .escape()
            .notEmpty()
            .withMessage("El nombre del cliente es requerido!"),
        body('apellido_pat')
            .escape()
            .notEmpty()
            .withMessage("El apellido paterno del clienete es requerido!"),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
    ]
router.put('/:id', rules2, clientesControler.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para editar el cliente con id=${req.params.id}, UPDATE clientes WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', clientesControler.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Fucion para eliminar el cliente con el id=${req.params.id}, DELETE FROM clientes WHERE id=${req.params.id}`})
// }
);

module.exports=router;
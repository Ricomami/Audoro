const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Seccion = require('../app/models/Seccion');
const seccionesController = require('../app/controllers/seccionesController');

//Configurar donde se guardaran las imagenes
const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/secciones/");
    },
    filename: (req, file, cb) => {
        //Usamos un identificador temporal o con ID o un Date.now()
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });



router.get('/', seccionesController.index
//     (req, res) => {
//     res.json({ok:true,msg:`Muestra todas las secciones, SELECT * FROM secciones`})
// }
);

router.get('/:id', seccionesController.show
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo la seccion con id=${req.params.id}, SELECT FROM secciones WHERE id=${req.params.id}`})
// }
);


const rules = [
    body('nombre_seccion')
        .escape()
        .notEmpty()
        .withMessage("El nombre de la seccion es requerido!"),
    body('auditorio_id')
        .escape()
        .notEmpty()
        .withMessage("El id del auditorio del evento es requerida!")
        .bail()
        .isInt()
        .withMessage("El id del auditorio de esta seccion solo puede ser un numero entero")
]
router.post('/', upload.single('imagen_seccion'), rules, seccionesController.store
    //     (req, res) =>[
        //     res.json({ok:true,msg:`Funcion para insertar una nueva seccion, INSERT INTO secciones...`})
        // ]
    );
    
    const rules2 = [
        body('nombre_seccion')
            .escape()
            .notEmpty()
            .withMessage("El nombre de la seccion es requerido!"),
        body('auditorio_id')
            .escape()
            .notEmpty()
            .withMessage("El id del auditorio del evento es requerida!")
            .bail()
            .isInt()
            .withMessage("El id del auditorio de esta seccion solo puede ser un numero entero"),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
    ]
router.put('/:id', upload.single('imagen_seccion'), rules2, seccionesController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para actualizar la seccion con id=${req.params.id}, UPDATE secciones WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', seccionesController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Funcion para eliminar la seccion con el id=${req.params.id}, DELETE FROM secciones WHERE id=${req.params.id}`})
//  }
);

module.exports=router;
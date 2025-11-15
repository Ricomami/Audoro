const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { body } = require ('express-validator');
const sqlite = require("../db/sqlite");
//Importamos nuestro controllador
const auditoriosController = require('../app/controllers/auditoriosController'); 

//Configuramos en donde se guardaran las imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/auditorios/");
    },
    filename: (req, file, cb) => {
        //Usamos un identificador temporal o con ID o un Date.now()
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });



router.get('/', auditoriosController.index
//     (req,res) => {
//     res.json({ok:true, msg:"Muestra todos los auditorios SELECT * FROM auditorios"})
//     // res.send("CRUD muestra todos los registros, SELECT * FROM auditorios")
// }
);


router.get('/:id', auditoriosController.show
//     (req,res)=>{
//     res.json({ok:true,msg:`Muestra solo el auditorio con id=${req.params.id} SELECT FROM auditorios WHERE id=${req.params.id}`})
//     // res.send("CRUD muestra un solo registro, SELECT * FROM auditorios WHERE id")
// }
);

                //EJEMPLOS DE VALIDACIONES
const rules = [
    body('nombre')
        .escape()
        .notEmpty()
        .withMessage("El nombre no puede estar vacio!"),
    body('capacidad')
        .escape()
        .notEmpty()
        .withMessage("La capacidad es requerida!")
        .bail()
        .isInt()
        .withMessage("La capacidad solo pueden ser numeros enteros"),
]
router.post('/', upload.single("imagen_auditorio"), rules, auditoriosController.store
    //     (req,res)=>{
//     res.json({ok:true,msg:`Funcion para crear un nuevo auditorio INSERT INTO auditorios...`})
//     // res.send("CRUD funcion para insertar, INSERT INTO audiorios...")
// }
);


const rules2 = [
    body('nombre')
        .escape()
        .notEmpty()
        .withMessage("El nombre no puede estar vacio!"),
    body('capacidad')
        .escape()
        .notEmpty()
        .withMessage("La capacidad es requerida!")
        .bail()
        .isInt()
        .withMessage("La capacidad solo pueden ser numeros enteros"),
    body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
]
router.put('/:id', upload.single("imagen_auditorio"),  rules2, auditoriosController.update
//     (req,res)=>{
//     res.json({ok:true,msg:`Funcion para actualizar el auditorio con id=${req.params.id} UPDATE auditorios WHERE id=${req.params.id}`})
//     // res.send("CRUD funcion para actualizar UPDATE auditorios WHERE id...")
// }
);


router.delete('/:id', auditoriosController.destroy
//     (req,res)=>{
//     res.json({ok:true,msg:`Funcion para eliminar el auditorio con id=${req.params.id} DELETE FROM auditorios WHERE id=${req.params.id}`})
//     // res.send("CRUD funcion para eliminar, DELETE FROM auditorios WHERE id)...")
// }
);

module.exports=router;
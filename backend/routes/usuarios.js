const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Usuario = require('../app/models/Usuario');
const usuariosController = require('../app/controllers/usuariosController')

//Configuramos donde se guardaran las imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/usuarios/");
    },
    filename: (req, file, cb) => {
        //Usamos un identificador temporal o con ID o un Date.now()
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
const upload = multer({ storage });



router.get('/', usuariosController.index
//     (req,res) =>{
    //     res.json({ok:true,msg:`Muestra todos los usuarios, SELECT * FROM usuarios`})
    // }
);

router.get('/:id', usuariosController.show
//     (req,res) =>{
    //     res.json({ok:true,msg:`Muestra solo el usuario con id=${req.params.id}, SELECT FROM usuarios WHERE id=${req.params.id}`})
    // }
);


const rules = [
    body('nombre_usuario')
        .escape()
        .notEmpty()
        .withMessage("El nombre del usuario es requerido!"),
    // body('password')
    //     .escape()
    //     .notEmpty()
    //     .withMessage("El campo 'password' del usuario es requerido")
    //     .bail()
    //     .isStrongPassword({
    //         minLenght: 6,
    //         minLowercase: 1,
    //         minUppercase: 1,
    //         minNumbers: 1,
    //         minSymbols: 1
    //     })
    //     .withMessage("La contraseña debe de tener por lo menos 6 caracteres, y al menos una minúscula, una mayúscula, un número y un símbolo"),
    body('rol')
        .escape()
        .notEmpty()
        .withMessage("El rol del usuario es requerido!"),
]
router.post('/', upload.single("imagen_usuario"), rules, usuariosController.store
    //     (req,res)=>{
        //     res.json({ok:true,msg:`Funcion para insertar un nuevo usuario, INSERT INTO usuarios...`})
        // }
    );
    
    const rules2 = [
        body('nombre_usuario')
            .escape()
            .notEmpty()
            .withMessage("El nombre del usuario es requerido!"),
            // body('password')
            // .escape()
            // .notEmpty()
            // .withMessage("El campo 'password' del usuario es requerido")
            // .bail()
            // .isStrongPassword({
            //     minLenght: 6,
            //     minLowercase: 1,
            //     minUppercase: 1,
            //     minNumbers: 1,
            //     minSymbols: 1
            // })
            // .withMessage("La contraseña debe de tener por lo menos 6 caracteres, y al menos una minúscula, una mayúscula, un número y un símbolo"),
        body('rol')
            .escape()
            .notEmpty()
            .withMessage("El rol del usuario es requerido!"),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo incluye letras")
    ]
router.put('/:id', upload.single("imagen_usuario"), rules2, usuariosController.update
//     (req,res)=>{
//     res.json({ok:true,msg:`Funcion para actualizar el usuario con id=${req.params.id}, UPDATE usuarios WHERE id=${req.params.id}`})
// }
)

router.delete('/:id', usuariosController.destroy
//     (req,res)=>{
//     res.json({ok:true,msg:`Fucion para eliminar el usuario con el id=${req.params.id}, DELETE FROM usuarios WHERE id=${req.params.id}`})
// }
);

module.exports=router;
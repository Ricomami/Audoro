const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
// const upload = require('../app/middlewares/uploadMiddleware')
// const Artista = require('../app/models/Artista');

//Configurar donde se guardaran las imagenes
const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/artistas/");
    },
    filename: (req, file, cb) => {
        //Usamos un identificador temporal o con ID o un Date.now()
        const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); 
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});

const upload = multer({ storage });


const artistasController = require('../app/controllers/artistasController');

//INDEX - Todos los registros
router.get('/', artistasController.index 
    // (req, res) => {
    // res.json({ok:true,msg:`Muestra todos los artistas SELECT * FROM artistas `})
// }
);

router.get('/:id', artistasController.show 
//     (req,res) =>{
//     res.json({ok:true,msg:`Muestra solo el artista con id=${req.params.id}, SELECT FROM artistas WHERE id=${req.params.id}`})
// }
);

const rules = [
    body('nombre_artista')
        .escape()
        .notEmpty()
        .withMessage("El nombre del artista es requerido!"),
    body('genero')
        .escape()
        .notEmpty()
        .withMessage("El género del artista es requerido!")
]
router.post('/', upload.single("imagen"),rules, artistasController.store
    //      (req, res) =>[
        //     res.json({ok:true,msg:`Funcion para insertar un nuevo artista, INSERT INTO artistas...`})
        // ]
    );
    
    const rules2 = [
        body('nombre_artista')
            .escape()
            .notEmpty()
            .withMessage("El nombre del artista es requerido!"),
        body('genero')
            .escape()
            .notEmpty()
            .withMessage("El género del artista es requerido!"),
        body('estado')
            .escape()
            .notEmpty()
            .withMessage("El estado es requerido")
            .bail()
            .isAlpha()
            .withMessage("El estado solo debe incluir letras")

    ]
router.put('/:id', upload.single("imagen"), rules2, artistasController.update
//     (req, res) => {
//     res.json({ok:true,msg:`Funcion para editar el artista con id=${req.params.id}, UPDATE artistas WHERE id=${req.params.id}`})
// }
);

router.delete('/:id', artistasController.destroy
//     (req, res) =>{
//     res.json({ok:true,msg:`Funcion para eliminar el artista con id=${req.params.id}, DELETE FROM artiistas WHETE id=${req.params.id}`})
// }
);

module.exports=router;
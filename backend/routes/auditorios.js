const express = require("express");
const router = express.Router();
const { body } = require ('express-validator');

const sqlite = require("../db/sqlite");
//Importamos nuestro controllador
const auditoriosController = require('../app/controllers/auditoriosController'); 


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
router.post('/', rules, auditoriosController.store
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
router.put('/:id', rules2, auditoriosController.update
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



//LEER MYSQL
router.get("/leer", (req, res) => {
    const sql = "SELECT * FROM auditorios";

    db.all("SELECT * FROM auditorios",[], (err,rows) => {
        if(err) return res.status(500).json({error: "Error en MySQL", detalle: err.message});
        res.json(rows);
    });
});

// //LEER SQLite
// router.get("/leer", (req, res) => {
//     sqlite.query("SELECT * FROM auditorios",(err,rows) => {
//         if(err) return res.status(500).json({error: "Error en MySQL"});
//         res.json(rows);
//     });
// });


//CREATE
router.post("/crear", (req, res) => {
    const {nombre, capacidad, ubicacion} = req.body;

    //Insertar en MySQL
    mysql.query(
        "INSERT INTO auditorios (nombre, capacidad, ubicacion) VALUES (?,?,?)",
        [nombre, capacidad, ubicacion],
        (err, result) => {
            if (err) return res.status(500).json({error:"Error MySQL"});

            //Insertar en SQLite
            sqlite.run(
                "INSERT INTO auditorios(nombre, capacidad, ubicacion) VALUES (?,?,?)",
                [nombre, capacidad, ubicacion],
                (errSqlite) => {
                    if(errSqlite) console.error("Error SQLite: ", errSqlite);
                    // Respuesta final UNA sola vez
                    res.json({ok:true, id:result.insertId, msg:"Auditorio  en ambas BD"});
                }
            );
        }
    );
});


//UPDATE
router.put("/actualizar/:id",(req, res) => {
    const {id} = req.params;
    const datos = req.body;

    //Actualizar en MySQL
    mysql.query(
        "UPDATE auditorios SET nombre=?, capacidad=?, direccion=? WHERE id_auditorio=?",
        [datos.nombre, datos.capacidad, datos.direccion, id],
        (err, result) => {
            if(err) return res.status(500).json({ error: "Error MySQL"});
        }
    );

    //Actualizar en SQLite
    sqlite.run(
        "UPDATE auditorios SET nombre=?, capacidad=?, ubicacion=? WHERE id_auditorio=?",
        [nombre, capacidad, ubicacion, id],
        (errSqlite) => {
            if(errSqlite) console.error("Error SQLite: ", errSqlite);
            res.json({ok:true, msg:"Auditorio actualizado en ambas Bases de Datos"});
        }
    );

});


// DELETE
router.delete("/eliminar/:id", (req, res) => {
  const { id } = req.params;

  // MySQL
  mysql.query(
    "DELETE FROM auditorios WHERE id_auditorio=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error MySQL" });
    }
  );

  // SQLite
  sqlite.run(
    "DELETE FROM auditorios WHERE id_auditorio=?",
    [id],
    (err) => {
      if (err) console.error("Error SQLite:", err);
    }
  );

  res.json({ ok: true, msg: "Auditorio eliminado en ambas BD" });
});

module.exports=router;
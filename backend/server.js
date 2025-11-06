const express = require("express");
const cors = require("cors");
const  dotenv = require("dotenv"); //Importamos dotenv para usar las variables de entorno del .env
const path = require('path');
const multer = require('multer'); // Importamos la libreria de Multer
const fs = require('node:fs'); //Para trabajar con los nombres de los archivos Multer

const upload = multer({dest: 'uploads'}) // Middleware que se coloca dentro de nuestras url's detras de la resolucion final para trabajar con las imagenes.  

dotenv.config({path: path.resolve(__dirname,"../.env")}); //Carga las variables del .env

const { conectarBD, conectarCompass } = require("./db/mongoose")

const app=express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Servidor backend funcionando 🚀");
});
app.listen(3000,() =>{
    console.log("Servidor corriendo en http://localhost:3000");
});

//Conectar con MongoDB (UNA SOLA CONEXION A LA VEZ)
    conectarBD() //Atlas (nube)
    // conectarCompass() //Compass (local)


//ARTISTAS
const artistasRoutes = require("./routes/artistas")
app.use("/artistas",artistasRoutes);


//AUDITORIOS
const auditoriosRoutes = require("./routes/auditorios");
app.use("/auditorios",auditoriosRoutes);


// ASIENTOS
const asientosRoutes = require("./routes/asientos")
app.use("/asientos",asientosRoutes);


// CLIENTES
const clientesRoutes = require("./routes/clientes")
app.use("/clientes",clientesRoutes);


// ENTRADAS
const entradasRoutes = require("./routes/entradas")
app.use("/entradas",entradasRoutes);

//EVENTOS
const eventosRoutes= require("./routes/eventos")
app.use("/eventos", eventosRoutes);

// EVENTOS_ARTISTAS
const eventos_artistasRoutes = require("./routes/eventos_artistas")
app.use("/evento_artistas",eventos_artistasRoutes);


// FUNCIONES
const funcionesRoutes = require("./routes/funciones")
app.use("/funciones",funcionesRoutes);


// PAGOS
const pagosRoutes = require("./routes/pagos")
app.use("/pagos",pagosRoutes);


// SECCIONES
const seccionesRoutes = require("./routes/secciones")
app.use("/secciones",seccionesRoutes);


// USUARIOS
const usuariosRoutes = require("./routes/usuarios")
app.use("/usuarios",usuariosRoutes);

//MULTER Servir archivos estaticos (imagenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//RECEPCION DE UNA SOLA IMAGEN
app.post('/imagenes/single',upload.single('imagen'), (req, res)=>{
    console.log(req.file);
    guardarImagen(req.file);
    res.send('Terminada');
});

function guardarImagen(file) {
    const newPath = `./uploads/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}

// function guardarImagenAuditorios(file) { 
//     const newPath = `./uploads/auditorios/${file}`
// }

//RECEPCION DE VARIAS IMAGENES (Este específicamente con 10)
app.post('/imagenes/multi', upload.array('imagenes', 10), (req, res) => {
    req.files.map(guardarImagen);
    res.send('Terminado Multi');
})

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/upload', uploadRoutes);

//EXPONEMOS DE MANERA PUBLICA LA CARPETA UPLOADS
app.use("/uploads", express.static("uploads"));

const express = require("express");
const cors = require("cors");
const  dotenv = require("dotenv"); //Importamos dotenv para usar las variables de entorno del .env
const path = require('path');

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

//Servir archivos estaticos (imagenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

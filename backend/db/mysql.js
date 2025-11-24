// // CONEXION ANTERIOR A PROMESAS
// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"auditorio"
// });

// connection.connect(err=>{
//     if(err){
//         console.error("ErrOr MySQL: ",err);
//         return;
//     }
//     console.log("Conectado a MySQL");
// });

// module.exports=connection;


// CONEXION A PROMESAS CON NAVARRO
const mysql = require('mysql2/promise');
const env = require('dotenv').config();

//Conexión sin Pool
const configuracion = {
    host: "localhost",
    port: "3306",
    database: "auditorio",
    user: "root",
    password: ""
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // database: process.env.DB_NAME,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD
};

async function conectarBD(){
    try {
        const conexion = await mysql.createConnection(configuracion);
        console.log("Conexion establecida con la base de datos.")
        return conexion;
    } catch (error) {
        console.log("No se puede conectar: ", error)
        throw error;
    }
};

async function desconectarDB(conexion){
    if (conexion) {
        await conexion.end();
        console.log("Conexion cerrada");
    }
};


//CONEXION CON SEQUELIZE
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('auditorio', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports ={ sequelize, conectarBD, desconectarDB };
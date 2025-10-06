const sqlite3= require("sqlite3").verbose();

const db = new sqlite3.Database("./local.db",(err) => {
    if(err) console.error("Error SQLite: ",err.message);
    else console.log("Conectado a SQLite!");
});

db.run(`CREATE TABLE IF NOT EXISTS auditorios(
    id_auditorio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    capacidad INTEGER,
    ubicacion TEXT
)`);

module.exports=db;
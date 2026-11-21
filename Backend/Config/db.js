//Mantiene la conexion con la base de datos

// mysql2/promise: librería para conectarse a MySQL usando async/await
const mysql = require('mysql2/promise');
// Carga las variables del archivo .env
require('dotenv').config();

// Crea un pool: un grupo de conexiones a MySQL que se reutilizan.
// Es mejor que abrir y cerrar una conexión en cada consulta.
// Los datos de conexión vienen del .env para no escribirlos dentro del código.
const db = mysql.createPool({
    host: process.env.DB_HOST,          // dónde está MySQL (localhost)
    user: process.env.DB_USER,          // usuario de MySQL
    password: process.env.DB_PASSWORD,  // contraseña
    database: process.env.DB_NAME,      // nombre de la base de datos
    port: Number(process.env.DB_PORT)   // puerto (3306); Number() lo convierte de texto a número
});

// Exporta el pool para que otros archivos lo usen con require('../Config/db')
module.exports = db;
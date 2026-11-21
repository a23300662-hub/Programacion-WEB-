// Express: framework que crea el servidor web
/*
que pasa al presionar el boton de subir
Servidor->Routes->Controller->Models->Mysql
Servidor<-Controller<-Model<-Mysql(regresa la respuesta)
*/
const express = require('express');
// path: módulo de Node para armar rutas de carpetas sin errores
const path = require('path');

// Lee el archivo .env y deja sus valores en process.env (PORT, DB_HOST, etc.)
require('dotenv').config();

// Importa las rutas de las actividades (definidas en tareaRoutes.js)
const tareasRoutes = require('./Rutas/tareaRoutes');

// Crea la aplicación de Express (express crea servidores)
const app = express();

// Permite leer los datos que llegan de un <form> HTML (formato urlencoded)
// y los deja disponibles en req.body
app.use(express.urlencoded({extended:true}));

// Permite leer datos en formato JSON
// y también los deja en req.body
app.use(express.json());

// Sirve los archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta Frontend.
// __dirname es la carpeta de app.js (Backend); '..' sube un nivel hacia la carpeta del proyecto.
// Gracias a esto, http://localhost:3000/index.html muestra tu página.
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Registra las rutas de la API (POST /actividades, GET /api/actividades, etc.)
app.use(tareasRoutes);

// Puerto del servidor: el del .env o, si no existe, el 3000
const PORT = process.env.PORT || 3000;

// Enciende el servidor y avisa en la terminal cuando está listo
app.listen(PORT, () => console.log(`Hola esde el puerto:${PORT}`));
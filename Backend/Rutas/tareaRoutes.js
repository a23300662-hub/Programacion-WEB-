//Decide que función atiende cada direccion
const express = require('express');
// Router: un mini-conjunto de rutas que luego se conecta a la app principal
const router = express.Router();
// Importa el controlador, que contiene la lógica de cada ruta
const tareasController = require('../Controladores/tareasControllers');

// Cada línea une un método HTTP y una dirección con una función del controlador:

// Registrar: el formulario de index.html envía aquí (INSERT)
router.post('/actividades', tareasController.registrarTareas);
// Consultar: la tabla pide aquí la lista de actividades (SELECT)
router.get('/api/actividades', tareasController.listarTareas);
// Modificar el estado: :id es un parámetro que cambia según la actividad (UPDATE)
router.patch('/api/actividades/:id', tareasController.actualizarEstado);
// Eliminar una actividad por su id (DELETE)
router.delete('/api/actividades/:id', tareasController.eliminarTarea);

// Exporta el router para que app.js lo registre con app.use(tareasRoutes)
module.exports = router;
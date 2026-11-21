//Valida los datos y decide que responder
// Importa el modelo, que es quien habla con la base de datos
const tareaModel = require('../Modelo/tareaModel');

// Valores permitidos. Sirven para validar lo que llega del navegador.
const PRIORIDADES = ['Alta', 'Media', 'Baja'];
const ESTADOS = ['Pendiente', 'En proceso', 'Completada'];

// POST /actividades: recibe el formulario y guarda la actividad
// req = lo que manda el navegador, res = la respuesta que se le devuelve
async function registrarTareas(req, res) {
    try {
        // Saca del formulario los campos (coinciden con el name de cada input)
        const { nombre, materia, prioridad } = req.body;

        // Validación en el servidor que nombre y materia deben ser texto no vacío, y la prioridad, una de las permitidas
        if (typeof nombre !== 'string' || !nombre.trim() ||
            typeof materia !== 'string' || !materia.trim() ||
            !PRIORIDADES.includes(prioridad)) {
            // 400 = petición incorrecta
            return res.status(400).send('Datos de la actividad inválidos');
        }

        // Guarda en la BD; trim() quita espacios sobrantes al inicio y al final
        await tareaModel.registrarTareas(nombre.trim(), materia.trim(), prioridad);
        // Si todo salió bien, manda al usuario a la página con la tabla
        res.redirect('/actividades.html');
    } catch (error) {
        // Muestra el error real en la terminal (para depurar)...
        console.error('Error al registrar la actividad:', error);
        // ...y al navegador solo le responde un mensaje general (500 = error del servidor)
        res.status(500).send('Error al guardar la actividad');
    }
}

// GET /api/actividades: devuelve todas las actividades en formato JSON
async function listarTareas(req, res) {
    try {
        res.json(await tareaModel.obtenerTareas());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar las actividades' });
    }
}

// PATCH /api/actividades/:id: cambia el estado de una actividad
async function actualizarEstado(req, res) {
    try {
        // El id viene en la URL (/api/actividades/5); llega como texto, se pasa a número
        const id = Number(req.params.id);
        // El nuevo estado viene en el cuerpo JSON
        const { estado } = req.body;

        // El id debe ser un entero y el estado uno de los tres permitidos
        if (!Number.isInteger(id) || !ESTADOS.includes(estado)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }
        const filas = await tareaModel.cambiarEstado(id, estado);
        // 0 filas modificadas = no existe una actividad con ese id (404 = no encontrado)
        if (filas === 0) return res.status(404).json({ error: 'Actividad no encontrada' });

        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
}

// DELETE /api/actividades/:id: elimina una actividad
async function eliminarTarea(req, res) {
    try {
        const id = Number(req.params.id);
        // Si el id no es un número entero, se rechaza
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id inválido' });

        const filas = await tareaModel.eliminarTarea(id);
        // 0 filas borradas = el id no existe
        if (filas === 0) return res.status(404).json({ error: 'Actividad no encontrada' });

        res.json({ mensaje: 'Actividad eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la actividad' });
    }
}

// Exporta las funciones para conectarlas con las rutas
module.exports = { registrarTareas, listarTareas, actualizarEstado, eliminarTarea };
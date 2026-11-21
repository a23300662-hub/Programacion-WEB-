//Escribe y ejecuta las las consultas SQL
// Importa el pool de conexiones a la base de datos
const db = require('../Config/db');

// INSERT: guarda una actividad nueva.
// No se envía el estado: la base de datos le pone 'Pendiente' por el DEFAULT.
async function registrarTareas(nombre,materia,prioridad) {
    // Los ? son marcadores: MySQL los rellena con los valores del arreglo.
    // Esto evita la inyección SQL (nunca se pegan los datos directo en el texto).
    const sql = 'INSERT INTO actividades (nombre, materia, prioridad) VALUES(?,?,?)';

    // execute devuelve [resultado, info]; solo se necesita el primero
    const [resultado] = await db.execute(sql, [nombre, materia,prioridad]);
    // insertId es el id que MySQL le asignó a la fila recién creada
    return resultado.insertId;  
}

// SELECT: devuelve todas las actividades, las más recientes primero
async function obtenerTareas() {
    // ORDER BY id DESC ordena de mayor a menor id
    const [filas] = await db.execute('SELECT * FROM actividades ORDER BY id DESC');
    // filas es un arreglo con una actividad (objeto) por cada registro
    return filas;
}

// UPDATE: cambia el estado de la actividad con ese id
async function cambiarEstado(id, estado) {
    const [resultado] = await db.execute(
        'UPDATE actividades SET estado = ? WHERE id = ?', [estado, id]
    );
    // affectedRows es cuántas filas se modificaron: 0 significa que el id no existe
    return resultado.affectedRows;
}

// DELETE: borra la actividad con ese id
async function eliminarTarea(id) {
    const [resultado] = await db.execute('DELETE FROM actividades WHERE id = ?', [id]);
    // affectedRows es cuántas filas se borraron: 0 significa que el id no existe
    return resultado.affectedRows;
}

// Exporta las funciones para usarlas desde el controlador
module.exports = {
    registrarTareas,
    obtenerTareas,
    cambiarEstado,
    eliminarTarea
};
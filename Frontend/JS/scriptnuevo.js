// Lista de estados permitidos. Se usa para construir las opciones del menú desplegable.
const ESTADOS = ['Pendiente', 'En proceso', 'Completada'];

//aquí se insertan las filas con las actividades
const tbody = document.getElementById('tabla-actividades');

// Párrafo donde se muestran avisos (tabla vacía o errores)
const mensaje = document.getElementById('mensaje');

// Pide las actividades al servidor y redibuja la tabla completa.
// Se vuelve a llamar después de cada cambio, y así la tabla siempre
// muestra lo que hay en la base de datos (requerimiento 4).
async function cargarActividades() {
    try {
        // GET a la ruta del servidor que hace el SELECT
        const res = await fetch('/api/actividades');

        // res.ok es false si el servidor respondió con error (400, 404, 500...)
        if (!res.ok) throw new Error('Error al consultar');

        // Convierte la respuesta JSON en un arreglo de objetos de JavaScript
        const actividades = await res.json();

        // Vacía la tabla antes de dibujarla de nuevo (evita filas duplicadas)
        tbody.innerHTML = '';

        // Si no hay actividades, muestra un aviso; si hay, lo borra
        mensaje.textContent = actividades.length === 0 ? 'Todavía no hay actividades.' : '';

        // Crea una fila por cada actividad y la agrega a la tabla
        for (const act of actividades) {
            tbody.appendChild(crearFila(act));
        }
    } catch (error) {
        // Si falla la conexión o el servidor, avisa al usuario
        mensaje.textContent = 'No se pudieron cargar las actividades.';
    }
}

// Recibe una actividad y devuelve la fila <tr> lista para insertar en la tabla.
// Se usa textContent para que lo que escriba el usuario nunca se interprete como código HTML.
function crearFila(act) {
    const fila = document.createElement('tr');

    //nombre, materia y prioridad
    for (const valor of [act.nombre, act.materia, act.prioridad]) {
        const celda = document.createElement('td');
        celda.textContent = valor;
        fila.appendChild(celda);
    }

    //menú desplegable
    const celdaEstado = document.createElement('td');
    const select = document.createElement('select');
    select.className = 'form-control';

    // Crea una <option> por cada estado posible
    for (const estado of ESTADOS) {
        const opcion = document.createElement('option');
        opcion.value = estado;
        opcion.textContent = estado;
        // Marca como seleccionada la opción que coincide con el estado actual,
        // para que el menú muestre el estado real guardado en la base de datos
        opcion.selected = estado === act.estado;
        select.appendChild(opcion);
    }

    // Cuando el usuario elige otro estado, se manda el cambio al servidor.
    // select.value es el estado que eligió.
    select.addEventListener('change', () => cambiarEstado(act.id, select.value));

    celdaEstado.appendChild(select);
    fila.appendChild(celdaEstado);

    //botón Eliminar
    const celdaAcciones = document.createElement('td');
    const boton = document.createElement('button');
    boton.className = 'btn-solid theme-primary';
    boton.textContent = 'Eliminar';

    // Al hacer clic, elimina la actividad de esta fila (usa su id)
    boton.addEventListener('click', () => eliminarActividad(act.id));

    celdaAcciones.appendChild(boton);
    fila.appendChild(celdaAcciones);

    return fila;
}

// Manda al servidor el id de la actividad y su nuevo estado.
// El servidor ejecuta el UPDATE en la base de datos.
async function cambiarEstado(id, nuevoEstado) {
    const res = await fetch(`/api/actividades/${id}`, {
        method: 'PATCH',                                  // PATCH = modificar solo un campo
        headers: { 'Content-Type': 'application/json' },  // avisa que el cuerpo es JSON
        body: JSON.stringify({ estado: nuevoEstado })     // datos que se envían
    });

    // Si el servidor rechazó el cambio, avisa al usuario
    if (!res.ok) mensaje.textContent = 'No se pudo cambiar el estado.';

    // Vuelve a consultar la base de datos y redibuja la tabla (requerimiento 4).
    // Si el cambio falló, esto también deja el menú con el estado real.
    cargarActividades();
}

// Pide confirmación y, si el usuario acepta, elimina la actividad.
async function eliminarActividad(id) {
    // confirm() muestra un cuadro Aceptar/Cancelar.
    // Si el usuario cancela, la función termina y no se borra nada.
    if (!confirm('¿Eliminar esta actividad?')) return;

    // DELETE a la ruta del servidor que borra el registro con ese id
    const res = await fetch(`/api/actividades/${id}`, { method: 'DELETE' });

    if (!res.ok) mensaje.textContent = 'No se pudo eliminar la actividad.';

    // Redibuja la tabla para que la fila eliminada desaparezca
    cargarActividades();
}

// Al abrir la página, carga la tabla por primera vez
cargarActividades();
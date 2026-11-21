// función que se ejecuta sola al cargar.
// Evita que las variables se vuelvan globales y choquen con otro código.
(() => {
    //evita errores silenciosos (por ejemplo, variables sin declarar)
    'use strict'
    // Selecciona todos los formularios que tengan el atributo data-bs-validate.
    // Solo esos formularios serán validados por este script.
    const forms = document.querySelectorAll('form[data-bs-validate]')
    // Recorre cada formulario encontrado
    for (const form of forms) {
        form.addEventListener('submit', event => {
            // checkValidity() revisa las reglas HTML (required, minlength, type="email", etc.)
            // Devuelve true si todo es válido y false si hay algún error
            if (!form.checkValidity()) {
                // Cancela el envío del formulario
                event.preventDefault()
                // Evita que otros manejadores del evento se ejecuten
                event.stopPropagation()
            }
            // Recorre todos los controles del formulario (inputs, selects, textareas, botones)
            for (const control of form.elements) {
                // willValidate es true solo si el control se puede validar
                // (excluye botones y campos deshabilitados)
                if (control.willValidate) {
                    // Pone aria-invalid="true" si el campo es inválido, o "false" si es válido.
                    // Sirve para accesibilidad (lectores de pantalla) y para dar estilo con CSS.
                    control.setAttribute('aria-invalid', String(!control.validity.valid))
                }
            }
        })
        // Quita la marca de error cada que el usuario corrige cada campo
        form.addEventListener('input', event => {
             // El campo que el usuario está modificando
            const control = event.target
            // Solo actúa si el campo es validable y ya tenía aria-invalid
            // (es decir, si ya se intentó enviar el formulario antes)
            if (control.willValidate && control.hasAttribute('aria-invalid')) {
                // Vuelve a evaluar solo ese campo y actualiza su marca
                control.setAttribute('aria-invalid', String(!control.validity.valid))
            }
        })
    }
})()
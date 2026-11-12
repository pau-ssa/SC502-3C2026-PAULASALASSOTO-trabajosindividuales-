// ----------------------------------------------
// //BLOQUE 1. Variables, arreglo y entradas HTML.
// ----------------------------------------------
let estudiantes = [
    { id: 1, nombre: "Maria Mora Perez", nota: 90.2 },
    { id: 2, nombre: " Pedro Sibaja Lopez", nota: 60.3 },
    { id: 3, nombre: "Marco Rojas Castro", nota: 78 }
];
let siguienteIdEstudiante = 4;
const NOTA_APROBACION = 70;
const MAX_ESTUDIANTES = 35;

let formularioEstudiante = document.getElementById("formularioEstudiante");
let campoNombreEst = document.getElementById("nombreEstudiante");
let campoNota = document.getElementById("nota");
let campoFiltroNotas = document.getElementById("filtroNotas");
let listaNotas = document.getElementById("listaNotas");
let mensajeNotas = document.getElementById("mensajeNotas");


// ----------------------------------------------
// BLOQUE. Eventos: actuar sin enviar el formulario al servidor.
// ----------------------------------------------
document.getElementById("botonDOM")
    .addEventListener("click", quitarDOM);

formularioEstudiante.addEventListener("submit", function (evento) {
    evento.preventDefault();
    agregarEstudiante();
});

campoFiltroNotas.addEventListener("change", mostrarEstudiantes);
document.getElementById("limpiarNotas")
    .addEventListener("click", limpiarNotas);

mostrarEstudiantes();

// ----------------------------------------------
// BLOQUE . Funciones con return y validaciones
// ----------------------------------------------

function mostrarMensajeNotas(texto, tipo) {
        mensajeNotas.textContent = texto;
        if (tipo === "error") {
            mensajeNotas.className = "mensaje mensaje-error";
        } else if (tipo === "aviso") {
            mensajeNotas.className = "mensaje mensaje-aviso";
        } else {
            mensajeNotas.className = "mensaje mensaje-bien";
        }
        
    setTimeout(() => {
        mensajeNotas.textContent = "";
    }, 3000);
}


function normalizarTexto(texto) {
    return texto.trim().toLowerCase();
}
function validarEstudiante(nombre, notaTexto) {
    if (nombre === "") {
        mostrarMensajeNotas("El nombre no puede estar vacío.", "error");
        return false;
    } else if (nombre.length < 5) {
        mostrarMensajeNotas("El nombre debe tener al menos 5 caracteres.", "error");
        return false;
    } else if (nombre.length > 60) {
        mostrarMensajeNotas("El nombre no puede superar 60 caracteres.", "error");
        return false;
    }
    // Number("") da 0, por eso se revisa primero que el campo no esté vacío.
    let nota = Number(notaTexto);
    if (notaTexto === "" || !Number.isFinite(nota) || nota < 0 || nota > 100) {
        mostrarMensajeNotas("La nota debe ser un número entre 0 y 100.", "error");
        return false;
    }
    if (estudiantes.length >= MAX_ESTUDIANTES) {
        mostrarMensajeNotas("Límite alcanzado: máximo " + MAX_ESTUDIANTES + " estudiantes.", "error");
        return false;
    }

    for (let i = 0; i < estudiantes.length; i++) {
        if (normalizarTexto(estudiantes[i].nombre) === normalizarTexto(nombre)) {
            mostrarMensajeNotas("Ya existe un estudiante con ese nombre.", "error");
            return false;
        }
    }
    return true;
}
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function definirColorNota(nota) {
    if (nota >= 80) return "mensaje mensaje-bien";
    if (nota >= 65) return "mensaje mensaje-aviso";
    return "mensaje mensaje-error";
}


function quitarDOM() {
    formularioRegistro.hidden = false;
    parrafoDOM.remove();
    botonDOM.remove();
}
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------
function agregarEstudiante() {
    let nombre = campoNombreEst.value.trim();
    let notaTexto = campoNota.value.trim();
    if (validarEstudiante(nombre, notaTexto) === false) {
        campoNombreEst.focus();
        return;
    }

    let nuevoEstudiante = {
        id: siguienteIdEstudiante,
        nombre: nombre,
        nota: Number(notaTexto)
    };
    siguienteIdEstudiante = siguienteIdEstudiante + 1;
    estudiantes.push(nuevoEstudiante);

    campoNombreEst.value = "";
    campoNota.value = "";
    mostrarEstudiantes();
    mostrarMensajeNotas("Estudiante registrado correctamente.", "bien");
    campoNombreEst.focus();
}

// ----------------------------------------------
// BLOQUE. Salida al DOM: crear, mostrar y filtrar sin recarga.
// ----------------------------------------------

function mostrarEstudiantes() {
    listaNotas.textContent = "";
    let filtro = campoFiltroNotas.value;
    let visibles = 0;

    for (let i = 0; i < estudiantes.length; i++) {
        let estudiante = estudiantes[i];
        let aprobado = estudiante.nota >= NOTA_APROBACION;
        let coincide = filtro === "Todos" ||
            (filtro === "Aprobados" && aprobado === true) ||
            (filtro === "Reprobados" && aprobado === false);

        if (coincide === true) {
            visibles = visibles + 1;

            // Un div por estudiante con nombre y nota
            let fila = document.createElement("div");
            fila.className = "border rounded p-3 mb-2 fila";

            let nombre = document.createElement("strong");
            nombre.textContent = estudiante.nombre;
            fila.appendChild(nombre);

            let detalle = document.createElement("span");
            detalle.className = "detalle" + definirColorNota(estudiante.nota);
            detalle.textContent = "    Nota: " + estudiante.nota +
                (aprobado === true ? "    (Aprobado)" : "    (Reprobado)");
            fila.appendChild(detalle);

            let acciones = document.createElement("div");
            acciones.className = "acciones";
            let botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.className = "btn btn-peligro";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                eliminarEstudiante(estudiante.id);
            });
            acciones.appendChild(botonEliminar);
            fila.appendChild(acciones);
            listaNotas.appendChild(fila);
        }
    }
    mostrarResumen();
    document.getElementById("totalVisibles").textContent = visibles;

    let estadoVacio = document.getElementById("estadoVacioNotas");
        if (estudiantes.length === 0) {
            estadoVacio.textContent = "Todavía no hay notas.";
        } else if (visibles === 0) {
            estadoVacio.textContent = "No hay estudiantes para el filtro seleccionado.";
        } else {
            estadoVacio.textContent = "";
        }
      setTimeout(() => {estadoVacio.textContent=""}, 3000);
}
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function buscarIndiceEstudiante(id) {
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].id === id) {
            return i;
        }
    }
    return -1;
}

function eliminarEstudiante(id) {
    let indice = buscarIndiceEstudiante(id);
        if (indice === -1) {
                mostrarMensajeNotas("No se encontró el estudiante.", "error"); 
            return;
        } else {
            estudiantes.splice(indice, 1);
            mostrarEstudiantes();
        }    
}


function limpiarNotas() {
    if (campoFiltroNotas.value === "Todos") {
        return;
    }
    campoFiltroNotas.value = "Todos";
    mostrarEstudiantes();
}
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------

function calcularResumen() {
    if (estudiantes.length === 0) {
        return { mayor: null, menor: null, promedio: 0 };
    }

    let mayor = estudiantes[0];
    let menor = estudiantes[0];
    let suma = 0;
    for (let i = 0; i < estudiantes.length; i++) {
        let estudiante = estudiantes[i];
        suma = suma + estudiante.nota;
        if (estudiante.nota > mayor.nota) {
            mayor = estudiante;
        }
        if (estudiante.nota < menor.nota) {
            menor = estudiante;
        }
    }
    return {
        mayor: mayor,
        menor: menor,
        promedio: suma / estudiantes.length
    };
}

function mostrarResumen() {
    let resumen = calcularResumen();
    document.getElementById("promedioNotas").textContent = resumen.promedio.toFixed(2);
    if (resumen.mayor === null) {
        document.getElementById("notaMayor").textContent = "-";
        document.getElementById("notaMenor").textContent = "-";
    } else {
        document.getElementById("notaMayor").textContent =
            resumen.mayor.nombre.trim() + " (" + resumen.mayor.nota + ")";
        document.getElementById("notaMenor").textContent =
            resumen.menor.nombre.trim() + " (" + resumen.menor.nota + ")";
    }
}


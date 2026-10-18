
//BLOQUE. Variables, arreglo y entradas HTML.

// EJERCICIO 1: CÁLCULO DE CARGAS SOCIALES
const formularioSalario = document.getElementById("formularioSalario");
const campoSalario = document.getElementById("salarioBruto");
const campoHijos = document.getElementById("hijos");
const campoConyuge = document.getElementById("conyuge");

// EJERCICIO 1:  Mostrar los resultados
const resultadoSalario = document.getElementById("resultadoSalario");
const mostrarBruto = document.getElementById("mostrarBruto");
const mostrarCargas = document.getElementById("mostrarCargas");
const mostrarRenta = document.getElementById("mostrarRenta");
const mostrarCreditos = document.getElementById("mostrarCreditos");
const mostrarNeto = document.getElementById("mostrarNeto");
const tramoTxt = document.getElementById("tramoTxt");


const formatoColones = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2
});


//EJERCICIO 4
let estudiantes = [];
let siguienteIdEstudiante = 1;
const NOTA_APROBACION = 70;
const MAX_ESTUDIANTES = 35;


let formularioEstudiante = document.getElementById("formularioEstudiante");
let campoNombreEst = document.getElementById("nombreEstudiante");
let campoNota = document.getElementById("nota");
let campoFiltroNotas = document.getElementById("filtroNotas");
let listaNotas = document.getElementById("listaNotas");
let mensajeNotas = document.getElementById("mensajeNotas");


// EJERCICIO 4: 
function mostrarMensajeNotas(texto, tipo) {
    mensajeNotas.textContent = texto;
    if (tipo === "error") {
        mensajeNotas.className = "mensaje mensaje-error";
    } else if (tipo === "aviso") {
        mensajeNotas.className = "mensaje mensaje-aviso";
    } else {
        mensajeNotas.className = "mensaje mensaje-bien";
    }
}

// BLOQUE . Funciones con return y validaciones
// EJERCICIO 1: 
function validarDatos(salario, cantidadHijos, creditoConyuge) {

    if (!Number.isFinite(salario) || salario <= 0) {
        alert("Ingrese un salario bruto mayor que cero.");
        return false;
    } else if (
        !Number.isInteger(cantidadHijos) ||
        cantidadHijos < 0
    ) {
        alert("Ingrese una cantidad válida de hijos.");
        return false;
    } else if (
        !Number.isFinite(creditoConyuge) ||
        creditoConyuge < 0
    ) {
        alert("El crédito por cónyuge no es válido.");
        return false;
    } else {
        return true;
    }
}



// EJERCICIO 1: 
function calcularImpuestoRenta(salario) {

    let impuesto = 0;
    let tramoTxt = "";

    if (salario <= 918000) {
        impuesto = 0;
        tramoTxt = "Salario exento de impuesto sobre la renta.";
    } else if (salario > 918000) {
        impuesto +=
            (Math.min(salario, 1347000) - 918000) * 0.10;
        tramoTxt = "Sujeto a una deducción del 10%.";
    } else if (salario > 1347000) {
        impuesto +=
            (Math.min(salario, 2364000) - 1347000) * 0.15;
        tramoTxt = "Sujeto a una deducción del 15%.";
    } else if (salario > 2364000) {
        impuesto +=
            (Math.min(salario, 4727000) - 2364000) * 0.20;
        tramoTxt = "Sujeto a una deducción del 20%.";
    } else {
        impuesto += (salario - 4727000) * 0.25;
        tramoTxt = "Sujeto a una deducción máxima del 25%.";
    } return {
        impuesto: impuesto,
        tramoTxt: tramoTxt
    };
}
///EJERCICIO 4
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

// BLOQUE  Registrar: entrada, objeto, arreglo y decisiones.
// EJERCICIO 1: 
function registrarCalculo() {

    const salario = Number(campoSalario.value);
    const cantidadHijos = Number(campoHijos.value);
    const creditoConyuge = Number(campoConyuge.value);

    if (!validarDatos(salario, cantidadHijos, creditoConyuge)) {
        return null;
    }

    const cargasSociales = salario * 0.1083;
    const resultadoRenta = calcularImpuestoRenta(salario);
    const creditoHijos = cantidadHijos * 1710;
    const creditosFiscales = creditoHijos + creditoConyuge;
    const impuestoRenta = Math.max(0, resultadoRenta.impuesto - creditosFiscales);
    const salarioNeto = salario - cargasSociales - impuestoRenta;

    return {
        salarioBruto: salario,
        cargasSociales: cargasSociales,
        impuestoRenta: impuestoRenta,
        creditosFiscales: creditosFiscales,
        salarioNeto: salarioNeto,
        tramoTxt: resultadoRenta.tramoTxt
    };

    return calculo;
}


//EJERCICIO 4 
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

// BLOQUE. Recorrer objetos y devolver otro objeto de resumen.
// EJERCICIO 1: 
function generarResumen(calculo) {

    return {
        bruto: calculo.salarioBruto,
        cargas: calculo.cargasSociales,
        renta: calculo.impuestoRenta,
        creditos: calculo.creditosFiscales,
        neto: calculo.salarioNeto,
        tramoTxt: calculo.tramoTxt
    };
}


//EJERCICIO 4
function calcularPromedio() {
    if (estudiantes.length === 0) {
        return 0;
    }
    let suma = 0;
    for (let i = 0; i < estudiantes.length; i++) {
        suma = suma + estudiantes[i].nota;
    }
    return suma / estudiantes.length;
}

// BLOQUE. Salida al DOM: crear, mostrar y filtrar sin recarga.
// EJERCICIO 1: 
function mostrarResultados(resumen) {

    mostrarBruto.textContent = formatoColones.format(resumen.bruto);
    mostrarCargas.textContent = formatoColones.format(resumen.cargas);
    mostrarRenta.textContent = formatoColones.format(resumen.renta);
    mostrarCreditos.textContent = formatoColones.format(resumen.creditos);
    mostrarNeto.textContent = formatoColones.format(resumen.neto);
    tramoTxt.textContent = resumen.tramoTxt;

    resultadoSalario.hidden = false; // Hacer visible la sección de resultados
}


// EJERCICIO 2: MANIPULACIÓN DEL DOM
document.getElementById("botonDOM").addEventListener("click", function () {
    const parrafo = document.getElementById("parrafoDOM");
    parrafo.textContent = "¡Ha aceptado terminos de uso!";
});

// EJERCICIO 3: ESTRUCTURA CONDICIONAL

document.getElementById("botonEdad").addEventListener("click", function () {
    const campoEdad = document.getElementById("edad");
    const resultado = document.getElementById("resultadoEdad");
    if (
        campoEdad.value.trim() === "" ||
        !Number.isInteger(Number(campoEdad.value)) ||
        Number(campoEdad.value) < 0
    ) {
        resultado.textContent =
            "Ingrese una edad válida.";
        resultado.className = "mt-3 text-danger";
        return;
    }
    const edad = Number(campoEdad.value);
    if (edad >= 18) {
        resultado.textContent =
            "Mayor de edad.";

        resultado.className = "mt-3 text-success";
    } else {

        resultado.textContent =
            "Menor de edad.";

        resultado.className = "mt-3 text-danger";
    }
}
);


///EJERCICIO4
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
            fila.className = "border rounded p-3 mb-2";

            let nombre = document.createElement("strong");
            // textContent no interpreta HTML (seguro ante etiquetas).
            nombre.textContent = estudiante.nombre;
            fila.appendChild(nombre);

            let detalle = document.createElement("span");
            detalle.className = "detalle";
            detalle.textContent = " - Nota: " + estudiante.nota +
                (aprobado === true ? " (Aprobado)" : " (Reprobado)");
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

    // Promedio al final de la lista (siempre de todos los estudiantes)
    document.getElementById("promedioNotas").textContent = calcularPromedio().toFixed(2);
    document.getElementById("totalVisibles").textContent = visibles;

    let estadoVacio = document.getElementById("estadoVacioNotas");
    if (estudiantes.length === 0) {
        estadoVacio.textContent = "Todavía no hay notas.";
    } else if (visibles === 0) {
        estadoVacio.textContent = "No hay estudiantes para el filtro seleccionado.";
    } else {
        estadoVacio.textContent = "";
    }
}



// BLOQUE. Eventos: actuar sin enviar el formulario al servidor.
formularioSalario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const calculo = registrarCalculo();
    if (calculo === null) {
        return;
    }
    const resumen = generarResumen(calculo);
    mostrarResultados(resumen);
});

formularioSalario.addEventListener("reset", function () {
    resultadoSalario.hidden = true;

    mostrarBruto.textContent = "";
    mostrarCargas.textContent = "";
    mostrarRenta.textContent = "";
    mostrarCreditos.textContent = "";
    mostrarNeto.textContent = "";
    tramoTxt.textContent = "";
});


///EJERCICIO4
formularioEstudiante.addEventListener("submit", function (evento) {
    evento.preventDefault();
    agregarEstudiante();
});

campoFiltroNotas.addEventListener("change", mostrarEstudiantes);
document.getElementById("limpiarNotas")
    .addEventListener("click", limpiarNotas);

mostrarEstudiantes();
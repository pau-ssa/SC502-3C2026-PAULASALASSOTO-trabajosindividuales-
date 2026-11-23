<?php
$titulo = "";
$accionActual = $_GET['accion'] ?? 'estado';
?>
<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title><?= e($titulo) ?> | Transacciones Tarjeta de Crédito</title>
    <link rel="stylesheet" href="assets/css/estilos.css">
</head>

<body>
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
        <div class="container navbar">
            <a class="marca" href="<?= e(ruta('estado')) ?>">Estado de Cuenta Crédito</a>
            <nav class="nav" aria-label="Navegación principal">
                <a class="nav-link" href="<?= e(ruta('estado')) ?>#transacciones">Transacciones</a>
                <a class="nav-link" href="<?= e(ruta('estado')) ?>#estado-cuenta">Estado de Cuenta</a>
                <a class="nav-link <?= in_array($accionActual, ['crear', 'guardar'], true) ? 'activo' : '' ?>"
                    href="<?= e(ruta('crear')) ?>">Registrar transacción</a>
            </nav>
        </div>
    </header>
    <div class="panel-hero">
        <div class="container">
            <p class="course-kicker">SC-502 · Practica Programada 3</p>
            <h1>Estado de Cuenta y Transacciones Crediticias</h1>
            <p>Gestión documental con PHP, MySQL y MVC.</p>
        </div>
    </div>
    <main id="contenido" class="container">
        <?php if ($aviso = tomar_aviso()): ?><div class="ok" role="status"><?= e($aviso) ?></div><?php endif; ?>

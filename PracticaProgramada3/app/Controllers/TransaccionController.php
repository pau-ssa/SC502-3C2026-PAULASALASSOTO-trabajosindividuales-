<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\View;
use App\Models\EstadoCuenta;
use App\Models\Transaccion;
use PDO;


final class TransaccionController
{
    private Transaccion $transacciones;
    private EstadoCuenta $estadoCuenta;

    public function __construct(private PDO $db)
    {
        $this->transacciones = new Transaccion($db);
        $this->estadoCuenta  = new EstadoCuenta();
    }

    /** GET ?accion=estado → muestra el estado de cuenta y genera estado_cuenta.txt */
    public function estado(): void
    {
        $lista  = $this->transacciones->listar();
        $estado = $this->estadoCuenta->generarEstadoDeCuenta($lista);

        $this->estadoCuenta->guardarTxt($estado, $this->rutaArchivo());

        View::render('transacciones/estado', $estado, 'Estado de cuenta');
    }

    /** GET ?accion=crear → formulario vacío */
    public function crear(): void
    {
        $this->formulario(['descripcion' => '', 'monto' => '']);
    }

    /** POST ?accion=guardar → valida y registra la transacción */
    public function guardar(): void
    {
        csrf_comprobar();
        $datos   = datos_transaccion_post();
        $errores = validar_transaccion($datos);
        if ($errores) {
            http_response_code(422);
            $this->formulario($datos, $errores);
            return;
        }

        $monto = number_format((float) $datos['monto'], 2, '.', '');
        $this->transacciones->registrarTransaccion($datos['descripcion'], $monto);

        aviso('Transacción registrada correctamente.');
        redirigir('estado');
    }

    private function formulario(array $datos, array $errores = []): void
    {
        View::render('transacciones/formulario', compact('datos', 'errores'),
            'Registrar transacción');
    }

    /** storage/estado_cuenta.txt, fuera de public/ */
    private function rutaArchivo(): string
    {
        return dirname(__DIR__, 2) . '/storage/estado_cuenta.txt';
    }
}
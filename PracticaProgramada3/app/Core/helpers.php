<?php
declare(strict_types=1);
use App\Core\HttpException;

/** Longitudes y recortes en caracteres; iconv sirve de respaldo si falta mbstring. */
function largo_utf8(string $texto): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($texto, 'UTF-8');
    }
    $n = iconv_strlen($texto, 'UTF-8');
    return $n === false ? strlen($texto) : $n;
}

function cortar_utf8(string $texto, int $inicio, int $cantidad): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($texto, $inicio, $cantidad, 'UTF-8');
    }
    $trozo = iconv_substr($texto, $inicio, $cantidad, 'UTF-8');
    return $trozo === false ? substr($texto, $inicio, $cantidad) : $trozo;
}

function e(mixed $valor): string {return htmlspecialchars((string)($valor??''),
    ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function ruta(string $accion='estado',?int $id=null): string {
    $url='index.php?accion='.rawurlencode($accion);
    return $id===null?$url:$url.'&id='.$id;
}
function csrf_token(): string {return $_SESSION['csrf']??=bin2hex(random_bytes(24));}
function csrf_comprobar(): void {
    if(!is_string($_POST['_csrf']??null) || !hash_equals(csrf_token(),$_POST['_csrf']))
        throw new HttpException(403,'Solicitud rechazada: token de formulario inválido.');
}
function identificador(): int {
    $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
    if ($id===false || $id===null || $id<1) throw new HttpException(400,
        'Se requiere un identificador numérico positivo.');
    return $id;
}
function redirigir(string $accion='estado'): never {header('Location: '.ruta($accion),true,303);exit;}
function aviso(string $texto): void {$_SESSION['aviso']=$texto;}
function tomar_aviso(): ?string {$texto=$_SESSION['aviso']??null;unset($_SESSION['aviso']);
    return $texto;}


function validar_transaccion(array $d): array {
    $errores = [];
    if ($d['descripcion'] === '' || largo_utf8($d['descripcion']) > 150) {
        $errores[] = 'La descripción es obligatoria y no debe superar 150 caracteres.';
    }
    $monto = filter_var($d['monto'], FILTER_VALIDATE_FLOAT);
    if ($monto === false || $monto <= 0 || $monto > 9999999999.99) {
        $errores[] = 'El monto debe ser un número mayor que cero.';
    }
    return $errores;
}

function datos_transaccion_post(): array {
    return [
        'descripcion' => trim(is_string($_POST['descripcion'] ?? null) ? $_POST['descripcion'] : ''),
        'monto'       => trim(is_string($_POST['monto'] ?? null) ? $_POST['monto'] : ''),
    ];
}
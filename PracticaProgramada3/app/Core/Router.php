<?php
declare(strict_types=1);
namespace App\Core;
use App\Controllers\TransaccionController;
use PDO;
final class Router
{
    public function __construct(private PDO $db)
    {
    }
    public function ejecutar(): void
    {
        $metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';       
        $accion = $_GET['accion'] ?? 'estado';

        if (!is_string($accion) || !preg_match('/\A[a-z_]+\z/D', $accion)) {
            throw new HttpException(400, 'Ruta inválida.');
        }
        $t = new TransaccionController($this->db);
        $rutas = [
            'GET estado'   => fn() => $t->estado(),
            'GET crear'    => fn() => $t->crear(),
            'POST guardar' => fn() => $t->guardar(),
        ];

        $clave = $metodo . ' ' . $accion;
        if (isset($rutas[$clave])) {
            $rutas[$clave]();
            return;
        }

        // La acción existe pero con otro método → 405
        foreach (array_keys($rutas) as $ruta) {
            if (str_ends_with($ruta, ' ' . $accion)) {
                http_response_code(405);
                header('Allow: ' . (str_starts_with($ruta, 'GET') ? 'GET' : 'POST'));
                throw new HttpException(405, 'El método HTTP no está permitido para esta acción.');
            }
        }

        throw new HttpException(404, 'No existe la dirección solicitada.');
    }
}
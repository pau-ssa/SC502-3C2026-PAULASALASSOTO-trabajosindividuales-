<?php
declare(strict_types=1);
namespace App\Models;
use App\Core\Procedimientos;
use PDO;

/** El modelo representa operaciones de datos; Nunca genera HTML ni hace cálculos de negocio. */
final class Transaccion
{
    public function __construct(private PDO $db)
    {
    }

    /** Devuelve todas las transacciones: ['id','descripcion','monto'] */
    public function listar(): array
    {
        return Procedimientos::filas($this->db, 'sp_transaccion_listar');
    }

    /** Devuelve una transacción o null si no existe. */
    public function obtener(int $id): ?array
    {
        return Procedimientos::uno($this->db, 'sp_transaccion_obtener', [$id]);
    }

    public function registrarTransaccion(string $descripcion, string $monto): int
    {
        $resultado = Procedimientos::uno($this->db, 'sp_transaccion_crear', [
            $descripcion,
            $monto,
        ]);
        return (int) ($resultado['id'] ?? 0);
    }
}
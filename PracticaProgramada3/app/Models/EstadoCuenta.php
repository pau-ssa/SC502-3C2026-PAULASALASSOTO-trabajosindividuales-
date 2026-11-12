<?php
declare(strict_types=1);
namespace App\Models;
use RuntimeException;

/**
 * estado de cuenta: cálculos y archivo de texto.
 */
final class EstadoCuenta
{
    private const INTERES  = 0.026; 
    private const CASHBACK = 0.001; 
  
    private const ANCHO_ID    = 4;
    private const ANCHO_DESC  = 30;
    private const ANCHO_MONTO = 15;
    private const ANCHO_TOTAL = self::ANCHO_ID + 2 + self::ANCHO_DESC + 2 + self::ANCHO_MONTO;

    public function generarEstadoDeCuenta(array $transacciones): array
    {
        $contado = 0.0;
        foreach ($transacciones as $t) {
            $contado += (float) $t['monto'];
        }
        $contado = round($contado, 2);
        $conInteres = round($contado * (1 + self::INTERES), 2);
        $cashback   = round($contado * self::CASHBACK, 2);
        $final      = round($conInteres - $cashback, 2);
        return [
            'transacciones' => $transacciones,
            'contado'       => $contado,
            'conInteres'    => $conInteres,
            'cashback'      => $cashback,
            'final'         => $final,
            'fecha'         => date('d/m/Y H:i'),
        ];
    }

    /** Escribe el estado de cuenta en un archivo de texto (sobrescribe el anterior). */
    public function guardarTxt(array $estado, string $ruta): void
    {
        $carpeta = dirname($ruta);
        if (!is_dir($carpeta) && !mkdir($carpeta, 0775, true) && !is_dir($carpeta)) {
            throw new RuntimeException('No se pudo crear la carpeta ' . $carpeta);
        }else if (file_put_contents($ruta, $this->armarTexto($estado), LOCK_EX) === false) {
            throw new RuntimeException('No se pudo escribir el archivo ' . $ruta);
        }
    }

    /** Construye el contenido del .txt con columnas alineadas. */
    private function armarTexto(array $estado): string
    {
        $doble   = str_repeat('=', self::ANCHO_TOTAL);
        $simple  = str_repeat('-', self::ANCHO_TOTAL);
        $lineas  = [];

        $lineas[] = $doble;
        $lineas[] = 'ESTADO DE CUENTA - TARJETA DE CRÉDITO';
        $lineas[] = 'Generado: ' . $estado['fecha'];
        $lineas[] = $doble;
        $lineas[] = $this->columna('ID', self::ANCHO_ID) . '  '
                  . $this->columna('Descripción', self::ANCHO_DESC) . '  '
                  . $this->columna('Monto', self::ANCHO_MONTO, true);
        $lineas[] = $simple;

        if (!$estado['transacciones']) {
            $lineas[] = 'Sin transacciones registradas.';
        }
        foreach ($estado['transacciones'] as $t) {
            $lineas[] = $this->columna((string) $t['id'], self::ANCHO_ID) . '  '
                      . $this->columna((string) $t['descripcion'], self::ANCHO_DESC) . '  '
                      . $this->columna($this->formato((float) $t['monto']), self::ANCHO_MONTO, true);
        }

        $lineas[] = $simple;
        $lineas[] = $this->resumen('Monto total de contado:', $estado['contado']);
        $lineas[] = $this->resumen('Monto con interés (2.6%):', $estado['conInteres']);
        $lineas[] = $this->resumen('Cash back (0.1%):', $estado['cashback']);
        $lineas[] = $simple;
        $lineas[] = $this->resumen('MONTO FINAL A PAGAR:', $estado['final']);
        $lineas[] = $doble;
        return implode(PHP_EOL, $lineas) . PHP_EOL;
    }

    private function resumen(string $etiqueta, float $valor): string
    {
        $anchoEtiqueta = self::ANCHO_TOTAL - self::ANCHO_MONTO;
        return $this->columna($etiqueta, $anchoEtiqueta)
             . $this->columna($this->formato($valor), self::ANCHO_MONTO, true);
    }

    private function formato(float $valor): string
    {
        return number_format($valor, 2, '.', ',');
    }

    private function columna(string $texto, int $ancho, bool $derecha = false): string
    {
        if (largo_utf8($texto) > $ancho) {
            $texto = cortar_utf8($texto, 0, $ancho);
        }
        $relleno = str_repeat(' ', $ancho - largo_utf8($texto));
        return $derecha ? $relleno . $texto : $texto . $relleno;
    }
}
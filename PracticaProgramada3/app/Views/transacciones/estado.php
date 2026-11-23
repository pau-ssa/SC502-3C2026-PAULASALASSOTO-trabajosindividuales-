<?php
/** Variables que llegan desde TransaccionController::estado() vía View::render()
 * @var array  $transacciones
 * @var float  $contado
 * @var float  $conInteres
 * @var float  $cashback
 * @var float  $final
 * @var string $fecha
 */
?>

<div class="barra" id="transacciones">
    <h2>Lista de transacciones</h2>
    <span class="etiqueta"><?= count($transacciones) ?> transacción(es)</span>
</div>

<?php if (!$transacciones): ?>
    <p class="ok">
        No hay transacciones registradas.
        <a href="<?= e(ruta('crear')) ?>">Registrar la primera</a>.
    </p>
<?php else: ?>
    <div class="transacciones-card tabla-externa">
        <table class="tabla">
            <caption>Detalle de transacciones con tarjeta de crédito</caption>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Fecha</th>
                    <th scope="col" class="num">Monto</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($transacciones as $t): ?>
                    <tr>
                        <td><span class="etiqueta">#<?= e($t['id']) ?></span></td>
                        <td><?= e($t['descripcion']) ?></td>
                        <td><?= e(date('d/m/Y H:i', strtotime((string) $t['creado_en']))) ?></td>
                        <td class="num"><?= e(number_format((float) $t['monto'], 2)) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="3">Total de contado</th>
                    <td class="num"><?= e(number_format($contado, 2)) ?></td>
                </tr>
            </tfoot>
        </table>
    </div>
<?php endif; ?>

<section class="transacciones-card resumen-cuenta" id="estado-cuenta" aria-labelledby="titulo-resumen">
    <div class="barra">
        <h2 id="titulo-resumen">Estado de cuenta</h2>
        <span class="etiqueta">Generado: <?= e($fecha) ?></span>
    </div>

    <dl>
        <div>
            <dt>Monto total de contado</dt>
            <dd><?= e(number_format($contado, 2)) ?></dd>
        </div>
        <div>
            <dt>Monto con interés (2.6%)</dt>
            <dd><?= e(number_format($conInteres, 2)) ?></dd>
        </div>
        <div>
            <dt>Cash back (0.1%)</dt>
            <dd>- <?= e(number_format($cashback, 2)) ?></dd>
        </div>
        <div class="resumen-total">
            <dt>Monto final a pagar</dt>
            <dd><?= e(number_format($final, 2)) ?></dd>
        </div>
    </dl>

    <p class="ayuda">
        Este detalle también se guardó en <code>storage/estado_cuenta.txt</code>.
    </p>

    <div class="acciones">
        <a class="btn btn-primary" href="<?= e(ruta('crear')) ?>">Registrar transacción</a>
    </div>
</section>

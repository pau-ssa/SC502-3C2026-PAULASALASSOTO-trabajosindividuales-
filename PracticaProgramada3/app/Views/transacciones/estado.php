<div class="barra">
    <h2>Lista de transacciones</h2>
    <span class="etiqueta"><?= count($transacciones) ?> transacción(es)</span>
</div>

<?php if (!$transacciones): ?>
    <p class="ok">
        No hay transacciones registradas.
        <a href="<?= e(ruta('crear')) ?>">Registrar la primera</a>.
    </p>
<?php else: ?>
    <div class="estado-grid">
        <?php foreach ($transacciones as $t): ?>
            <article class="transacciones-card">
                <span class="transacciones-icono" aria-hidden="true">₡</span>
                <h3><?= e($t['descripcion']) ?></h3>
                <p>
                    <strong>Monto:</strong> <?= e(number_format((float) $t['monto'], 2)) ?>
                </p>
                <p>
                    <span class="etiqueta">#<?= e($t['id']) ?></span>
                    <span class="etiqueta">
                        <?= e(date('d/m/Y H:i', strtotime((string) $t['creado_en']))) ?>
                    </span>
                </p>
            </article>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<section class="transacciones-card resumen-cuenta" aria-labelledby="titulo-resumen">
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
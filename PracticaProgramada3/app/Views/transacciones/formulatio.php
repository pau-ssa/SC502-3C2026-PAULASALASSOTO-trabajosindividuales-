<p>
    <a href="<?= e(ruta('estado')) ?>">← Volver al estado de cuenta</a>
</p>

<h2>Registrar transacción</h2>

<?php foreach ($errores as $error): ?>
    <div class="error" role="alert"><?= e($error) ?></div>
<?php endforeach; ?>

<form class="transacciones-card formulario" method="post" action="<?= e(ruta('guardar')) ?>" novalidate>
    <input type="hidden" name="_csrf" value="<?= e(csrf_token()) ?>">

    <div class="campo">
        <label for="descripcion">Descripción</label>
        <input id="descripcion" name="descripcion" type="text" maxlength="150" required
               placeholder="Ej.: Supermercado"
               value="<?= e($datos['descripcion'] ?? '') ?>">
        <span class="ayuda">Máximo 150 caracteres.</span>
    </div>

    <div class="campo">
        <label for="monto">Monto (₡)</label>
        <input id="monto" name="monto" type="number" step="0.01" min="0.01" required
               inputmode="decimal" placeholder="0.00"
               value="<?= e($datos['monto'] ?? '') ?>">
        <span class="ayuda">Debe ser mayor que cero. Use punto para los decimales.</span>
    </div>

    <div class="controles">
        <button class="btn btn-primary" type="submit">Guardar transacción</button>
        <a class="btn btn-outline" href="<?= e(ruta('estado')) ?>">Cancelar</a>
    </div>
</form>
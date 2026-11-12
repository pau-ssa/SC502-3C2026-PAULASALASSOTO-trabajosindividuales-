
CREATE DATABASE IF NOT EXISTS `EstadodeCuenta` 
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `EstadodeCuenta`;


CREATE TABLE IF NOT EXISTS transacciones (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(150)  NOT NULL,
    monto       DECIMAL(12,2) NOT NULL,
    creado_en   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_transaccion_monto CHECK (monto > 0)
) ENGINE=InnoDB;


-- Procedimientos almacenados
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_transaccion_listar`$$
CREATE PROCEDURE `sp_transaccion_listar`()
BEGIN
    SELECT id, descripcion, monto, creado_en
    FROM transacciones
    ORDER BY id;
END$$

DROP PROCEDURE IF EXISTS `sp_transaccion_obtener`$$
CREATE PROCEDURE `sp_transaccion_obtener`(IN p_id INT)
BEGIN
    SELECT id, descripcion, monto, creado_en
    FROM transacciones
    WHERE id = p_id
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS `sp_transaccion_crear`$$
CREATE PROCEDURE `sp_transaccion_crear`(
    IN p_descripcion VARCHAR(150),
    IN p_monto       DECIMAL(12,2)
)
BEGIN
    IF p_monto IS NULL OR p_monto <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El monto debe ser mayor que cero.';
    END IF;

    INSERT INTO transacciones (descripcion, monto)
    VALUES (TRIM(p_descripcion), p_monto);

    SELECT LAST_INSERT_ID() AS id;
END$$

DELIMITER ;


-- Datos de prueba 
INSERT INTO transacciones (id, descripcion, monto) VALUES
    (1, 'Supermercado',          45250.00),
    (2, 'Gasolina',              30000.00),
    (3, 'Restaurante',           18500.50),
    (4, 'Suscripción streaming',  6990.00),
    (5, 'Farmacia',              12340.75)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    monto       = VALUES(monto);
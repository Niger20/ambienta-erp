-- ============================================================================
-- ALTER: Mermas con conversión a otro producto (Opción C)
-- ============================================================================
-- Contexto: cuando un producto se rompe (ej. cerámica entera) puede
-- convertirse en otro producto vendible a menor precio (ej. cerámica rota).
-- Estas columnas registran ese vínculo A -> B para poder reportar cuánta
-- mercancía se está rompiendo y en qué se está convirtiendo.
--
-- Seguro de re-ejecutar: las columnas usan IF NOT EXISTS y los DROP usan
-- IF EXISTS, así que correr este script dos veces no falla.
-- ============================================================================

-- 1) Nuevas columnas en Mermas (todas opcionales; NULL = merma sin conversión,
--    es decir, pérdida total, tal como funciona hoy)
ALTER TABLE Mermas ADD COLUMN IF NOT EXISTS ProductoDestinoID INTEGER NULL;
ALTER TABLE Mermas ADD COLUMN IF NOT EXISTS CantidadDestino NUMERIC(10,2) NULL;
ALTER TABLE Mermas ADD COLUMN IF NOT EXISTS MovimientoIngresoID INTEGER NULL;

-- 2) Relaciones (FK) hacia Productos y MovimientosInventario
ALTER TABLE Mermas
    ADD CONSTRAINT mermas_productodestinoid_fkey
    FOREIGN KEY (ProductoDestinoID) REFERENCES Productos(ProductoID);

ALTER TABLE Mermas
    ADD CONSTRAINT mermas_movimientoingresoid_fkey
    FOREIGN KEY (MovimientoIngresoID) REFERENCES MovimientosInventario(MovimientoID);

-- 3) Un movimiento de ingreso solo puede pertenecer a UNA merma
ALTER TABLE Mermas
    ADD CONSTRAINT mermas_movimientoingresoid_key
    UNIQUE (MovimientoIngresoID);

-- ============================================================================
-- 4) IMPORTANTE — Bug preexistente encontrado y corregido:
--    Existe un trigger (trg_merma_movimiento / fn_registrar_movimiento_merma)
--    que, al insertar en Mermas, vuelve a descontar el stock del producto Y
--    vuelve a crear otro registro en MovimientosInventario — duplicando el
--    trabajo que la aplicación (api) ya hace manualmente. Esto provoca que
--    CADA merma registrada hoy descuente el DOBLE del stock real, y además
--    deja un movimiento de inventario huérfano.
--
--    Con el código ya corregido en la aplicación (que ahora maneja tanto la
--    merma simple como la conversión A->B), este trigger sobra y debe
--    eliminarse para que el stock quede correcto.
-- ============================================================================
DROP TRIGGER IF EXISTS trg_merma_movimiento ON Mermas;
DROP FUNCTION IF EXISTS fn_registrar_movimiento_merma();

-- ============================================================================
-- Verificación opcional — correr después para confirmar que todo quedó bien
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'mermas' ORDER BY ordinal_position;
--
-- SELECT trigger_name FROM information_schema.triggers
--   WHERE event_object_table = 'mermas';  -- debe devolver 0 filas

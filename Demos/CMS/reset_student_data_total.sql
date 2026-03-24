-- SCRIPT DE LIMPIEZA TOTAL (INICIO DESDE CERO)
-- Ejecuta esto si deseas borrar todo el historial y empezar la contabilidad de nuevo.

-- 1. Borrar todas las cuotas
TRUNCATE TABLE installments CASCADE;

-- 2. Borrar todo el historial de auditoría
TRUNCATE TABLE audit_log CASCADE;

-- 3. Borrar registros de gastos (opcional, quitar los guiones si se desea borrar)
-- TRUNCATE TABLE expenses CASCADE;

-- 4. Reiniciar secuencias si es necesario (depende de la configuración de Supabase)
-- ALTER SEQUENCE installments_id_seq RESTART WITH 1;
-- ALTER SEQUENCE audit_log_id_seq RESTART WITH 1;

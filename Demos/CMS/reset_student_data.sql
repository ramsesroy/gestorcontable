-- SCRIPT DE LIMPIEZA DE DATOS (ZONA CRÍTICA)
-- Este script elimina registros de cuotas y auditoría huérfanos o antiguos.

-- Opción A: Eliminar solo registros huérfanos (sin alumno asociado)
DELETE FROM installments WHERE student_id NOT IN (SELECT id FROM students);
DELETE FROM audit_log WHERE entity_type = 'student' AND entity_id::uuid NOT IN (SELECT id FROM students);

-- Opción B: Reset completo de tablas de transacciones (usar con precaución)
-- TRUNCATE TABLE installments CASCADE;
-- TRUNCATE TABLE audit_log CASCADE;
-- TRUNCATE TABLE expenses CASCADE;

-- Comentario informativo
-- Se recomienda ejecutar la Opción A primero para limpiar restos de alumnos eliminados.

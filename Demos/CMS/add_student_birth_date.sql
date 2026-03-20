-- Script para agregar la columna birth_date a la tabla students
ALTER TABLE students ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Comentario para documentación
COMMENT ON COLUMN students.birth_date IS 'Fecha de nacimiento del alumno para el sistema de alertas de cumpleaños.';

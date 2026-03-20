-- Add birth_date column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Update audit log to include this new information in future edits
COMMENT ON COLUMN public.students.birth_date IS 'Fecha de nacimiento del alumno para legajo y promociones.';

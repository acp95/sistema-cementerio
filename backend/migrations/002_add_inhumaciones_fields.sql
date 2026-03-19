-- Migration: Add missing fields to inhumaciones table
-- Created: 2025-12-15
-- Description: Adds hora_inhumacion, numero_acta, and observaciones columns

-- Add hora_inhumacion column (TIME type)
ALTER TABLE inhumaciones
ADD COLUMN IF NOT EXISTS hora_inhumacion TIME;

-- Add numero_acta column
ALTER TABLE inhumaciones
ADD COLUMN IF NOT EXISTS numero_acta VARCHAR(50);

-- Add observaciones column
ALTER TABLE inhumaciones
ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Set default values for existing records
UPDATE inhumaciones
SET
    hora_inhumacion = '00:00:00'
WHERE
    hora_inhumacion IS NULL;

COMMENT ON COLUMN inhumaciones.hora_inhumacion IS 'Hora en que se realizó la inhumación';

COMMENT ON COLUMN inhumaciones.numero_acta IS 'Número de acta de inhumación';

COMMENT ON COLUMN inhumaciones.observaciones IS 'Observaciones adicionales sobre la inhumación';
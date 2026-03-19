-- Migration: Add missing columns to sectores table
-- Date: 2025-12-13
-- Description: Add descripcion, tipo_espacio, and capacidad_total columns

-- Add descripcion column
ALTER TABLE sectores ADD COLUMN IF NOT EXISTS descripcion TEXT;

-- Add tipo_espacio column
ALTER TABLE sectores
ADD COLUMN IF NOT EXISTS tipo_espacio VARCHAR(20) DEFAULT 'nicho';

-- Add capacidad_total column
ALTER TABLE sectores
ADD COLUMN IF NOT EXISTS capacidad_total INTEGER DEFAULT 0;

-- Update existing records to have default values
UPDATE sectores
SET
    tipo_espacio = 'nicho'
WHERE
    tipo_espacio IS NULL;

UPDATE sectores
SET
    capacidad_total = 0
WHERE
    capacidad_total IS NULL;

COMMIT;
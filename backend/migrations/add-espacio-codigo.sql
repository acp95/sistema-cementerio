-- Migration: Add codigo field to espacios table
-- Date: 2025-12-13
-- Description: Add unique codigo field for automatic space identification

-- Add codigo column
ALTER TABLE espacios
ADD COLUMN IF NOT EXISTS codigo VARCHAR(20) UNIQUE;

-- For existing records, generate codigo from sector name and numero if they exist
-- This is a placeholder - you may need to run a custom script to properly populate existing records

COMMIT;
-- Check existing columns in trips table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'trips'
ORDER BY ordinal_position;

-- Add transport_mode column if it doesn't exist
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS transport_mode TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'trips'
AND column_name = 'transport_mode';

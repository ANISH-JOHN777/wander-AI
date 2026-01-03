-- =====================================================
-- ADD MISSING COLUMNS TO TRIPS TABLE
-- =====================================================
-- Run this in Supabase SQL Editor to add all missing columns

-- Add transport_mode column
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS transport_mode TEXT;

-- Add the Complete Trip Setup columns (if not already added)
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS vehicle_details JSONB,
ADD COLUMN IF NOT EXISTS accommodation_details JSONB,
ADD COLUMN IF NOT EXISTS activities_details JSONB,
ADD COLUMN IF NOT EXISTS budget_details JSONB,
ADD COLUMN IF NOT EXISTS setup_type TEXT;

-- Add comments
COMMENT ON COLUMN trips.transport_mode IS 'Mode of transport: own, rented, or public';
COMMENT ON COLUMN trips.vehicle_details IS 'Vehicle/transport details (type, name, price)';
COMMENT ON COLUMN trips.accommodation_details IS 'Accommodation details (type, name, price)';
COMMENT ON COLUMN trips.activities_details IS 'Activities and dining details (tour package, restaurants)';
COMMENT ON COLUMN trips.budget_details IS 'Budget and preferences (estimated budget, preferences, notes)';
COMMENT ON COLUMN trips.setup_type IS 'Type of trip setup: manual, ai, or complete';

-- Verify all columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'trips'
AND column_name IN ('transport_mode', 'vehicle_details', 'accommodation_details', 'activities_details', 'budget_details', 'setup_type')
ORDER BY column_name;

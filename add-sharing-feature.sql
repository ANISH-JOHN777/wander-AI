-- =====================================================
-- PUBLIC TRIP SHARING FEATURE - DATABASE MIGRATION
-- =====================================================
-- Run this in Supabase SQL Editor

-- Add sharing columns to trips table
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token VARCHAR(12) UNIQUE,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shared_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster share token lookups
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON trips(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON trips(is_public) WHERE is_public = true;

-- Add comments for documentation
COMMENT ON COLUMN trips.is_public IS 'Whether the trip is publicly shareable';
COMMENT ON COLUMN trips.share_token IS 'Unique token for public sharing (12 characters)';
COMMENT ON COLUMN trips.view_count IS 'Number of times the shared trip has been viewed';
COMMENT ON COLUMN trips.shared_at IS 'Timestamp when trip was first made public';

-- Function to generate unique share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS VARCHAR(12) AS $$
DECLARE
    token VARCHAR(12);
    token_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 12-character token
        token := substring(md5(random()::text || clock_timestamp()::text) from 1 for 12);
        
        -- Check if token already exists
        SELECT EXISTS(SELECT 1 FROM trips WHERE share_token = token) INTO token_exists;
        
        -- Exit loop if token is unique
        EXIT WHEN NOT token_exists;
    END LOOP;
    
    RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate share token when trip is made public
CREATE OR REPLACE FUNCTION auto_generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
    -- If trip is being made public and doesn't have a token, generate one
    IF NEW.is_public = true AND (NEW.share_token IS NULL OR NEW.share_token = '') THEN
        NEW.share_token := generate_share_token();
        NEW.shared_at := NOW();
    END IF;
    
    -- If trip is being made private, keep the token but reset view count
    IF NEW.is_public = false AND OLD.is_public = true THEN
        -- Keep share_token for potential re-sharing
        NEW.view_count := 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_auto_generate_share_token ON trips;
CREATE TRIGGER trigger_auto_generate_share_token
    BEFORE INSERT OR UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_share_token();

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'trips'
AND column_name IN ('is_public', 'share_token', 'view_count', 'shared_at')
ORDER BY column_name;

-- Test the share token generation
SELECT generate_share_token() as sample_token;

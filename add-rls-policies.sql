-- =====================================================
-- RLS POLICIES FOR PUBLIC TRIP SHARING
-- =====================================================

-- 1. Enable RLS on trips table (if not already enabled)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Allow owners to do everything (existing or standard policy)
-- This assumes you already have an 'Allow owners to handle their trips' policy.
-- If not, here is a standard one:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trips' AND policyname = 'All access for owners'
    ) THEN
        CREATE POLICY "All access for owners" ON trips
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Policy: Allow PUBLIC (anonymous) users to READ public trips
-- This is the CRITICAL fix for the share link
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trips' AND policyname = 'Allow public read access for public trips'
    ) THEN
        CREATE POLICY "Allow public read access for public trips" ON trips
        FOR SELECT
        TO anon, authenticated
        USING (is_public = true);
    END IF;
END $$;

-- 4. Policy: Allow PUBLIC (anonymous) users to UPDATE view count
-- We need this so incrementViewCount works for anonymous visitors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trips' AND policyname = 'Allow public to update view count'
    ) THEN
        CREATE POLICY "Allow public to update view count" ON trips
        FOR UPDATE
        TO anon, authenticated
        USING (is_public = true)
        WITH CHECK (is_public = true);
    END IF;
END $$;

-- Notice: The RPC function increment_view_count (if defined as SECURITY DEFINER) 
-- bypasses RLS, which is a safer way to increment view counts without 
-- giving update permissions to everyone. 
-- Let's make sure the RPC from Phase 1 is robust.

-- Re-declaring the function with SECURITY DEFINER to bypass RLS for view counts
CREATE OR REPLACE FUNCTION increment_view_count(t_token TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE trips
    SET view_count = view_count + 1
    WHERE share_token = t_token AND is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO anon, authenticated;

-- =====================================================
-- AI TRIP PLANNER - DATABASE SCHEMA
-- =====================================================
-- This file contains the complete database schema for the AI Trip Planner
-- Run this in your Supabase SQL Editor to set up the database

-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- -----------------------------------------------------
-- Users Table
-- -----------------------------------------------------
-- Note: Supabase Auth handles user authentication
-- This extends the auth.users table with additional profile data
-- The auth.users table already has: id, email, created_at

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- -----------------------------------------------------
-- Trips Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Trip Details
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travel_type TEXT NOT NULL CHECK (travel_type IN ('solo', 'couple', 'group')),
    
    -- Additional Info (optional, for extensibility)
    travelers INTEGER DEFAULT 1,
    budget DECIMAL(10, 2),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT trips_travelers_positive CHECK (travelers > 0),
    CONSTRAINT trips_dates_valid CHECK (end_date >= start_date),
    CONSTRAINT trips_budget_positive CHECK (budget IS NULL OR budget >= 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS trips_start_date_idx ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS trips_status_idx ON public.trips(status);
CREATE INDEX IF NOT EXISTS trips_created_at_idx ON public.trips(created_at DESC);

-- -----------------------------------------------------
-- DayPlans Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.day_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    
    -- Day Information
    day_number INTEGER NOT NULL,
    day_date DATE,
    
    -- Activities stored as JSONB array
    -- Each activity: { id, time, title, description, location, type, completed }
    activities JSONB DEFAULT '[]',
    
    -- Additional Info
    notes TEXT,
    budget DECIMAL(10, 2),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT day_plans_day_number_positive CHECK (day_number > 0),
    CONSTRAINT day_plans_unique_day_per_trip UNIQUE (trip_id, day_number),
    CONSTRAINT day_plans_budget_positive CHECK (budget IS NULL OR budget >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS day_plans_trip_id_idx ON public.day_plans(trip_id);
CREATE INDEX IF NOT EXISTS day_plans_day_number_idx ON public.day_plans(day_number);

-- -----------------------------------------------------
-- Stories Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    
    -- Story Content
    title TEXT NOT NULL,
    story_text TEXT NOT NULL,
    image_url TEXT,
    
    -- Additional Info (for extensibility)
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT stories_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT stories_text_not_empty CHECK (LENGTH(TRIM(story_text)) > 0),
    CONSTRAINT stories_likes_non_negative CHECK (likes_count >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS stories_trip_id_idx ON public.stories(trip_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS stories_is_public_idx ON public.stories(is_public) WHERE is_public = TRUE;

-- =====================================================
-- 3. CREATE FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: Auto-update updated_at timestamp
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: Auto-create user profile on signup
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- Function: Get user's trip count
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_trip_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.trips WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- Function: Get trip's day plan count
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_trip_day_plan_count(trip_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.day_plans WHERE trip_id = trip_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- Function: Get trip's story count
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_trip_story_count(trip_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.stories WHERE trip_id = trip_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. CREATE TRIGGERS
-- =====================================================

-- -----------------------------------------------------
-- Trigger: Auto-update updated_at on users
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- Trigger: Auto-update updated_at on trips
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- Trigger: Auto-update updated_at on day_plans
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_day_plans_updated_at ON public.day_plans;
CREATE TRIGGER update_day_plans_updated_at
    BEFORE UPDATE ON public.day_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- Trigger: Auto-update updated_at on stories
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- Trigger: Auto-create user profile on auth signup
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- Users Policies
-- -----------------------------------------------------

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- -----------------------------------------------------
-- Trips Policies
-- -----------------------------------------------------

-- Users can view their own trips
CREATE POLICY "Users can view own trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own trips
CREATE POLICY "Users can insert own trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own trips
CREATE POLICY "Users can update own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own trips
CREATE POLICY "Users can delete own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- DayPlans Policies
-- -----------------------------------------------------

-- Users can view day plans for their own trips
CREATE POLICY "Users can view own trip day plans"
    ON public.day_plans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Users can insert day plans for their own trips
CREATE POLICY "Users can insert own trip day plans"
    ON public.day_plans FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Users can update day plans for their own trips
CREATE POLICY "Users can update own trip day plans"
    ON public.day_plans FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Users can delete day plans for their own trips
CREATE POLICY "Users can delete own trip day plans"
    ON public.day_plans FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------
-- Stories Policies
-- -----------------------------------------------------

-- Users can view their own stories
CREATE POLICY "Users can view own stories"
    ON public.stories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Users can view public stories (for future social features)
CREATE POLICY "Anyone can view public stories"
    ON public.stories FOR SELECT
    USING (is_public = TRUE);

-- Users can insert stories for their own trips
CREATE POLICY "Users can insert own trip stories"
    ON public.stories FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Users can update their own stories
CREATE POLICY "Users can update own stories"
    ON public.stories FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Users can delete their own stories
CREATE POLICY "Users can delete own stories"
    ON public.stories FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- =====================================================
-- 6. CREATE STORAGE BUCKETS
-- =====================================================

-- Note: Run these in Supabase Dashboard → Storage or via SQL

-- Create bucket for story images
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. STORAGE POLICIES
-- =====================================================

-- Story Images Policies
CREATE POLICY "Users can upload story images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'story-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can view story images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'story-images');

CREATE POLICY "Users can delete own story images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'story-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Avatar Policies
CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- 8. CREATE VIEWS (Optional - for easier queries)
-- =====================================================

-- View: Trips with day plan and story counts
CREATE OR REPLACE VIEW trips_with_counts AS
SELECT 
    t.*,
    COUNT(DISTINCT dp.id) AS day_plan_count,
    COUNT(DISTINCT s.id) AS story_count
FROM public.trips t
LEFT JOIN public.day_plans dp ON t.id = dp.trip_id
LEFT JOIN public.stories s ON t.id = s.trip_id
GROUP BY t.id;

-- View: User statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    COUNT(DISTINCT t.id) AS total_trips,
    COUNT(DISTINCT dp.id) AS total_day_plans,
    COUNT(DISTINCT s.id) AS total_stories,
    u.created_at AS member_since
FROM public.users u
LEFT JOIN public.trips t ON u.id = t.user_id
LEFT JOIN public.day_plans dp ON t.id = dp.trip_id
LEFT JOIN public.stories s ON t.id = s.trip_id
GROUP BY u.id, u.email, u.full_name, u.created_at;

-- =====================================================
-- 9. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data
-- Note: Replace 'YOUR_USER_ID' with an actual user ID from auth.users

/*
-- Insert sample trip
INSERT INTO public.trips (user_id, destination, start_date, end_date, travel_type, travelers)
VALUES 
    ('YOUR_USER_ID', 'Goa, India', '2024-12-20', '2024-12-25', 'couple', 2);

-- Get the trip ID
DO $$
DECLARE
    trip_uuid UUID;
BEGIN
    SELECT id INTO trip_uuid FROM public.trips WHERE destination = 'Goa, India' LIMIT 1;
    
    -- Insert sample day plans
    INSERT INTO public.day_plans (trip_id, day_number, day_date, activities)
    VALUES 
        (trip_uuid, 1, '2024-12-20', '[
            {"id": 1, "time": "09:00", "title": "Beach Visit", "description": "Visit Calangute Beach", "type": "activity"},
            {"id": 2, "time": "14:00", "title": "Lunch", "description": "Seafood at beach shack", "type": "food"}
        ]'::jsonb),
        (trip_uuid, 2, '2024-12-21', '[
            {"id": 1, "time": "10:00", "title": "Fort Aguada", "description": "Visit historic fort", "type": "sightseeing"}
        ]'::jsonb);
    
    -- Insert sample story
    INSERT INTO public.stories (trip_id, title, story_text)
    VALUES 
        (trip_uuid, 'My Amazing Goa Trip', 'This was an unforgettable journey through the beaches of Goa...');
END $$;
*/

-- =====================================================
-- 10. VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'trips', 'day_plans', 'stories')
ORDER BY table_name;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'trips', 'day_plans', 'stories')
ORDER BY tablename;

-- Check policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('users', 'trips', 'day_plans', 'stories')
ORDER BY tablename, indexname;

-- Check foreign key relationships
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Summary of what was created:
-- ✅ 4 Tables: users, trips, day_plans, stories
-- ✅ Foreign key relationships established
-- ✅ Row Level Security (RLS) enabled
-- ✅ Policies for user data isolation
-- ✅ Indexes for performance
-- ✅ Triggers for auto-updates
-- ✅ Storage buckets for images
-- ✅ Helper functions and views

-- Next steps:
-- 1. Verify all tables and policies (run verification queries above)
-- 2. Test with a sample user account
-- 3. Update your .env file with Supabase credentials
-- 4. Set VITE_BACKEND_MODE=supabase
-- 5. Restart your dev server

-- Documentation:
-- See BACKEND_SETUP_GUIDE.md for detailed setup instructions

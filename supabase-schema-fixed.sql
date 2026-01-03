-- =====================================================
-- AI TRIP PLANNER - SIMPLIFIED DATABASE SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- This version fixes the user_id reference issue

-- =====================================================
-- STEP 1: ENABLE EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 2: CREATE USERS TABLE
-- =====================================================
-- This extends auth.users with profile data

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- =====================================================
-- STEP 3: CREATE TRIPS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travel_type TEXT NOT NULL CHECK (travel_type IN ('solo', 'couple', 'group')),
    travelers INTEGER DEFAULT 1,
    budget DECIMAL(10, 2),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT trips_travelers_positive CHECK (travelers > 0),
    CONSTRAINT trips_dates_valid CHECK (end_date >= start_date),
    CONSTRAINT trips_budget_positive CHECK (budget IS NULL OR budget >= 0)
);

CREATE INDEX IF NOT EXISTS trips_user_id_idx ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS trips_start_date_idx ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS trips_created_at_idx ON public.trips(created_at DESC);

-- =====================================================
-- STEP 4: CREATE DAY_PLANS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.day_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    day_date DATE,
    activities JSONB DEFAULT '[]',
    notes TEXT,
    budget DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT day_plans_day_number_positive CHECK (day_number > 0),
    CONSTRAINT day_plans_unique_day_per_trip UNIQUE (trip_id, day_number),
    CONSTRAINT day_plans_budget_positive CHECK (budget IS NULL OR budget >= 0)
);

CREATE INDEX IF NOT EXISTS day_plans_trip_id_idx ON public.day_plans(trip_id);
CREATE INDEX IF NOT EXISTS day_plans_day_number_idx ON public.day_plans(day_number);

-- =====================================================
-- STEP 5: CREATE STORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    story_text TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT stories_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT stories_text_not_empty CHECK (LENGTH(TRIM(story_text)) > 0),
    CONSTRAINT stories_likes_non_negative CHECK (likes_count >= 0)
);

CREATE INDEX IF NOT EXISTS stories_trip_id_idx ON public.stories(trip_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON public.stories(created_at DESC);

-- =====================================================
-- STEP 6: CREATE FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create user profile on signup
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

-- =====================================================
-- STEP 7: CREATE TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_day_plans_updated_at ON public.day_plans;
CREATE TRIGGER update_day_plans_updated_at
    BEFORE UPDATE ON public.day_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- STEP 8: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 9: CREATE RLS POLICIES
-- =====================================================

-- Users Policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Trips Policies
CREATE POLICY "Users can view own trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id);

-- Day Plans Policies
CREATE POLICY "Users can view own trip day plans"
    ON public.day_plans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own trip day plans"
    ON public.day_plans FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own trip day plans"
    ON public.day_plans FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own trip day plans"
    ON public.day_plans FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = day_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Stories Policies
CREATE POLICY "Users can view own stories"
    ON public.stories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own trip stories"
    ON public.stories FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own stories"
    ON public.stories FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = stories.trip_id
            AND trips.user_id = auth.uid()
        )
    );

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
-- STEP 10: CREATE STORAGE BUCKETS
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 11: STORAGE POLICIES
-- =====================================================

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

CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'trips', 'day_plans', 'stories')
ORDER BY table_name;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- ✅ All tables created
-- ✅ RLS enabled
-- ✅ Policies active
-- ✅ Storage buckets created
-- ✅ Ready to use!

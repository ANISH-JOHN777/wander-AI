-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
-- Run this in Supabase SQL Editor to ensure RLS is enabled

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'trips', 'day_plans', 'stories')
ORDER BY tablename;

-- This should show:
-- users       | true
-- trips       | true
-- day_plans   | true
-- stories     | true

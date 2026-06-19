-- ============================================================
-- Supabase Migration: Property Vision Launchpad
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE (extends auth.users with role & phone)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('GUEST', 'USER', 'ADMIN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    'USER'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PAGE VISITS TABLE (analytics)
CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON public.page_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_path ON public.page_visits(path);

-- 3. CONTACT SUBMISSIONS TABLE (publish CTA form)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  property_interest TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. EXISTING TABLES — add updated_at triggers where missing
-- (your current Prisma tables are already in place, we just add RLS)

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_page_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES
-- Users can read their own profile; admins can read all
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- PROPERTIES
-- Public read published; admins full access
CREATE POLICY "Public read published properties"
  ON public.properties FOR SELECT
  USING (status = 'PUBLISHED');

CREATE POLICY "Admins all properties"
  ON public.properties FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- PROPERTY MEDIA
CREATE POLICY "Public read property media"
  ON public.property_media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_id AND p.status = 'PUBLISHED'
  ));

CREATE POLICY "Admins all property media"
  ON public.property_media FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- AMENITIES
CREATE POLICY "Public read amenities"
  ON public.amenities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_id AND p.status = 'PUBLISHED'
  ));

CREATE POLICY "Admins all amenities"
  ON public.amenities FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- HERO
CREATE POLICY "Public read hero"
  ON public.property_page_hero FOR SELECT
  USING (true);

CREATE POLICY "Admins all hero"
  ON public.property_page_hero FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- LEADS
-- Authenticated users insert; admins read/update
CREATE POLICY "Authenticated insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins all leads"
  ON public.leads FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "Public can insert leads (anonymous)"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- BANNERS
CREATE POLICY "Public read active banners"
  ON public.promotional_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins all banners"
  ON public.promotional_banners FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- PAGE VISITS
-- Anyone can insert; only admins can read
CREATE POLICY "Anyone insert page visits"
  ON public.page_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read page visits"
  ON public.page_visits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- CONTACT SUBMISSIONS
-- Authenticated users insert; admins read
CREATE POLICY "Authenticated insert contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins read contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- ============================================================
-- HELPER FUNCTION: Get current user role
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

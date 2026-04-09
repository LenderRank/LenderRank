-- LenderRep Database Schema
-- Run this in the Supabase SQL Editor to set up your tables

-- ============================================================
-- LOAN OFFICERS
-- ============================================================
CREATE TABLE IF NOT EXISTS loan_officers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  company         TEXT,
  city            TEXT,
  state           TEXT,
  initials        TEXT,
  avatar_color    TEXT DEFAULT 'bg-gray-100 text-gray-600',
  nmls_id         TEXT,
  bio             TEXT,
  avg_rating      NUMERIC(3,1) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  ranking_score   NUMERIC(12,6) DEFAULT 0,
  years_experience INTEGER,
  specialties     TEXT[],
  is_verified     BOOLEAN DEFAULT false,
  is_claimed      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  first_name  TEXT,
  last_name   TEXT,
  role        TEXT DEFAULT 'homebuyer',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_officer_id  UUID REFERENCES loan_officers(id) ON DELETE CASCADE,
  reviewer_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name    TEXT,
  rating           INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text      TEXT,
  loan_type        TEXT,
  closing_date     TEXT,
  nmls_submitted   TEXT,
  city             TEXT,
  state            TEXT,
  is_approved      BOOLEAN DEFAULT false,
  is_confirmed     BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE loan_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- loan_officers: anyone can read
CREATE POLICY "Public read loan_officers"
  ON loan_officers FOR SELECT
  USING (true);

-- loan_officers: no public writes (managed via Supabase dashboard or service role)
-- To allow admin updates via anon key (current setup), add:
CREATE POLICY "Authenticated update loan_officers"
  ON loan_officers FOR UPDATE
  TO authenticated
  USING (true);

-- profiles: users can read and write their own profile
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- reviews: anyone can read approved reviews
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- reviews: authenticated users can insert
CREATE POLICY "Authenticated insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- reviews: authenticated users can read all reviews (needed for admin)
CREATE POLICY "Authenticated read all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

-- reviews: authenticated users can update (approve/confirm)
CREATE POLICY "Authenticated update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true);

-- reviews: authenticated users can delete
CREATE POLICY "Authenticated delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

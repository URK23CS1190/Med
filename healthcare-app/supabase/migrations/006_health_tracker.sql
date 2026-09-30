-- =====================================================
-- MedCare - Health Tracker Table
-- Migration: 006_health_tracker.sql
-- =====================================================

CREATE TYPE activity_type_enum AS ENUM (
  'Walking', 'Jogging', 'Running', 'Cycling', 'Other'
);

CREATE TABLE health_tracker_entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type         activity_type_enum NOT NULL,
  duration_min INT  NOT NULL CHECK (duration_min > 0),
  distance_km  NUMERIC CHECK (distance_km >= 0),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-user queries
CREATE INDEX idx_health_tracker_user ON health_tracker_entries(user_id, created_at DESC);

-- =====================================================
-- Row-Level Security
-- =====================================================

ALTER TABLE health_tracker_entries ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own entries
CREATE POLICY "select_own_entries" ON health_tracker_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Patients can insert only their own entries
CREATE POLICY "insert_own_entries" ON health_tracker_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Patients can delete their own entries
CREATE POLICY "delete_own_entries" ON health_tracker_entries
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- MedCare Healthcare Super-App — Initial Schema
-- Migration: 001_initial_schema.sql
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role_enum AS ENUM (
  'patient', 'doctor', 'hospital_admin', 'nurse',
  'pharmacy_admin', 'ambulance_driver', 'super_admin'
);

CREATE TYPE provider_type_enum AS ENUM (
  'doctor', 'nurse', 'pharmacist', 'ambulance_driver'
);

CREATE TYPE verification_status_enum AS ENUM (
  'draft', 'submitted', 'under_review', 'verified', 'rejected'
);

CREATE TYPE consultation_mode_enum AS ENUM ('clinic', 'video', 'audio');

CREATE TYPE appointment_status_enum AS ENUM (
  'scheduled', 'waiting', 'in_call', 'completed', 'cancelled'
);

CREATE TYPE call_status_enum AS ENUM ('waiting', 'active', 'ended', 'failed');

CREATE TYPE order_status_enum AS ENUM (
  'placed', 'packed', 'dispatched', 'delivered', 'cancelled'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending', 'paid', 'failed', 'refunded'
);

CREATE TYPE vaccination_status_enum AS ENUM (
  'upcoming', 'due', 'administered', 'missed'
);

CREATE TYPE trip_status_enum AS ENUM (
  'requested', 'assigned', 'en_route', 'arrived', 'completed'
);

CREATE TYPE record_type_enum AS ENUM (
  'lab', 'scan', 'prescription', 'note', 'discharge'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  address JSONB,
  role user_role_enum NOT NULL DEFAULT 'patient',
  is_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'en',
  consent_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospitals
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address JSONB,
  location GEOGRAPHY(POINT),
  specialties TEXT[],
  rating NUMERIC DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  admin_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers (doctors, nurses, pharmacists, ambulance drivers)
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider_type provider_type_enum NOT NULL,
  specialty TEXT[],
  license_number TEXT,
  license_doc_url TEXT,
  government_id_url TEXT,
  verification_status verification_status_enum DEFAULT 'draft',
  rejection_reason TEXT,
  experience_years INT,
  consultation_fee NUMERIC,
  languages TEXT[],
  working_hours JSONB,
  rating NUMERIC DEFAULT 0,
  review_count INT DEFAULT 0,
  bank_details JSONB,
  hospital_id UUID REFERENCES hospitals(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bed Inventory
CREATE TABLE bed_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  icu_total INT DEFAULT 0,
  icu_available INT DEFAULT 0,
  general_total INT DEFAULT 0,
  general_available INT DEFAULT 0,
  ventilator_total INT DEFAULT 0,
  ventilator_available INT DEFAULT 0,
  oxygen_total INT DEFAULT 0,
  oxygen_available INT DEFAULT 0,
  emergency_total INT DEFAULT 0,
  emergency_available INT DEFAULT 0,
  last_updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  auto_expire_at TIMESTAMPTZ
);

-- Child Profiles
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  blood_group TEXT,
  allergies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  gateway TEXT,
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  status payment_status_enum DEFAULT 'pending',
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES providers(id),
  child_profile_id UUID REFERENCES child_profiles(id),
  consultation_mode consultation_mode_enum NOT NULL,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  status appointment_status_enum DEFAULT 'scheduled',
  payment_id UUID REFERENCES payments(id),
  consent_granted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tele Call Sessions
CREATE TABLE tele_call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  room_id TEXT UNIQUE,
  status call_status_enum DEFAULT 'waiting',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INT,
  failure_reason TEXT,
  downgraded_to_audio BOOLEAN DEFAULT FALSE,
  recording_consent BOOLEAN DEFAULT FALSE
);

-- Pharmacy Items
CREATE TABLE pharmacy_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID REFERENCES providers(id),
  name TEXT NOT NULL,
  generic_name TEXT,
  manufacturer TEXT,
  category TEXT,
  requires_prescription BOOLEAN DEFAULT FALSE,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  stock_quantity INT DEFAULT 0,
  expiry_date DATE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pharmacy_id UUID REFERENCES providers(id),
  items JSONB NOT NULL,
  prescription_url TEXT,
  requires_verification BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending',
  status order_status_enum DEFAULT 'placed',
  delivery_address JSONB,
  total_amount NUMERIC NOT NULL,
  payment_id UUID REFERENCES payments(id),
  tracking_events JSONB[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vaccinations
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  due_date DATE NOT NULL,
  administered_date DATE,
  administered_by UUID REFERENCES providers(id),
  batch_number TEXT,
  certificate_url TEXT,
  status vaccination_status_enum DEFAULT 'upcoming'
);

-- Growth Records
CREATE TABLE growth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  head_circumference_cm NUMERIC,
  bmi NUMERIC GENERATED ALWAYS AS (
    CASE WHEN height_cm > 0 THEN weight_kg / ((height_cm / 100.0) ^ 2) ELSE NULL END
  ) STORED,
  recorded_by UUID REFERENCES providers(id)
);

-- Medical Records
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  record_type record_type_enum NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  tags TEXT[],
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ambulance Trips
CREATE TABLE ambulance_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES providers(id),
  patient_id UUID REFERENCES profiles(id),
  pickup_location GEOGRAPHY(POINT),
  destination_hospital_id UUID REFERENCES hospitals(id),
  status trip_status_enum DEFAULT 'requested',
  current_location GEOGRAPHY(POINT),
  eta_minutes INT,
  bed_reservation_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES profiles(id),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IoT Vitals (time-series)
CREATE TABLE iot_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id),
  device_id TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  heart_rate INT,
  spo2 NUMERIC,
  temperature NUMERIC,
  systolic_bp INT,
  diastolic_bp INT,
  ecg_data JSONB
);

-- Emergency Contacts
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  notify_on_sos BOOLEAN DEFAULT TRUE
);

-- SOS Events
CREATE TABLE sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id),
  location GEOGRAPHY(POINT),
  status TEXT DEFAULT 'active',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Symptom Sessions (AI Symptom Checker)
CREATE TABLE symptom_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id),
  symptoms JSONB,
  ai_response JSONB,
  suggested_specialty TEXT,
  urgency_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Second Opinion Requests
CREATE TABLE second_opinion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id),
  medical_record_id UUID REFERENCES medical_records(id),
  doctor_id UUID REFERENCES providers(id),
  status TEXT DEFAULT 'pending',
  consent_granted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Scores
CREATE TABLE health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id),
  overall_score INT,
  appointment_score INT,
  vaccination_score INT,
  bmi_score INT,
  vitals_score INT,
  badges JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Queue
CREATE TABLE hospital_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id),
  department TEXT NOT NULL,
  patient_id UUID REFERENCES profiles(id),
  token_number INT,
  status TEXT DEFAULT 'waiting',
  estimated_wait_minutes INT,
  called_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Schedules
CREATE TABLE medication_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  times JSONB,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adherence Logs
CREATE TABLE adherence_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES medication_schedules(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  taken_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bed Reservation Requests
CREATE TABLE bed_reservation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES ambulance_trips(id),
  hospital_id UUID REFERENCES hospitals(id),
  bed_type TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud Flags
CREATE TABLE fraud_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  flag_type TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

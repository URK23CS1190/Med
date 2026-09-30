-- =====================================================
-- MedCare — Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulance_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE second_opinion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_reservation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_flags ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role_enum AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- PROFILES
-- =====================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Doctors can view patient profiles for consented appointments"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN providers p ON p.id = a.doctor_id
      WHERE p.user_id = auth.uid()
      AND a.patient_id = profiles.id
      AND a.consent_granted = true
    )
  );

CREATE POLICY "Super admin can view all profiles"
  ON profiles FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can update all profiles"
  ON profiles FOR UPDATE
  USING (is_super_admin());

-- =====================================================
-- PROVIDERS
-- =====================================================

CREATE POLICY "Public can view verified providers"
  ON providers FOR SELECT
  USING (verification_status = 'verified');

CREATE POLICY "Provider can view own record"
  ON providers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Provider can update own record"
  ON providers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Provider can insert own record"
  ON providers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super admin manages all providers"
  ON providers FOR ALL
  USING (is_super_admin());

-- =====================================================
-- HOSPITALS
-- =====================================================

CREATE POLICY "Public can view verified hospitals"
  ON hospitals FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Admin can manage own hospital"
  ON hospitals FOR ALL
  USING (admin_id = auth.uid());

CREATE POLICY "Super admin manages all hospitals"
  ON hospitals FOR ALL
  USING (is_super_admin());

-- =====================================================
-- BED INVENTORY
-- =====================================================

CREATE POLICY "Public can view bed inventory"
  ON bed_inventory FOR SELECT
  USING (true);

CREATE POLICY "Hospital admin can update own beds"
  ON bed_inventory FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hospitals h
      WHERE h.id = bed_inventory.hospital_id
      AND h.admin_id = auth.uid()
    )
  );

CREATE POLICY "Super admin manages all beds"
  ON bed_inventory FOR ALL
  USING (is_super_admin());

-- =====================================================
-- APPOINTMENTS
-- =====================================================

CREATE POLICY "Patient can view own appointments"
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patient can create own appointments"
  ON appointments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patient can update own appointments"
  ON appointments FOR UPDATE
  USING (patient_id = auth.uid());

CREATE POLICY "Doctor can view assigned appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = appointments.doctor_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctor can update assigned appointments"
  ON appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = appointments.doctor_id
      AND p.user_id = auth.uid()
    )
  );

-- =====================================================
-- MEDICAL RECORDS
-- =====================================================

CREATE POLICY "Patient can view own records"
  ON medical_records FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patient can insert own records"
  ON medical_records FOR INSERT
  WITH CHECK (patient_id = auth.uid() OR uploaded_by = auth.uid());

CREATE POLICY "Doctor can view consented patient records"
  ON medical_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN providers p ON p.id = a.doctor_id
      WHERE p.user_id = auth.uid()
      AND a.patient_id = medical_records.patient_id
      AND a.consent_granted = true
    )
  );

CREATE POLICY "Doctor can insert records for consented patients"
  ON medical_records FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

-- =====================================================
-- ORDERS
-- =====================================================

CREATE POLICY "Patient can view own orders"
  ON orders FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patient can create own orders"
  ON orders FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Pharmacy admin can view assigned orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = orders.pharmacy_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacy admin can update assigned orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = orders.pharmacy_id
      AND p.user_id = auth.uid()
    )
  );

-- =====================================================
-- CHILD PROFILES & VACCINATIONS
-- =====================================================

CREATE POLICY "Parent can manage own children"
  ON child_profiles FOR ALL
  USING (parent_id = auth.uid());

CREATE POLICY "Parent can manage children vaccinations"
  ON vaccinations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles cp
      WHERE cp.id = vaccinations.child_id
      AND cp.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parent can manage children growth records"
  ON growth_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles cp
      WHERE cp.id = growth_records.child_id
      AND cp.parent_id = auth.uid()
    )
  );

-- =====================================================
-- PHARMACY ITEMS
-- =====================================================

CREATE POLICY "Public can view active pharmacy items"
  ON pharmacy_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Pharmacy admin can manage own catalog"
  ON pharmacy_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = pharmacy_items.pharmacy_id
      AND p.user_id = auth.uid()
    )
  );

-- =====================================================
-- EMERGENCY & AMBULANCE
-- =====================================================

CREATE POLICY "Patient can manage own emergency contacts"
  ON emergency_contacts FOR ALL
  USING (patient_id = auth.uid());

CREATE POLICY "Patient can manage own SOS events"
  ON sos_events FOR ALL
  USING (patient_id = auth.uid());

CREATE POLICY "Driver can view assigned trips"
  ON ambulance_trips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = ambulance_trips.driver_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Driver can update assigned trips"
  ON ambulance_trips FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = ambulance_trips.driver_id
      AND p.user_id = auth.uid()
    )
  );

-- =====================================================
-- MISC TABLES
-- =====================================================

CREATE POLICY "User can manage own medication schedules"
  ON medication_schedules FOR ALL
  USING (patient_id = auth.uid());

CREATE POLICY "User can manage own adherence logs"
  ON adherence_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM medication_schedules ms
      WHERE ms.id = adherence_logs.schedule_id
      AND ms.patient_id = auth.uid()
    )
  );

CREATE POLICY "User can view own health scores"
  ON health_scores FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "User can view own symptom sessions"
  ON symptom_sessions FOR ALL
  USING (patient_id = auth.uid());

CREATE POLICY "User can manage own queue entries"
  ON hospital_queues FOR ALL
  USING (patient_id = auth.uid());

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (is_moderated = false OR reviewer_id = auth.uid());

CREATE POLICY "User can create own reviews"
  ON reviews FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Super admin can view all audit logs"
  ON audit_logs FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can manage fraud flags"
  ON fraud_flags FOR ALL
  USING (is_super_admin());

CREATE POLICY "User can view own payments"
  ON payments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "User can view own tele call sessions"
  ON tele_call_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = tele_call_sessions.appointment_id
      AND (a.patient_id = auth.uid() OR EXISTS (
        SELECT 1 FROM providers p WHERE p.id = a.doctor_id AND p.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "User can view own IoT vitals"
  ON iot_vitals FOR SELECT
  USING (patient_id = auth.uid());

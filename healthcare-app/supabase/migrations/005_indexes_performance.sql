-- =====================================================
-- MedCare — Indexes & Performance
-- Migration: 005_indexes_performance.sql
-- =====================================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Providers
CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_type ON providers(provider_type);
CREATE INDEX idx_providers_status ON providers(verification_status);
CREATE INDEX idx_providers_hospital ON providers(hospital_id);
CREATE INDEX idx_providers_specialty ON providers USING GIN(specialty);

-- Hospitals
CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_hospitals_specialties ON hospitals USING GIN(specialties);
CREATE INDEX idx_hospitals_admin ON hospitals(admin_id);

-- Bed Inventory
CREATE INDEX idx_bed_inventory_hospital ON bed_inventory(hospital_id);
CREATE INDEX idx_bed_inventory_updated ON bed_inventory(updated_at DESC);

-- Appointments
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_slot ON appointments(slot_start, slot_end);
CREATE INDEX idx_appointments_created ON appointments(created_at DESC);

-- Orders
CREATE INDEX idx_orders_patient ON orders(patient_id);
CREATE INDEX idx_orders_pharmacy ON orders(pharmacy_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Medical Records
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_type ON medical_records(record_type);
CREATE INDEX idx_medical_records_created ON medical_records(created_at DESC);
CREATE INDEX idx_medical_records_tags ON medical_records USING GIN(tags);

-- Pharmacy Items
CREATE INDEX idx_pharmacy_items_pharmacy ON pharmacy_items(pharmacy_id);
CREATE INDEX idx_pharmacy_items_category ON pharmacy_items(category);
CREATE INDEX idx_pharmacy_items_name ON pharmacy_items USING GIN(to_tsvector('english', name || ' ' || COALESCE(generic_name, '')));

-- Reviews
CREATE INDEX idx_reviews_target ON reviews(target_id, target_type);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table ON audit_logs(target_table);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Ambulance Trips
CREATE INDEX idx_ambulance_trips_driver ON ambulance_trips(driver_id);
CREATE INDEX idx_ambulance_trips_status ON ambulance_trips(status);

-- IoT Vitals
CREATE INDEX idx_iot_vitals_patient ON iot_vitals(patient_id);
CREATE INDEX idx_iot_vitals_recorded ON iot_vitals(recorded_at DESC);

-- Vaccinations
CREATE INDEX idx_vaccinations_child ON vaccinations(child_id);
CREATE INDEX idx_vaccinations_status ON vaccinations(status);

-- Medication Schedules
CREATE INDEX idx_medication_schedules_patient ON medication_schedules(patient_id);

-- Health Scores
CREATE INDEX idx_health_scores_patient ON health_scores(patient_id);

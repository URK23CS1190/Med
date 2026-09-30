-- =====================================================
-- MedCare — Functions & Triggers
-- Migration: 003_functions_triggers.sql
-- =====================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Audit log trigger function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (actor_id, action, target_table, target_id, metadata)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers on critical tables
CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE PROCEDURE log_audit_event();
CREATE TRIGGER audit_medical_records AFTER INSERT OR UPDATE OR DELETE ON medical_records
  FOR EACH ROW EXECUTE PROCEDURE log_audit_event();
CREATE TRIGGER audit_orders AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE PROCEDURE log_audit_event();
CREATE TRIGGER audit_providers AFTER UPDATE ON providers
  FOR EACH ROW EXECUTE PROCEDURE log_audit_event();

-- Bed inventory update notification
CREATE OR REPLACE FUNCTION notify_bed_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.auto_expire_at = NOW() + INTERVAL '4 hours';
  PERFORM pg_notify('bed_inventory_update', json_build_object(
    'hospital_id', NEW.hospital_id,
    'icu_available', NEW.icu_available,
    'general_available', NEW.general_available,
    'ventilator_available', NEW.ventilator_available
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_bed_inventory_update
  BEFORE UPDATE ON bed_inventory
  FOR EACH ROW EXECUTE PROCEDURE notify_bed_update();

-- Slot availability check function
CREATE OR REPLACE FUNCTION calculate_slot_availability(
  p_doctor_id UUID,
  p_date DATE
)
RETURNS TABLE (
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ,
  is_available BOOLEAN
) AS $$
BEGIN
  -- Returns 30-minute slots for the given doctor on the given date
  -- Checks against existing appointments
  RETURN QUERY
  SELECT
    gs.slot_start,
    gs.slot_start + INTERVAL '30 minutes' AS slot_end,
    NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.doctor_id = p_doctor_id
      AND a.status NOT IN ('cancelled')
      AND a.slot_start < gs.slot_start + INTERVAL '30 minutes'
      AND a.slot_end > gs.slot_start
    ) AS is_available
  FROM generate_series(
    (p_date + TIME '09:00')::TIMESTAMPTZ,
    (p_date + TIME '18:00')::TIMESTAMPTZ,
    INTERVAL '30 minutes'
  ) AS gs(slot_start);
END;
$$ LANGUAGE plpgsql;

-- Expire stale beds (run via pg_cron every hour)
CREATE OR REPLACE FUNCTION expire_stale_beds()
RETURNS void AS $$
BEGIN
  UPDATE bed_inventory
  SET icu_available = 0, general_available = 0,
      ventilator_available = 0, oxygen_available = 0, emergency_available = 0
  WHERE auto_expire_at < NOW()
  AND auto_expire_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule pg_cron if available
-- SELECT cron.schedule('expire-stale-beds', '0 * * * *', 'SELECT expire_stale_beds()');

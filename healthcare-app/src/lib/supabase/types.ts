// ===================================================================
// Supabase Database Types
// Generated placeholder — replace with `supabase gen types typescript`
// ===================================================================

export type UserRole =
    | "patient"
    | "doctor"
    | "hospital_admin"
    | "nurse"
    | "pharmacy_admin"
    | "ambulance_driver"
    | "super_admin";

export type ProviderType =
    | "doctor"
    | "nurse"
    | "pharmacist"
    | "ambulance_driver";

export type VerificationStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "verified"
    | "rejected";

export type ConsultationMode = "clinic" | "video" | "audio";

export type AppointmentStatus =
    | "scheduled"
    | "waiting"
    | "in_call"
    | "completed"
    | "cancelled";

export type CallStatus = "waiting" | "active" | "ended" | "failed";

export type OrderStatus =
    | "placed"
    | "packed"
    | "dispatched"
    | "delivered"
    | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type VaccinationStatus =
    | "upcoming"
    | "due"
    | "administered"
    | "missed";

export type TripStatus =
    | "requested"
    | "assigned"
    | "en_route"
    | "arrived"
    | "completed";

export type RecordType =
    | "lab"
    | "scan"
    | "prescription"
    | "note"
    | "discharge";

// ===================================================================
// Table Types
// ===================================================================

export interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    gender: string | null;
    blood_group: string | null;
    address: Address | null;
    role: UserRole;
    is_verified: boolean;
    mfa_enabled: boolean;
    preferred_language: string;
    consent_accepted_at: string | null;
    created_at: string;
}

export interface Address {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
}

export interface Provider {
    id: string;
    user_id: string;
    provider_type: ProviderType;
    specialty: string[];
    license_number: string | null;
    license_doc_url: string | null;
    government_id_url: string | null;
    verification_status: VerificationStatus;
    rejection_reason: string | null;
    experience_years: number | null;
    consultation_fee: number | null;
    languages: string[];
    working_hours: Record<string, WorkingHourSlot[]>;
    rating: number;
    review_count: number;
    hospital_id: string | null;
    created_at: string;
}

export interface WorkingHourSlot {
    start: string;
    end: string;
}

export interface Hospital {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: Address | null;
    location: { lat: number; lng: number } | null;
    specialties: string[];
    rating: number;
    is_verified: boolean;
    admin_id: string;
    created_at: string;
}

export interface BedInventory {
    id: string;
    hospital_id: string;
    icu_total: number;
    icu_available: number;
    general_total: number;
    general_available: number;
    ventilator_total: number;
    ventilator_available: number;
    oxygen_total: number;
    oxygen_available: number;
    emergency_total: number;
    emergency_available: number;
    last_updated_by: string;
    updated_at: string;
    auto_expire_at: string | null;
}

export interface Appointment {
    id: string;
    patient_id: string;
    doctor_id: string;
    child_profile_id: string | null;
    consultation_mode: ConsultationMode;
    slot_start: string;
    slot_end: string;
    status: AppointmentStatus;
    payment_id: string | null;
    consent_granted: boolean;
    notes: string | null;
    created_at: string;
    // Joined fields
    doctor?: Provider & { profile?: Profile };
    patient?: Profile;
}

export interface TeleCallSession {
    id: string;
    appointment_id: string;
    room_id: string;
    status: CallStatus;
    started_at: string | null;
    ended_at: string | null;
    duration_seconds: number | null;
    failure_reason: string | null;
    downgraded_to_audio: boolean;
    recording_consent: boolean;
}

export interface PharmacyItem {
    id: string;
    pharmacy_id: string;
    name: string;
    generic_name: string | null;
    manufacturer: string | null;
    category: string | null;
    requires_prescription: boolean;
    price: number;
    mrp: number;
    stock_quantity: number;
    expiry_date: string | null;
    image_url: string | null;
    is_active: boolean;
}

export interface Order {
    id: string;
    patient_id: string;
    pharmacy_id: string;
    items: OrderItem[];
    prescription_url: string | null;
    requires_verification: boolean;
    verification_status: string;
    status: OrderStatus;
    delivery_address: Address;
    total_amount: number;
    payment_id: string | null;
    tracking_events: TrackingEvent[];
}

export interface OrderItem {
    item_id: string;
    name: string;
    qty: number;
    price: number;
}

export interface TrackingEvent {
    status: string;
    timestamp: string;
    note: string;
}

export interface ChildProfile {
    id: string;
    parent_id: string;
    name: string;
    date_of_birth: string;
    gender: string | null;
    blood_group: string | null;
    allergies: string[];
    created_at: string;
}

export interface Vaccination {
    id: string;
    child_id: string;
    vaccine_name: string;
    due_date: string;
    administered_date: string | null;
    administered_by: string | null;
    batch_number: string | null;
    certificate_url: string | null;
    status: VaccinationStatus;
}

export interface GrowthRecord {
    id: string;
    child_id: string;
    recorded_at: string;
    weight_kg: number;
    height_cm: number;
    head_circumference_cm: number | null;
    bmi: number;
    recorded_by: string | null;
}

export interface MedicalRecord {
    id: string;
    patient_id: string;
    appointment_id: string | null;
    record_type: RecordType;
    title: string;
    file_url: string | null;
    uploaded_by: string;
    tags: string[];
    is_shared: boolean;
    created_at: string;
}

export interface AmbulanceTrip {
    id: string;
    driver_id: string;
    patient_id: string | null;
    pickup_location: { lat: number; lng: number };
    destination_hospital_id: string | null;
    status: TripStatus;
    current_location: { lat: number; lng: number };
    eta_minutes: number | null;
    bed_reservation_requested: boolean;
    created_at: string;
}

export interface Review {
    id: string;
    reviewer_id: string;
    target_id: string;
    target_type: string;
    rating: number;
    comment: string | null;
    is_moderated: boolean;
    is_flagged: boolean;
    moderated_by: string | null;
    created_at: string;
    reviewer?: Profile;
}

export interface AuditLog {
    id: string;
    actor_id: string;
    action: string;
    target_table: string;
    target_id: string;
    metadata: Record<string, unknown>;
    ip_address: string | null;
    created_at: string;
    actor?: Profile;
}

export interface Payment {
    id: string;
    patient_id: string;
    amount: number;
    currency: string;
    gateway: string;
    gateway_order_id: string | null;
    gateway_payment_id: string | null;
    status: PaymentStatus;
    invoice_url: string | null;
    created_at: string;
}

export interface IoTVitals {
    id: string;
    patient_id: string;
    device_id: string;
    recorded_at: string;
    heart_rate: number | null;
    spo2: number | null;
    temperature: number | null;
    systolic_bp: number | null;
    diastolic_bp: number | null;
    ecg_data: Record<string, unknown> | null;
}

export interface EmergencyContact {
    id: string;
    patient_id: string;
    name: string;
    phone: string;
    relationship: string;
    notify_on_sos: boolean;
}

// ===================================================================
// Supabase Database type wrapper
// ===================================================================

export interface Database {
    public: {
        Tables: {
            profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
            providers: { Row: Provider; Insert: Partial<Provider>; Update: Partial<Provider> };
            hospitals: { Row: Hospital; Insert: Partial<Hospital>; Update: Partial<Hospital> };
            bed_inventory: { Row: BedInventory; Insert: Partial<BedInventory>; Update: Partial<BedInventory> };
            appointments: { Row: Appointment; Insert: Partial<Appointment>; Update: Partial<Appointment> };
            tele_call_sessions: { Row: TeleCallSession; Insert: Partial<TeleCallSession>; Update: Partial<TeleCallSession> };
            pharmacy_items: { Row: PharmacyItem; Insert: Partial<PharmacyItem>; Update: Partial<PharmacyItem> };
            orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> };
            child_profiles: { Row: ChildProfile; Insert: Partial<ChildProfile>; Update: Partial<ChildProfile> };
            vaccinations: { Row: Vaccination; Insert: Partial<Vaccination>; Update: Partial<Vaccination> };
            growth_records: { Row: GrowthRecord; Insert: Partial<GrowthRecord>; Update: Partial<GrowthRecord> };
            medical_records: { Row: MedicalRecord; Insert: Partial<MedicalRecord>; Update: Partial<MedicalRecord> };
            ambulance_trips: { Row: AmbulanceTrip; Insert: Partial<AmbulanceTrip>; Update: Partial<AmbulanceTrip> };
            reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
            audit_logs: { Row: AuditLog; Insert: Partial<AuditLog>; Update: Partial<AuditLog> };
            payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> };
            iot_vitals: { Row: IoTVitals; Insert: Partial<IoTVitals>; Update: Partial<IoTVitals> };
            emergency_contacts: { Row: EmergencyContact; Insert: Partial<EmergencyContact>; Update: Partial<EmergencyContact> };
        };
        Enums: {
            user_role: UserRole;
            provider_type: ProviderType;
            verification_status: VerificationStatus;
            consultation_mode: ConsultationMode;
            appointment_status: AppointmentStatus;
            call_status: CallStatus;
            order_status: OrderStatus;
            payment_status: PaymentStatus;
            vaccination_status: VaccinationStatus;
            trip_status: TripStatus;
            record_type: RecordType;
        };
    };
}

export type ActivityType = "Walking" | "Jogging" | "Running" | "Cycling" | "Other";

export interface HealthTrackerEntry {
    id: string;
    user_id: string;
    type: ActivityType;
    duration_min: number;
    distance_km: number | null;
    notes: string | null;
    created_at: string;
}

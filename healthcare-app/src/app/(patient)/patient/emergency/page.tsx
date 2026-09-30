"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle, Phone, MapPin, Activity,
    Navigation, Clock, Siren, Edit2, Check, User, Heart, FileText, Loader2
} from "lucide-react";
import { Card, Badge, Button, Input } from "@/components/ui";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";

const nearbyHospitals = [
    { id: "h1", name: "Apollo Hospital", distance: "2.3 km", icu: 5, general: 12, emergency: 3, rating: 4.8, eta: "8 min" },
    { id: "h2", name: "Fortis Medical Centre", distance: "3.1 km", icu: 2, general: 8, emergency: 5, rating: 4.6, eta: "12 min" },
    { id: "h3", name: "Max Healthcare", distance: "4.5 km", icu: 0, general: 15, emergency: 1, rating: 4.7, eta: "15 min" },
    { id: "h4", name: "AIIMS", distance: "6.2 km", icu: 8, general: 20, emergency: 7, rating: 4.9, eta: "20 min" },
];

export default function EmergencyPage() {
    const user = useAuthStore((s) => s.user);
    const supabase = getSupabaseBrowserClient();

    const [sosActive, setSosActive] = useState(false);

    // Medical ID State
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bloodGroup, setBloodGroup] = useState("O Positive (O+)");
    const [allergies, setAllergies] = useState("Penicillin (Anaphylaxis risk), Peanuts");
    const [conditions, setConditions] = useState("Mild Asthma, Hypertension");
    const [medications, setMedications] = useState("Albuterol Inhaler (As needed)");
    const [organDonor, setOrganDonor] = useState("Yes");
    const [insurance, setInsurance] = useState("Star Health Policy # SH-84930-22");

    // Contact State
    const [contactName, setContactName] = useState("Kavitha Kumar");
    const [contactPhone, setContactPhone] = useState("+91 98765 43211");
    const [contactRelation, setContactRelation] = useState("Wife");

    // Fetch live profile details if available
    useEffect(() => {
        const fetchMedicalDetails = async () => {
            if (!user) return;
            // Fetch blood group from profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("blood_group, phone")
                .eq("id", user.id)
                .single();
            if (profile?.blood_group) setBloodGroup(profile.blood_group);

            // Fetch primary contact
            const { data: contacts } = await supabase
                .from("emergency_contacts")
                .select("name, phone, relationship")
                .eq("patient_id", user.id)
                .limit(1);

            if (contacts && contacts.length > 0) {
                setContactName(contacts[0].name);
                setContactPhone(contacts[0].phone);
                setContactRelation(contacts[0].relationship || "Contact");
            }
        };
        fetchMedicalDetails();
    }, [user, supabase]);

    const handleSOS = () => {
        setSosActive(true);
        // Play alert sound if wanted, notify contacts
    };

    const handleSaveMedicalId = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Update blood group in profile
            await supabase
                .from("profiles")
                .update({ blood_group: bloodGroup })
                .eq("id", user.id);

            // Update/Insert emergency contact
            const { data: existing } = await supabase
                .from("emergency_contacts")
                .select("id")
                .eq("patient_id", user.id)
                .limit(1);

            if (existing && existing.length > 0) {
                await supabase
                    .from("emergency_contacts")
                    .update({
                        name: contactName,
                        phone: contactPhone,
                        relationship: contactRelation
                    })
                    .eq("id", existing[0].id);
            } else {
                await supabase
                    .from("emergency_contacts")
                    .insert({
                        patient_id: user.id,
                        name: contactName,
                        phone: contactPhone,
                        relationship: contactRelation
                    });
            }
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save emergency medical details", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
            {/* Emergency Header */}
            <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-red-600 to-red-500 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-display-sm text-white font-display">Emergency Response</h1>
                            <p className="text-body-md text-white/80">Activate panic SOS button, find bed availability, view Medical ID.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                        <Button
                            size="lg"
                            className="bg-white text-red-600 hover:bg-gray-100 hover:shadow-none"
                            leftIcon={<Phone className="w-5 h-5" />}
                            onClick={() => (window.location.href = "tel:112")}
                        >
                            Call Ambulance (112)
                        </Button>
                        <Button
                            size="lg"
                            className="bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:shadow-none"
                            leftIcon={<Siren className="w-5 h-5" />}
                            onClick={handleSOS}
                        >
                            {sosActive ? "SOS Transmitting..." : "Send SOS Signal"}
                        </Button>
                    </div>
                </div>
            </div>

            {sosActive && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
                                <Activity className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-body-md font-semibold text-red-700 dark:text-red-400">SOS Active — Real-time location broadcasted</p>
                                <p className="text-body-sm text-red-600/80 dark:text-red-400/80">Emergency ambulance dispatched. {contactName} ({contactRelation}) has been notified via SMS.</p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => setSosActive(false)}>
                                Cancel Alarm
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Medical ID / Patient Emergency Details Card */}
            <Card className="border border-red-100 dark:border-red-950 shadow-md">
                <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-red-50/30 dark:bg-red-950/10">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <h2 className="text-heading-sm font-semibold text-content-primary dark:text-content-dark-primary">Patient Emergency Medical ID</h2>
                    </div>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleSaveMedicalId} disabled={saving} leftIcon={saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}>
                                {saving ? "Saving" : "Save ID"}
                            </Button>
                        </div>
                    ) : (
                        <Button size="sm" variant="outline" leftIcon={<Edit2 className="w-3.5 h-3.5" />} onClick={() => setIsEditing(true)}>
                            Edit Medical ID
                        </Button>
                    )}
                </div>

                <div className="p-5">
                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Blood Group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O Positive (O+)" />
                            <Input label="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Pollen" />
                            <Input label="Chronic Conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g. Asthma, Diabetes" />
                            <Input label="Current Medications" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="e.g. Inhaler, Insulin" />
                            <Input label="Organ Donor Status" value={organDonor} onChange={(e) => setOrganDonor(e.target.value)} placeholder="Yes / No" />
                            <Input label="Medical Insurance Details" value={insurance} onChange={(e) => setInsurance(e.target.value)} placeholder="Provider & Policy Number" />
                            
                            <div className="md:col-span-2 border-t dark:border-gray-800 pt-4 mt-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-content-tertiary mb-3">Primary Emergency Contact</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Input label="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                                    <Input label="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                                    <Input label="Relationship" value={contactRelation} onChange={(e) => setContactRelation(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Left Column: Quick Profile */}
                            <div className="flex flex-col items-center justify-center p-4 border dark:border-gray-800 rounded-card bg-gray-50/50 dark:bg-gray-800/10 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-500 flex items-center justify-center text-3xl font-black mb-3">
                                    {bloodGroup.includes("+") ? "O+" : bloodGroup.split(" ")[0]}
                                </div>
                                <h3 className="font-bold text-body-lg text-content-primary dark:text-content-dark-primary">{user?.full_name || "Anoop Kumar"}</h3>
                                <p className="text-caption text-content-secondary mt-0.5">Blood Type: <span className="font-bold text-red-500">{bloodGroup}</span></p>
                                <span className="mt-3 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-[10px] font-bold uppercase rounded-full">
                                    Critical Responder Info
                                </span>
                            </div>

                            {/* Middle Column: Medical Vitals */}
                            <div className="md:col-span-2 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 border dark:border-gray-800 rounded-card flex gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Allergies</p>
                                            <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary mt-0.5">{allergies}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border dark:border-gray-800 rounded-card flex gap-2">
                                        <Activity className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Chronic Conditions</p>
                                            <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary mt-0.5">{conditions}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border dark:border-gray-800 rounded-card flex gap-2">
                                        <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Active Medications</p>
                                            <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary mt-0.5">{medications}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border dark:border-gray-800 rounded-card flex gap-2">
                                        <User className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Organ Donor</p>
                                            <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary mt-0.5">{organDonor}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 border dark:border-gray-800 rounded-card">
                                    <p className="text-[10px] uppercase font-bold text-content-tertiary">Medical Insurance Details</p>
                                    <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary mt-0.5">{insurance}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Emergency Contact Detail Summary Row */}
                    {!isEditing && (
                        <div className="mt-4 pt-4 border-t dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 rounded-card bg-gray-50 dark:bg-gray-800/10 border dark:border-gray-800">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-content-tertiary">Primary Contact ({contactRelation})</p>
                                    <p className="text-body-md font-bold text-content-primary dark:text-content-dark-primary mt-0.5">{contactName}</p>
                                    <p className="text-body-sm text-content-secondary">{contactPhone}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    leftIcon={<Phone className="w-3.5 h-3.5" />}
                                    onClick={() => (window.location.href = `tel:${contactPhone}`)}
                                >
                                    Call Wife
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-card bg-gray-50 dark:bg-gray-800/10 border dark:border-gray-800">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-content-tertiary">Primary Doctor</p>
                                    <p className="text-body-md font-bold text-content-primary dark:text-content-dark-primary mt-0.5">Dr. Anil Mehta</p>
                                    <p className="text-body-sm text-content-secondary">+91 98765 43212</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    leftIcon={<Phone className="w-3.5 h-3.5" />}
                                    onClick={() => (window.location.href = "tel:+919876543212")}
                                >
                                    Call Doctor
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Simulated Interactive Map */}
            <div className="space-y-3">
                <h2 className="text-heading-sm font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-500" /> Interactive Emergency Map
                </h2>
                <Card padding="none" className="overflow-hidden relative h-[360px] bg-[#e5e3df] dark:bg-[#1a1a1a]">
                    <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />

                    <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                        <path d="M0,50 Q200,100 400,50 T1000,150" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-400" />
                        <path d="M200,0 L200,400" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-400" />
                        <path d="M0,200 L1000,200" fill="none" stroke="currentColor" strokeWidth="12" className="text-amber-500/50" />
                    </svg>

                    <div className="absolute inset-0">
                        {/* User Location */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-ping absolute" />
                            <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10" />
                            <span className="mt-1 px-2 py-0.5 bg-white/90 dark:bg-gray-800/90 text-[10px] font-bold rounded shadow-sm z-10">You</span>
                        </div>

                        {/* Hospital Markers */}
                        {nearbyHospitals.map((hospital, index) => {
                            const positions = [
                                { top: '20%', left: '30%' },
                                { top: '70%', left: '60%' },
                                { top: '30%', left: '80%' },
                                { top: '80%', left: '20%' },
                            ];
                            const pos = positions[index % positions.length];

                            return (
                                <div key={`map-marker-${hospital.id}`} className="absolute flex flex-col items-center group cursor-pointer" style={pos}>
                                    <div className="p-2 bg-red-500 text-white rounded-full shadow-lg z-10 group-hover:scale-110 transition-transform">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div className="mt-1 px-2 py-1 bg-white dark:bg-gray-800 text-xs font-semibold rounded shadow-md border dark:border-gray-700 whitespace-nowrap z-20">
                                        {hospital.name} ({hospital.distance})
                                        <div className="text-[10px] text-content-secondary flex gap-2 mt-0.5">
                                            <span className="text-emerald-500">{hospital.icu} ICU</span>
                                            <span>{hospital.eta}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Ambulance Marker */}
                        <motion.div
                            animate={{
                                top: ['10%', '40%', '45%'],
                                left: ['10%', '30%', '45%']
                            }}
                            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                            className="absolute flex items-center gap-1 z-20"
                        >
                            <div className="p-1.5 bg-white border-2 border-primary-500 text-primary-600 rounded-lg shadow-lg">
                                <Siren className="w-5 h-5 animate-pulse" />
                            </div>
                            <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold rounded shadow-sm whitespace-nowrap">
                                Ambulance 14 • 2 min away
                            </span>
                        </motion.div>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 hover:bg-gray-50 transition-colors">
                            <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </Card>
            </div>

            {/* Nearest Hospitals */}
            <div>
                <h2 className="text-heading-md text-content-primary dark:text-content-dark-primary mb-4">
                    Nearest Hospitals with Available Beds
                </h2>
                <div className="space-y-3">
                    {nearbyHospitals.map((hospital, i) => (
                        <motion.div
                            key={hospital.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card variant="interactive" padding="md">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-body-lg font-semibold text-content-primary dark:text-content-dark-primary">
                                            {hospital.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1 text-body-sm text-content-tertiary">
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{hospital.distance}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />ETA: {hospital.eta}</span>
                                            <span>⭐ {hospital.rating}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <Badge variant={hospital.icu > 0 ? "success" : "danger"} size="sm" dot pulse={hospital.icu > 0}>
                                                ICU: {hospital.icu}
                                            </Badge>
                                            <Badge variant={hospital.general > 5 ? "success" : "warning"} size="sm" dot>
                                                General: {hospital.general}
                                            </Badge>
                                            <Badge variant={hospital.emergency > 0 ? "success" : "danger"} size="sm" dot pulse={hospital.emergency > 0}>
                                                Emergency: {hospital.emergency}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button size="sm" leftIcon={<Navigation className="w-4 h-4" />}>
                                        Navigate
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

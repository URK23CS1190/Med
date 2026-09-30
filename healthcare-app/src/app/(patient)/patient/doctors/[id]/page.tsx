"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft, Star, Clock, MapPin, Award, BookOpen,
    Video, Calendar, CheckCircle2, Info
} from "lucide-react";
import { Card, Badge, Avatar, Button } from "@/components/ui";

// Reusing demo data for the prototype
const doctorData = {
    id: "1", name: "Dr. Priya Sharma", specialty: "Cardiologist",
    experience: 15, rating: 4.8, reviews: 234, fee: 800,
    languages: ["English", "Hindi"],
    about: "Dr. Priya Sharma is a highly skilled cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management.",
    education: "MBBS, MD - General Medicine, DM - Cardiology",
    hospital: "Apollo Hospital",
    address: "14, Greams Road, Thousand Lights, Chennai",
    verified: true,
};

const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
        date: d,
        dayStr: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: d.getDate().toString(),
        fullStr: d.toISOString().split('T')[0]
    };
});

const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM"
];

export default function BookDoctorPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Booking state
    const [selectedDate, setSelectedDate] = useState<string>(next7Days[0].fullStr);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [consultationMode, setConsultationMode] = useState<"clinic" | "video">("clinic");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3); // Success step
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header / Back */}
            <div className="flex items-center gap-3">
                <Link href="/patient/doctors">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-surface-dark-elevated shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-heading-md text-content-primary dark:text-content-dark-primary">
                    {step === 1 ? "Doctor Profile" : step === 2 ? "Confirm Booking" : "Booking Confirmed"}
                </h1>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Left Column: Doctor Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card padding="lg">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <Avatar fallback={doctorData.name} size="xl" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h2 className="text-display-xs font-semibold text-content-primary dark:text-content-dark-primary">
                                                        {doctorData.name}
                                                    </h2>
                                                    {doctorData.verified && (
                                                        <Badge variant="primary" size="sm">✓ Verified</Badge>
                                                    )}
                                                </div>
                                                <p className="text-body-lg text-primary-600 dark:text-primary-400 font-medium">{doctorData.specialty}</p>
                                                <p className="text-body-sm text-content-secondary mt-1">{doctorData.education}</p>
                                            </div>

                                            <div className="text-right">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-chip bg-amber-50 dark:bg-amber-900/20">
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    <span className="text-body-md font-semibold text-amber-700 dark:text-amber-400">{doctorData.rating}</span>
                                                </div>
                                                <p className="text-caption text-content-tertiary mt-1">{doctorData.reviews} patient reviews</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                                    <Award className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-caption text-content-tertiary">Experience</p>
                                                    <p className="text-body-md font-semibold">{doctorData.experience} Years</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-caption text-content-tertiary">Languages</p>
                                                    <p className="text-body-md font-semibold">{doctorData.languages.join(", ")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card padding="lg" className="space-y-6">
                                <div>
                                    <h3 className="text-heading-sm mb-3">About Doctor</h3>
                                    <p className="text-body-md text-content-secondary leading-relaxed">
                                        {doctorData.about}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                                    <h3 className="text-heading-sm mb-4">Consultation Location</h3>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 text-content-secondary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-body-lg font-semibold text-content-primary dark:text-content-dark-primary">
                                                {doctorData.hospital}
                                            </p>
                                            <p className="text-body-md text-content-secondary mt-1 max-w-sm">
                                                {doctorData.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <div className="lg:col-span-1">
                            <Card padding="md" className="sticky top-24">
                                <h3 className="text-heading-sm mb-4">Book Appointment</h3>

                                <div className="space-y-6">
                                    {/* Mode Selection */}
                                    <div>
                                        <p className="text-body-sm font-medium text-content-secondary mb-3">Consultation Mode</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setConsultationMode("clinic")}
                                                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all ${consultationMode === "clinic"
                                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                                                    }`}
                                            >
                                                <MapPin className="w-4 h-4" /> Clinic
                                            </button>
                                            <button
                                                onClick={() => setConsultationMode("video")}
                                                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all ${consultationMode === "video"
                                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                                                    }`}
                                            >
                                                <Video className="w-4 h-4" /> Video Call
                                            </button>
                                        </div>
                                    </div>

                                    {/* Date Selection */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-body-sm font-medium text-content-secondary">Select Date</p>
                                            <span className="text-caption text-primary-500 font-medium">October 2024</span>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                                            {next7Days.map((day) => (
                                                <button
                                                    key={day.fullStr}
                                                    onClick={() => setSelectedDate(day.fullStr)}
                                                    className={`flex-shrink-0 snap-center flex flex-col items-center justify-center w-14 h-16 rounded-2xl border transition-all ${selectedDate === day.fullStr
                                                        ? "bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/25"
                                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-content-secondary hover:border-primary-300"
                                                        }`}
                                                >
                                                    <span className="text-caption uppercase font-medium opacity-80">{day.dayStr}</span>
                                                    <span className="text-body-lg font-bold">{day.dateStr}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    <div>
                                        <p className="text-body-sm font-medium text-content-secondary mb-3">Select Time</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 px-1 text-center rounded-lg border text-caption font-medium transition-colors ${selectedTime === time
                                                        ? "bg-primary-500 border-primary-500 text-white"
                                                        : "bg-gray-50 dark:bg-gray-800 border-transparent text-content-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-body-md text-content-secondary">Consultation Fee</span>
                                            <span className="text-heading-sm text-content-primary dark:text-content-dark-primary">₹{doctorData.fee}</span>
                                        </div>
                                        <Button
                                            size="lg"
                                            fullWidth
                                            disabled={!selectedDate || !selectedTime}
                                            onClick={() => setStep(2)}
                                        >
                                            Proceed to Book
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Confirmation / Payment Summary */}
                {step === 2 && (
                    <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl mx-auto"
                    >
                        <Card padding="lg">
                            <h2 className="text-heading-md mb-6 border-b pb-4 dark:border-gray-800">Review Booking</h2>

                            <div className="flex gap-4 mb-6">
                                <Avatar fallback={doctorData.name} size="lg" />
                                <div>
                                    <h3 className="text-body-lg font-semibold">{doctorData.name}</h3>
                                    <p className="text-body-sm text-content-secondary">{doctorData.specialty}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-content-secondary">
                                        <Calendar className="w-4 h-4" /> Date
                                    </div>
                                    <span className="font-medium text-content-primary dark:text-content-dark-primary">
                                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-content-secondary">
                                        <Clock className="w-4 h-4" /> Time
                                    </div>
                                    <span className="font-medium text-content-primary dark:text-content-dark-primary">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-content-secondary">
                                        {consultationMode === "video" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />} Mode
                                    </div>
                                    <span className="font-medium capitalize text-content-primary dark:text-content-dark-primary">{consultationMode} Consulation</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl mb-6 text-blue-800 dark:text-blue-300">
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-body-sm">
                                    You will receive a confirmation message along with the {consultationMode === "video" ? "video call link" : "clinic directions"} shortly after confirming.
                                </p>
                            </div>

                            <div className="border-t dark:border-gray-800 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-content-secondary">Consultation Fee</span>
                                    <span>₹{doctorData.fee}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-content-secondary">Convenience Fee</span>
                                    <span>₹50</span>
                                </div>
                                <div className="flex justify-between items-center text-heading-sm">
                                    <span>Total Payable</span>
                                    <span className="text-primary-600 dark:text-primary-400">₹{doctorData.fee + 50}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button
                                    className="flex-1"
                                    size="lg"
                                    isLoading={isSubmitting}
                                    onClick={handleConfirm}
                                >
                                    Confirm & Pay
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Step 3: Success Mode */}
                {step === 3 && (
                    <motion.div
                        key="step-3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center pt-8"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-display-xs mb-3 text-content-primary dark:text-content-dark-primary">
                            Appointment Confirmed!
                        </h2>
                        <p className="text-body-lg text-content-secondary mb-8">
                            Your {consultationMode} consultation with <span className="font-medium text-content-primary dark:text-content-dark-primary">{doctorData.name}</span> is scheduled for <span className="font-medium text-content-primary dark:text-content-dark-primary">{selectedTime}</span>.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button size="lg" onClick={() => router.push("/patient/appointments")}>
                                View My Appointments
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => router.push("/patient/dashboard")}>
                                Return to Dashboard
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

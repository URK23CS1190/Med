"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
    Baby, Star, Shield, HeartPulse, Sparkles, Smile, ArrowRight, 
    MoreVertical, Info, Trash2, MessageSquare, Star as StarIcon, Calendar, Clock,
    User, Video, MapPin, CheckCircle2
} from "lucide-react";
import { Card, Button, Avatar, Chip, Badge, Modal, Input } from "@/components/ui";

type Pediatrician = {
    id: string;
    name: string;
    spec: string;
    exp: string;
    img: string | null;
    rating: number;
    cost: number;
};

const pediatricians: Pediatrician[] = [
    { id: "PED-101", name: "Dr. Anjali Desai", spec: "Pediatric Cardiologist", exp: "12 yrs", img: null, rating: 4.9, cost: 800 },
    { id: "PED-102", name: "Dr. Rohan Kapoor", spec: "General Pediatrics", exp: "8 yrs", img: null, rating: 4.8, cost: 600 },
    { id: "PED-103", name: "Dr. Niti Gupta", spec: "Child Psychologist", exp: "15 yrs", img: null, rating: 5.0, cost: 700 },
];

type ChildConsultation = {
    id: string;
    doctor: Pediatrician;
    date: string;
    time: string;
    duration: string; // from when to when it was attended
    status: "completed" | "cancelled" | "upcoming";
};

const initialConsultations: ChildConsultation[] = [
    {
        id: "PED-CON-901",
        doctor: pediatricians[0],
        date: "2024-10-22",
        time: "11:00 AM",
        duration: "11:00 AM - 11:30 AM",
        status: "completed"
    },
    {
        id: "PED-CON-902",
        doctor: pediatricians[1],
        date: "2024-10-15",
        time: "02:00 PM",
        duration: "02:00 PM - 02:25 PM",
        status: "completed"
    }
];

export default function ChildrenCarePage() {
    const [consultations, setConsultations] = useState<ChildConsultation[]>(initialConsultations);
    
    // Active dropdown ID
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Modals state
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedConsult, setSelectedConsult] = useState<ChildConsultation | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Pediatrician | null>(null);

    // Feedback states
    const [feedbackComments, setFeedbackComments] = useState("");
    const [starRating, setStarRating] = useState(5);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    // Booking states
    const [childName, setChildName] = useState("");
    const [childAge, setChildAge] = useState("");
    const [childGender, setChildGender] = useState("Boy");
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("09:00 AM");
    const [problem, setProblem] = useState("");
    const [bookingType, setBookingType] = useState<"video" | "clinic">("video");
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Handle delete/remove
    const handleDeleteConsult = (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this pediatric consultation record?");
        if (!confirmDelete) return;
        setConsultations(prev => prev.filter(c => c.id !== id));
    };

    // Handle feedback submission
    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackSuccess(true);
        setTimeout(() => {
            setFeedbackSuccess(false);
            setIsFeedbackOpen(false);
            setFeedbackComments("");
            setStarRating(5);
        }, 1500);
    };

    // Handle booking visit submit
    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctor || !childName || !bookingDate) return;

        // Calculate helper end time
        const hour = parseInt(bookingTime.split(":")[0]);
        const mins = bookingTime.split(" ")[0].split(":")[1];
        const ampm = bookingTime.split(" ")[1];
        const endHour = hour === 12 ? 1 : hour + 1;
        const endTime = `${endHour}:${mins} ${ampm}`;

        const newConsultation: ChildConsultation = {
            id: `PED-CON-${Math.floor(100 + Math.random() * 900)}`,
            doctor: selectedDoctor,
            date: bookingDate,
            time: bookingTime,
            duration: `${bookingTime} - ${endTime}`,
            status: "upcoming"
        };

        setBookingSuccess(true);
        setTimeout(() => {
            setConsultations(prev => [newConsultation, ...prev]);
            setBookingSuccess(false);
            setIsBookingOpen(false);
            // Clear inputs
            setChildName("");
            setChildAge("");
            setProblem("");
            setBookingDate("");
        }, 1500);
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto p-4 md:p-6 font-sans">
            {/* Playful Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-12 shadow-2xl">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 text-yellow-300 opacity-50"
                    >
                        <Star className="w-16 h-16 fill-yellow-300" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 30, 0], rotate: [0, -15, 15, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-10 left-20 text-white opacity-30"
                    >
                        <Sparkles className="w-20 h-20" />
                    </motion.div>
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold shadow-sm"
                        >
                            <Baby className="w-5 h-5 text-yellow-300" />
                            Kids Care Special
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Happy Kids, <br /> Healthy Smiles!
                        </h1>
                        <p className="text-lg text-white/90 max-w-md mx-auto md:mx-0 font-medium">
                            Expert pediatric care in a friendly, gentle environment because your little ones deserve the best.
                        </p>
                        <div className="pt-2">
                            <Button 
                                size="lg" 
                                className="bg-white text-purple-600 hover:bg-gray-100 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                                onClick={() => {
                                    setSelectedDoctor(pediatricians[0]);
                                    setIsBookingOpen(true);
                                }}
                            >
                                Book Pediatrician
                            </Button>
                        </div>
                    </div>

                    {/* Hero Illustration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-48 h-48 md:w-64 md:h-64 relative"
                    >
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl" />
                        <div className="relative w-full h-full bg-gradient-to-tr from-yellow-300 to-amber-500 rounded-full shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Smile className="w-32 h-32 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Services Carousel */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading-md font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 text-pink-500" /> Our Services
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Vaccinations", icon: <Shield className="w-8 h-8 text-emerald-500" />, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100" },
                        { label: "Fever & Colds", icon: <ThermometerIcon />, color: "bg-red-100 dark:bg-red-950/40 text-red-900 dark:text-red-100" },
                        { label: "Nutrition", icon: <AppleIcon />, color: "bg-orange-100 dark:bg-orange-950/40 text-orange-900 dark:text-orange-100" },
                        { label: "Development", icon: <GrowthIcon />, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100" },
                    ].map((svc) => (
                        <motion.div key={svc.label} whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring" }}>
                            <Card className={`text-center p-6 border-none rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer ${svc.color}`}>
                                <div className="w-16 h-16 mx-auto mb-3 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                                    {svc.icon}
                                </div>
                                <h3 className="font-bold text-sm md:text-base">{svc.label}</h3>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Top Pediatricians */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading-md font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Top Pediatricians
                    </h2>
                    <Button variant="ghost" className="text-purple-600 font-semibold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        View All
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {pediatricians.map((doc) => (
                        <Card key={doc.name} className="overflow-hidden border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-900 transition-all rounded-[1.5rem] group shadow-sm hover:shadow-lg">
                            <div className="p-5 flex gap-4">
                                <Avatar fallback={doc.name} size="xl" className="border-4 border-purple-100 dark:border-purple-900/50" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors">{doc.name}</h3>
                                    <p className="text-sm font-medium text-pink-500">{doc.spec}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Chip size="sm" variant="default" label={`${doc.exp} Exp`} />
                                        <div className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md flex items-center gap-1">
                                            <StarIcon className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {doc.rating}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t flex gap-2 border-gray-100 dark:border-gray-800">
                                <Button 
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-xl" 
                                    size="sm"
                                    onClick={() => {
                                        setSelectedDoctor(doc);
                                        setIsBookingOpen(true);
                                    }}
                                >
                                    Book Visit
                                </Button>
                                <Link href={`/patient/appointments/call/${doc.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50" size="sm">Video</Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Pediatric Consultations History */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading-md font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Smile className="w-6 h-6 text-indigo-500" /> Recent Child Consultations
                    </h2>
                </div>

                <div className="space-y-4">
                    {consultations.map((consult, i) => (
                        <motion.div
                            key={consult.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card padding="none" className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-[1.5rem] shadow-sm">
                                <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Doctor Info */}
                                    <div className="flex items-center gap-4 min-w-[240px]">
                                        <Avatar fallback={consult.doctor.name} size="lg" className="border-2 border-purple-100" />
                                        <div>
                                            <h3 className="text-body-lg font-bold text-content-primary dark:text-content-dark-primary">{consult.doctor.name}</h3>
                                            <p className="text-body-sm text-content-secondary">{consult.doctor.spec}</p>
                                            <Badge variant="inactive" size="sm" className="mt-1">{consult.id}</Badge>
                                        </div>
                                    </div>

                                    {/* Consultation Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-caption text-content-tertiary uppercase font-bold tracking-wider">Date</p>
                                                <p className="text-body-sm font-semibold">{new Date(consult.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-caption text-content-tertiary uppercase font-bold tracking-wider">Timing Slot</p>
                                                <p className="text-body-sm font-semibold">{consult.time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:block h-12 w-[1px] bg-gray-100 dark:bg-gray-800" />

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 md:pl-4">
                                        {consult.status === "completed" ? (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                leftIcon={<MessageSquare className="w-4 h-4" />}
                                                onClick={() => {
                                                    setSelectedConsult(consult);
                                                    setIsFeedbackOpen(true);
                                                }}
                                                className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50"
                                            >
                                                Feedback
                                            </Button>
                                        ) : (
                                            <Badge variant="info">Upcoming</Badge>
                                        )}

                                        {/* Action Dropdown Menu */}
                                        <div className="relative">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => setActiveMenuId(activeMenuId === consult.id ? null : consult.id)}
                                            >
                                                <MoreVertical className="w-5 h-5 text-content-tertiary" />
                                            </Button>

                                            {activeMenuId === consult.id && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-40 bg-transparent"
                                                        onClick={() => setActiveMenuId(null)}
                                                    />
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark-elevated border border-gray-100 dark:border-gray-800 rounded-card shadow-elevated z-50 py-1 overflow-hidden">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedConsult(consult);
                                                                setIsInfoOpen(true);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-body-sm text-content-primary dark:text-content-dark-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                                                        >
                                                            <Info className="w-4 h-4 text-purple-500" /> View Consultation Info
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDeleteConsult(consult.id);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-body-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2 border-t border-gray-50 dark:border-gray-800"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Delete Record
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 1. Pediatric Consultation Info Dialog */}
            <Modal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title="Child Consultation Info"
                size="md"
            >
                {selectedConsult && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-card bg-gray-50 dark:bg-surface-dark-card border border-gray-100 dark:border-gray-800">
                            <Avatar fallback={selectedConsult.doctor.name} size="md" className="border border-purple-200" />
                            <div>
                                <h4 className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedConsult.doctor.name}</h4>
                                <p className="text-xs text-content-secondary">{selectedConsult.doctor.spec}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Reference ID</span>
                                <span className="font-medium text-content-primary dark:text-content-dark-primary">{selectedConsult.id}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Attended Timing</span>
                                <span className="font-medium text-content-primary dark:text-content-dark-primary">{selectedConsult.duration}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Consulting Cost</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">₹{selectedConsult.doctor.cost}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-content-secondary">Status</span>
                                <Badge variant={selectedConsult.status === "completed" ? "success" : selectedConsult.status === "upcoming" ? "info" : "danger"}>
                                    {selectedConsult.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3">
                            <Button onClick={() => setIsInfoOpen(false)}>Close Details</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 2. Pediatrician Feedback Form Dialog */}
            <Modal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                title="Consultation Feedback Form"
                size="md"
            >
                {selectedConsult && (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        {/* Side Titles / Consultation Metadata */}
                        <div className="p-4 rounded-card bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/30 text-xs space-y-2">
                            <h4 className="font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Consultation Reference</h4>
                            <div className="grid grid-cols-2 gap-2 text-content-secondary">
                                <div>
                                    <span className="block font-medium text-content-tertiary">Practitioner Name:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedConsult.doctor.name}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-content-tertiary">Specialty:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedConsult.doctor.spec}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-content-tertiary">Appointment ID:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedConsult.id}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-content-tertiary">Date & Time:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedConsult.date} ({selectedConsult.time})</span>
                                </div>
                            </div>
                        </div>

                        {feedbackSuccess ? (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-6 text-center space-y-2"
                            >
                                <span className="text-4xl">👶</span>
                                <h4 className="font-bold text-body-lg text-content-primary dark:text-content-dark-primary font-display">Feedback Submitted!</h4>
                                <p className="text-sm text-content-secondary">Thank you for rating our pediatrician. Your feedback helps us provide a better care environment.</p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Star Rating Selection */}
                                <div>
                                    <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1.5">
                                        Overall Child Care Experience Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setStarRating(star)}
                                                className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                            >
                                                <StarIcon 
                                                    className={`w-7 h-7 ${
                                                        star <= starRating 
                                                            ? "fill-yellow-400 text-yellow-400" 
                                                            : "text-gray-300 dark:text-gray-700"
                                                    }`} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comments Text Area / "Type Space" */}
                                <div>
                                    <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                        Describe your child&apos;s experience / Comments
                                    </label>
                                    <textarea
                                        required
                                        value={feedbackComments}
                                        onChange={(e) => setFeedbackComments(e.target.value)}
                                        rows={4}
                                        placeholder="Type your feedback details here. How friendly was the practitioner? Did the consultation make your child feel comfortable?"
                                        className="w-full px-3.5 py-2.5 rounded-card border border-gray-200 dark:border-gray-700
                                                   bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                                   focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm placeholder-gray-400"
                                    />
                                </div>

                                <div className="flex gap-2 justify-end pt-3">
                                    <Button variant="ghost" onClick={() => setIsFeedbackOpen(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={!feedbackComments.trim()} className="bg-purple-600 hover:bg-purple-700">
                                        Submit Feedback
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                )}
            </Modal>

            {/* 3. Book Visit Form Modal */}
            <Modal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                title="Book Pediatric Consultation"
                size="md"
            >
                {selectedDoctor && (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                        {/* Selected Practitioner detail card */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/30">
                            <Avatar fallback={selectedDoctor.name} size="md" className="border border-purple-200" />
                            <div>
                                <h4 className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedDoctor.name}</h4>
                                <p className="text-xs text-content-secondary">{selectedDoctor.spec}</p>
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Consultation Fee: ₹{selectedDoctor.cost}</span>
                            </div>
                        </div>

                        {bookingSuccess ? (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-6 text-center space-y-2"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-body-lg text-content-primary dark:text-content-dark-primary font-display">Pediatric Slot Reserved!</h4>
                                <p className="text-xs text-content-secondary">Your pediatric consultation session has been booked successfully. It will now appear under your history logs.</p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Child Details */}
                                <div className="bg-gray-50/50 dark:bg-gray-800/10 p-3.5 rounded-xl border dark:border-gray-800 space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-content-tertiary flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" /> Child Details
                                    </h4>
                                    
                                    <div>
                                        <label className="block text-[11px] font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                            Child&apos;s Full Name *
                                        </label>
                                        <Input 
                                            required
                                            placeholder="e.g. Baby Sharma" 
                                            value={childName}
                                            onChange={(e) => setChildName(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                                Age (Years) *
                                            </label>
                                            <Input 
                                                required
                                                type="number"
                                                placeholder="e.g. 5" 
                                                value={childAge}
                                                onChange={(e) => setChildAge(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                                Gender *
                                            </label>
                                            <div className="flex gap-2 h-11">
                                                {["Boy", "Girl"].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => setChildGender(g)}
                                                        className={`flex-1 rounded-input border font-semibold text-xs transition-colors ${
                                                            childGender === g
                                                                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-600"
                                                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-card text-content-secondary"
                                                        }`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment details */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                                Select Date *
                                            </label>
                                            <input 
                                                type="date"
                                                required
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                className="w-full h-11 px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                                           bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                                           focus:outline-none focus:ring-2 focus:ring-purple-500/25 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                                Available Time Slot *
                                            </label>
                                            <select
                                                value={bookingTime}
                                                onChange={(e) => setBookingTime(e.target.value)}
                                                className="w-full h-11 px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                                           bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                                           focus:outline-none focus:ring-2 focus:ring-purple-500/25 text-sm"
                                            >
                                                <option value="09:00 AM">09:00 AM (Available)</option>
                                                <option value="11:30 AM">11:30 AM (Available)</option>
                                                <option value="02:00 PM">02:00 PM (Available)</option>
                                                <option value="04:30 PM">04:30 PM (Available)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                                Consultation Mode *
                                            </label>
                                            <div className="flex gap-3 h-11">
                                                <button
                                                    type="button"
                                                    onClick={() => setBookingType("video")}
                                                    className={`flex-1 rounded-input border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                                                        bookingType === "video"
                                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-600"
                                                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-card text-content-secondary"
                                                    }`}
                                                >
                                                    <Video className="w-4 h-4" /> Video Call
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setBookingType("clinic")}
                                                    className={`flex-1 rounded-input border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                                                        bookingType === "clinic"
                                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-600"
                                                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-card text-content-secondary"
                                                    }`}
                                                >
                                                    <MapPin className="w-4 h-4" /> Clinic Visit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                                            Problem / Symptoms description *
                                        </label>
                                        <textarea
                                            required
                                            value={problem}
                                            onChange={(e) => setProblem(e.target.value)}
                                            rows={3}
                                            placeholder="e.g. Continuous coughing, temperature checking around 101F since last night..."
                                            className="w-full px-3.5 py-2.5 rounded-card border border-gray-200 dark:border-gray-700
                                                       bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                                       focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-end pt-3 border-t dark:border-gray-800">
                                    <Button variant="ghost" onClick={() => setIsBookingOpen(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                                        Confirm Booking Slot
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                )}
            </Modal>
        </div>
    );
}

// Custom simple icons for services
function ThermometerIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
        </svg>
    )
}
function AppleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            <path d="M10 2c1 .5 2 2 2 5" />
        </svg>
    )
}
function GrowthIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}

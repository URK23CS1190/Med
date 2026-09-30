"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
    Calendar, Clock, Video, MapPin, 
    MoreVertical, MessageSquare, 
    XCircle, CalendarClock, Search, Trash2, Info, Star
} from "lucide-react";
import { Card, Button, Badge, Avatar, Input, Chip, StatusBadge, Modal } from "@/components/ui";

type Appointment = {
    id: string;
    doctor: {
        name: string;
        specialty: string;
        avatar: string | null;
        cost: number;
    };
    date: string;
    time: string;
    duration: string; // from when to when
    type: "video" | "clinic";
    status: "upcoming" | "completed" | "cancelled";
    hospital?: string;
};

const initialAppointments: Appointment[] = [
    {
        id: "APT-1001",
        doctor: { name: "Dr. Priya Sharma", specialty: "Cardiologist", avatar: null, cost: 800 },
        date: "2024-10-24",
        time: "10:00 AM",
        duration: "10:00 AM - 10:30 AM",
        type: "video",
        status: "upcoming"
    },
    {
        id: "APT-1002",
        doctor: { name: "Dr. Rajesh Kumar", specialty: "Pediatrician", avatar: null, cost: 600 },
        date: "2024-10-20",
        time: "03:30 PM",
        duration: "03:30 PM - 04:00 PM",
        type: "clinic",
        status: "completed",
        hospital: "Apollo Hospital, Chennai"
    },
    {
        id: "APT-1003",
        doctor: { name: "Dr. Sneha Reddy", specialty: "Dermatologist", avatar: null, cost: 700 },
        date: "2024-10-18",
        time: "11:00 AM",
        duration: "11:00 AM - 11:20 AM",
        type: "video",
        status: "cancelled"
    }
];

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Active dropdown ID
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Modal state
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

    // Feedback form state
    const [feedbackComments, setFeedbackComments] = useState("");
    const [starRating, setStarRating] = useState(5);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    // Delete appointment
    const handleDeleteApt = (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete/cancel this appointment record?");
        if (!confirmDelete) return;
        setAppointments(prev => prev.filter(a => a.id !== id));
    };

    // Submit feedback
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

    // Filter appointments
    const filtered = appointments.filter(a => {
        const matchesFilter = filter === "all" || a.status === filter;
        const matchesSearch = searchQuery === "" || 
            a.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary font-display">My Consultations</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Manage appointments, launch live calls, configure feedback, and check bills.</p>
                </div>
                <Button leftIcon={<CalendarClock className="w-4 h-4" />}>Book Consultation</Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <Input 
                        placeholder="Search doctor, specialty or appointment ID..." 
                        className="pl-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {(["all", "upcoming", "completed", "cancelled"] as const).map(f => (
                        <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} selected={filter === f} onClick={() => setFilter(f)} />
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filtered.map((apt, i) => (
                    <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card variant="default" padding="none" className="overflow-hidden group border border-gray-100 dark:border-gray-800">
                            <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                                {/* Doctor Info */}
                                <div className="flex items-center gap-4 min-w-[240px]">
                                    <Avatar fallback={apt.doctor.name} size="lg" />
                                    <div>
                                        <h3 className="text-body-lg font-bold text-content-primary dark:text-content-dark-primary">{apt.doctor.name}</h3>
                                        <p className="text-body-sm text-content-secondary">{apt.doctor.specialty}</p>
                                        <Badge variant="inactive" size="sm" className="mt-1">{apt.id}</Badge>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-caption text-content-tertiary uppercase font-bold tracking-wider">Date</p>
                                            <p className="text-body-sm font-semibold">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-caption text-content-tertiary uppercase font-bold tracking-wider">Time Slot</p>
                                            <p className="text-body-sm font-semibold">{apt.time}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block h-12 w-[1px] bg-gray-100 dark:bg-gray-800" />

                                {/* Mode & Status */}
                                <div className="space-y-3 min-w-[140px]">
                                    <div className="flex items-center gap-2">
                                        {apt.type === "video" ? (
                                            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-body-sm">
                                                <Video className="w-4 h-4" /> Video Consult
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-body-sm">
                                                <MapPin className="w-4 h-4" /> Clinic Visit
                                            </div>
                                        )}
                                    </div>
                                    <StatusBadge status={apt.status === "upcoming" ? "active" : apt.status === "completed" ? "verified" : "rejected"} label={apt.status} />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 md:pl-4">
                                    {apt.status === "upcoming" ? (
                                        <>
                                            {apt.type === "video" && (
                                                <Link href={`/patient/appointments/call/${apt.id}`}>
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">Join Call</Button>
                                                </Link>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-content-tertiary hover:text-red-500"
                                                onClick={() => handleDeleteApt(apt.id)}
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </Button>
                                        </>
                                    ) : apt.status === "completed" ? (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            leftIcon={<MessageSquare className="w-4 h-4" />}
                                            onClick={() => {
                                                setSelectedApt(apt);
                                                setIsFeedbackOpen(true);
                                            }}
                                        >
                                            Feedback
                                        </Button>
                                    ) : (
                                        <span className="text-caption text-content-tertiary italic">Cancelled</span>
                                    )}

                                    {/* Sleek Action Menu (Three dots dropdown) */}
                                    <div className="relative">
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => setActiveMenuId(activeMenuId === apt.id ? null : apt.id)}
                                        >
                                            <MoreVertical className="w-5 h-5 text-content-tertiary" />
                                        </Button>

                                        {activeMenuId === apt.id && (
                                            <>
                                                {/* Overlay backdrop */}
                                                <div 
                                                    className="fixed inset-0 z-40 bg-transparent"
                                                    onClick={() => setActiveMenuId(null)}
                                                />
                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark-elevated border border-gray-100 dark:border-gray-800 rounded-card shadow-elevated z-50 py-1 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedApt(apt);
                                                            setIsInfoOpen(true);
                                                            setActiveMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-body-sm text-content-primary dark:text-content-dark-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                                                    >
                                                        <Info className="w-4 h-4 text-primary-500" /> View Call Info
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteApt(apt.id);
                                                            setActiveMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-body-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2 border-t border-gray-50 dark:border-gray-800"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete Appointment
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hospital details */}
                            {apt.hospital && apt.type === "clinic" && (
                                <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <p className="text-[10px] text-content-tertiary flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {apt.hospital}
                                    </p>
                                    <button className="text-[10px] font-bold text-primary-600 uppercase hover:underline">Get Directions</button>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/20 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <CalendarClock className="w-12 h-12 text-content-tertiary mx-auto mb-4" />
                    <h3 className="text-body-lg font-bold">No consultations found</h3>
                    <p className="text-body-sm text-content-tertiary mt-1">Book your slots with leading physicians online.</p>
                    <Button variant="outline" className="mt-6">Explore Specialists</Button>
                </div>
            )}

            {/* 1. View Call Info Dialog */}
            <Modal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title="Consultation Details"
                size="md"
            >
                {selectedApt && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-card bg-gray-50 dark:bg-surface-dark-card border border-gray-100 dark:border-gray-800">
                            <Avatar fallback={selectedApt.doctor.name} size="md" />
                            <div>
                                <h4 className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedApt.doctor.name}</h4>
                                <p className="text-xs text-content-secondary">{selectedApt.doctor.specialty}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Appointment ID</span>
                                <span className="font-medium text-content-primary dark:text-content-dark-primary">{selectedApt.id}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Attended Timing</span>
                                <span className="font-medium text-content-primary dark:text-content-dark-primary">{selectedApt.duration}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Consulting Cost</span>
                                <span className="font-semibold text-primary-600 dark:text-primary-400">₹{selectedApt.doctor.cost}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-content-secondary">Consultation Mode</span>
                                <span className="font-medium capitalize text-content-primary dark:text-content-dark-primary">{selectedApt.type} Consult</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-content-secondary">Status</span>
                                <Badge variant={selectedApt.status === "completed" ? "success" : selectedApt.status === "upcoming" ? "info" : "danger"}>
                                    {selectedApt.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3">
                            <Button onClick={() => setIsInfoOpen(false)}>Close Details</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 2. Feedback Form Dialog */}
            <Modal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                title="Submit Consultation Feedback"
                size="md"
            >
                {selectedApt && (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        {/* Side Titles / Consultation Metadata */}
                        <div className="p-4 rounded-card bg-primary-50/50 dark:bg-primary-950/10 border border-primary-100/50 dark:border-primary-900/30 text-xs space-y-2">
                            <h4 className="font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wide">Consultation Reference</h4>
                            <div className="grid grid-cols-2 gap-2 text-content-secondary">
                                <div>
                                    <span className="block font-medium text-content-tertiary">Doctor Name:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedApt.doctor.name}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-content-tertiary">Specialty:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedApt.doctor.specialty}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-content-tertiary">Appointment ID:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedApt.id}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-content-tertiary">Date & Time:</span>
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary">{selectedApt.date} ({selectedApt.time})</span>
                                </div>
                            </div>
                        </div>

                        {feedbackSuccess ? (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-6 text-center space-y-2"
                            >
                                <span className="text-4xl">🎉</span>
                                <h4 className="font-bold text-body-lg text-content-primary dark:text-content-dark-primary">Thank you!</h4>
                                <p className="text-sm text-content-secondary">Your feedback has been saved and shared with our clinic coordinators.</p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Rating Star Selector */}
                                <div>
                                    <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1.5">
                                        Overall Consultation Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setStarRating(star)}
                                                className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                            >
                                                <Star 
                                                    className={`w-7 h-7 ${
                                                        star <= starRating 
                                                            ? "fill-amber-400 text-amber-400" 
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
                                        Describe your experience / Comments
                                    </label>
                                    <textarea
                                        required
                                        value={feedbackComments}
                                        onChange={(e) => setFeedbackComments(e.target.value)}
                                        rows={4}
                                        placeholder="Type your feedback details here. How was the doctor's communication? Did the consultation address all your concerns?"
                                        className="w-full px-3.5 py-2.5 rounded-card border border-gray-200 dark:border-gray-700
                                                   bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm placeholder-gray-400"
                                    />
                                </div>

                                <div className="flex gap-2 justify-end pt-3">
                                    <Button variant="ghost" onClick={() => setIsFeedbackOpen(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={!feedbackComments.trim()}>
                                        Submit Feedback
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

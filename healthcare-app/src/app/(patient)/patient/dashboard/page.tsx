"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Stethoscope, Pill, Building2, Calendar, FileText,
    Heart, Baby, Video,
    Clock, ChevronRight, ArrowRight, Sparkles
} from "lucide-react";
import { Card, CardTitle, Badge, Avatar, Button } from "@/components/ui";
import { useAuthStore } from "@/stores";

// Demo data
const quickActions = [
    { icon: <Stethoscope className="w-6 h-6" />, label: "Find Doctor", href: "/patient/doctors", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600" },
    { icon: <Calendar className="w-6 h-6" />, label: "Book Appointment", href: "/patient/doctors", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600" },
    { icon: <Video className="w-6 h-6" />, label: "Video Consult", href: "/patient/doctors", color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" },
    { icon: <Pill className="w-6 h-6" />, label: "Order Medicine", href: "/patient/pharmacy", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" },
    { icon: <Building2 className="w-6 h-6" />, label: "Find Beds", href: "/patient/emergency", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600" },
    { icon: <FileText className="w-6 h-6" />, label: "Health Records", href: "/patient/records", color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600" },
    { icon: <Baby className="w-6 h-6" />, label: "Child Care", href: "/patient/children", color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600" },
    { icon: <Sparkles className="w-6 h-6" />, label: "AI Symptom Check", href: "/patient/symptom-checker", color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600" },
];

const upcomingAppointments = [
    {
        id: "1",
        doctor: "Dr. Priya Sharma",
        specialty: "Cardiologist",
        time: "Today, 3:00 PM",
        mode: "video" as const,
        avatar: null,
        status: "upcoming",
    },
    {
        id: "2",
        doctor: "Dr. Rajesh Kumar",
        specialty: "General Physician",
        time: "Tomorrow, 10:30 AM",
        mode: "clinic" as const,
        avatar: null,
        status: "scheduled",
    },
];

const specialties = [
    { name: "General Medicine", icon: "🩺", count: 120 },
    { name: "Cardiology", icon: "❤️", count: 45 },
    { name: "Pediatrics", icon: "👶", count: 38 },
    { name: "Dermatology", icon: "🧴", count: 56 },
    { name: "Orthopedics", icon: "🦴", count: 32 },
    { name: "ENT", icon: "👂", count: 28 },
    { name: "Gynecology", icon: "🩷", count: 42 },
    { name: "Neurology", icon: "🧠", count: 22 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

export default function PatientDashboard() {
    const user = useAuthStore((s) => s.user);

    return (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
    >
        {/* Hero / Greeting */}
        <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden rounded-card bg-gradient-hero p-6 md:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl -ml-24 -mb-24" />
                <div className="relative z-10">
                    <p className="text-white/70 text-body-md mb-1">Good evening,</p>
                    <h1 className="text-display-sm text-white mb-2 font-display">
                        Welcome back, {user?.full_name || "Patient"}! 👋
                    </h1>
                    <p className="text-body-md text-white/80 max-w-md">
                        You have 2 upcoming appointments. Your health score is looking great!
                    </p>
                    <div className="flex items-center gap-4 mt-6">
                        <Link href="/patient/doctors">
                            <Button
                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:shadow-none"
                                size="md"
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Book Appointment
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-chip bg-white/15 backdrop-blur-sm">
                            <Heart className="w-4 h-4 text-white" />
                            <span className="text-body-sm text-white font-semibold">Score: 85/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-md text-content-primary dark:text-content-dark-primary">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 p-3 rounded-card bg-white dark:bg-surface-dark-card shadow-card hover:shadow-card-hover transition-all duration-200"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center`}>
                                {action.icon}
                            </div>
                            <span className="text-[11px] font-medium text-content-secondary dark:text-content-dark-secondary text-center leading-tight">
                                {action.label}
                            </span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card padding="none">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <Link href="/patient/appointments" className="text-body-sm text-primary-500 font-medium flex items-center gap-1 hover:text-primary-600">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <Avatar fallback={apt.doctor} size="lg" status="online" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary">
                                        {apt.doctor}
                                    </p>
                                    <p className="text-body-sm text-content-secondary">{apt.specialty}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3.5 h-3.5 text-content-tertiary" />
                                        <span className="text-body-sm text-content-tertiary">{apt.time}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant={apt.mode === "video" ? "info" : "primary"} size="sm">
                                        {apt.mode === "video" ? "📹 Video" : "🏥 Clinic"}
                                    </Badge>
                                    {apt.mode === "video" && (
                                        <Link href={`/patient/appointments/call/${apt.id}`}>
                                            <Button size="sm" variant="primary">
                                                Join Call
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Health Score Summary */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardTitle>Health Score</CardTitle>
                    <div className="flex flex-col items-center mt-4">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-100 dark:text-gray-800"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                />
                                <motion.circle
                                    className="text-primary-500"
                                    strokeWidth="8"
                                    strokeDasharray={`${100 * 2.64}`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                    initial={{ strokeDashoffset: 100 * 2.64 }}
                                    animate={{ strokeDashoffset: (100 - 85) * 2.64 }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-display-sm font-display gradient-text">85</span>
                                <span className="text-caption text-content-tertiary">out of 100</span>
                            </div>
                        </div>
                        <div className="w-full mt-4 space-y-2">
                            {[
                                { label: "Checkups", score: 90, color: "bg-status-success" },
                                { label: "Vaccinations", score: 75, color: "bg-primary-500" },
                                { label: "BMI", score: 85, color: "bg-secondary-500" },
                                { label: "Activity", score: 60, color: "bg-status-warning" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <span className="text-body-sm text-content-secondary w-24">{item.label}</span>
                                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={`h-full rounded-full ${item.color}`}
                                        />
                                    </div>
                                    <span className="text-caption font-medium text-content-secondary w-8 text-right">{item.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>

        {/* Specialties Grid */}
        <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-md text-content-primary dark:text-content-dark-primary">Browse by Specialty</h2>
                <Link href="/patient/doctors" className="text-body-sm text-primary-500 font-medium flex items-center gap-1">
                    See All <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specialties.map((spec) => (
                    <Link key={spec.name} href={`/patient/doctors?specialty=${spec.name}`}>
                        <motion.div
                            whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                            className="card-base p-4 flex items-center gap-3 cursor-pointer"
                        >
                            <span className="text-2xl">{spec.icon}</span>
                            <div>
                                <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary">{spec.name}</p>
                                <p className="text-caption text-content-tertiary">{spec.count} doctors</p>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    </motion.div>
);
}

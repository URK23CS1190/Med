"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Calendar, Clock, Video, Activity,
    ChevronLeft, ChevronRight, Filter, Plus, AlertTriangle, Check, X, MessageSquare
} from "lucide-react";
import { Card, Button, Badge, Avatar, StatusBadge } from "@/components/ui";

type ViewMode = "day" | "week" | "list";

const appointments = [
    { id: "1", patient: "Riya Sharma", age: "28F", time: "09:00 AM", endTime: "09:30 AM", mode: "clinic", type: "follow_up", reason: "Cardiology Follow-up", status: "confirmed", hasHistory: true, meds: "Metoprolol 25mg", phone: "+91 98XXX XXXXX" },
    { id: "2", patient: "Mohan Rao", age: "55M", time: "09:30 AM", endTime: "10:00 AM", mode: "clinic", type: "new", reason: "Chest Pain — New Patient", status: "confirmed", hasHistory: false, meds: "None", phone: "+91 97XXX XXXXX" },
    { id: "3", patient: "Anita Desai", age: "34F", time: "10:00 AM", endTime: "10:20 AM", mode: "video", type: "teleconsult", reason: "Palpitations Review", status: "in_progress", hasHistory: true, meds: "None", phone: "+91 87XXX XXXXX" },
    { id: "4", patient: "—", age: "", time: "10:30 AM", endTime: "11:00 AM", mode: "blocked", type: "break", reason: "Tea Break", status: "blocked", hasHistory: false, meds: "", phone: "" },
    { id: "5", patient: "Priya Nair", age: "42F", time: "11:00 AM", endTime: "11:30 AM", mode: "clinic", type: "post_op", reason: "Post-surgery Review", status: "booked", hasHistory: true, meds: "Atorvastatin, Aspirin", phone: "+91 89XXX XXXXX" },
    { id: "6", patient: "Suresh Kumar", age: "60M", time: "11:30 AM", endTime: "12:00 PM", mode: "video", type: "follow_up", reason: "BP Review", status: "booked", hasHistory: true, meds: "Amlodipine 5mg", phone: "+91 99XXX XXXXX" },
    { id: "7", patient: "Deepa Iyer", age: "29F", time: "02:00 PM", endTime: "02:30 PM", mode: "clinic", type: "new", reason: "Routine Checkup", status: "booked", hasHistory: false, meds: "None", phone: "+91 77XXX XXXXX" },
    { id: "8", patient: "Karan Gupta", age: "45M", time: "03:30 PM", endTime: "04:00 PM", mode: "clinic", type: "follow_up", reason: "ECG Report Review", status: "booked", hasHistory: true, meds: "Metformin", phone: "+91 88XXX XXXXX" },
];

const weekDays = ["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18", "Sun 19"];

const statusFlow = ["Booked", "Confirmed", "In Progress", "Completed", "Follow-up Scheduled"];

export default function DoctorAppointments() {
    const [view, setView] = useState<ViewMode>("list");
    const [selectedDate] = useState("January 15, 2025");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Appointments</h1>
                    <p className="text-body-md text-content-secondary mt-1">Manage your consultation schedule</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Block Slot</Button>
                </div>
            </div>

            {/* View Toggle & Date Nav */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex bg-gray-100 dark:bg-surface-dark-elevated rounded-xl p-1">
                    {(["day", "week", "list"] as ViewMode[]).map(v => (
                        <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-all ${view === v ? "bg-white dark:bg-surface-dark-card shadow-sm text-primary-600" : "text-content-secondary hover:text-content-primary"}`}>
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary">{selectedDate}</span>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Appointment Status Flow */}
            <Card padding="md" className="hidden sm:block">
                <div className="flex items-center justify-between">
                    {statusFlow.map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 2 ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-content-tertiary"}`}>
                                {i + 1}
                            </div>
                            <span className={`text-caption ${i <= 2 ? "text-primary-600 font-medium" : "text-content-tertiary"}`}>{step}</span>
                            {i < statusFlow.length - 1 && <div className={`w-12 h-0.5 ${i < 2 ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"}`} />}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Week View */}
            {view === "week" && (
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, i) => (
                        <Card key={day} padding="sm" className={`text-center cursor-pointer ${i === 2 ? "ring-2 ring-primary-500" : ""}`}>
                            <p className="text-caption font-semibold text-content-primary dark:text-content-dark-primary">{day}</p>
                            <p className="text-heading-sm font-bold text-primary-600 mt-1">{[6, 8, 8, 5, 7, 3, 0][i]}</p>
                            <p className="text-[10px] text-content-tertiary">appointments</p>
                        </Card>
                    ))}
                </div>
            )}

            {/* Appointment List */}
            <div className="space-y-3">
                {appointments.map((apt, i) => (
                    <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        {apt.status === "blocked" ? (
                            <div className="card-base p-4 border-l-4 border-l-gray-300 dark:border-l-gray-600 bg-gray-50/50 dark:bg-gray-800/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-content-tertiary">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-body-sm font-medium">{apt.time} – {apt.endTime}</span>
                                        <span>— {apt.reason}</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-red-500">Remove Block</Button>
                                </div>
                            </div>
                        ) : (
                            <Card padding="none" className={`border-l-4 ${apt.status === "in_progress" ? "border-l-purple-500" : apt.type === "new" ? "border-l-blue-500" : apt.type === "post_op" ? "border-l-amber-500" : "border-l-emerald-500"}`}>
                                <div className="p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Avatar fallback={apt.patient} size="md" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-body-md text-content-primary dark:text-content-dark-primary">{apt.patient}</h3>
                                                    {apt.age && <span className="text-body-sm text-content-tertiary">{apt.age}</span>}
                                                    {apt.type === "new" && <Badge variant="info">New Patient</Badge>}
                                                    {apt.type === "post_op" && <Badge variant="warning">Post-Op</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-body-sm text-content-secondary flex-wrap">
                                                    <span className="flex items-center gap-1 font-medium text-primary-600">
                                                        <Clock className="w-3 h-3" /> {apt.time} – {apt.endTime}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {apt.mode === "video" ? <Video className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                                        {apt.mode === "video" ? "Video Call" : "In-Clinic"}
                                                    </span>
                                                </div>
                                                <p className="text-body-sm text-content-secondary mt-0.5">{apt.reason}</p>
                                                {apt.meds && apt.meds !== "None" && (
                                                    <p className="text-caption text-content-tertiary mt-1">💊 Current: {apt.meds}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {apt.status === "in_progress" && (
                                                <>
                                                    <Badge variant="danger" className="animate-pulse">🔴 Live</Badge>
                                                    <Link href={`/doctor/appointments/call/${apt.id}`}>
                                                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Join Call</Button>
                                                    </Link>
                                                </>
                                            )}
                                            {apt.status === "confirmed" && (
                                                <>
                                                    <StatusBadge status="active" label="Confirmed" />
                                                    {apt.mode === "video" ? (
                                                        <Link href={`/doctor/appointments/call/${apt.id}`}>
                                                            <Button size="sm">Start Call</Button>
                                                        </Link>
                                                    ) : (
                                                        <Button size="sm">Start Visit</Button>
                                                    )}
                                                    <Button size="sm" variant="ghost"><MessageSquare className="w-4 h-4" /></Button>
                                                </>
                                            )}
                                            {apt.status === "booked" && (
                                                <>
                                                    <StatusBadge status="pending" label="Booked" />
                                                    <Button size="sm" variant="outline" leftIcon={<Check className="w-3 h-3" />}>Accept</Button>
                                                    <Button size="sm" variant="ghost" leftIcon={<Calendar className="w-3 h-3" />}>Reschedule</Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500"><X className="w-4 h-4" /></Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Slot Management Hint */}
            <Card padding="md" className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-primary-100 dark:border-primary-800">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-primary-600" />
                    <div className="flex-1">
                        <p className="text-body-sm font-semibold text-primary-700 dark:text-primary-300">Smart Scheduling Suggestion</p>
                        <p className="text-body-sm text-content-secondary">You have a gap between 12:00 PM and 2:00 PM. Based on demand patterns, opening 1 teleconsult slot could generate ~₹1,500.</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-primary-300">Open Slots</Button>
                </div>
            </Card>
        </div>
    );
}

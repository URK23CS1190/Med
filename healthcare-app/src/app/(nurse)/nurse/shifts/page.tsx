"use client";

import { motion } from "framer-motion";
import { Timer, Calendar, Clock, Users, ChevronLeft, ChevronRight, Sun, Moon, Sunrise, Check, X, Bell } from "lucide-react";
import { Card, Button, StatCard, StatusBadge } from "@/components/ui";

type ShiftType = "morning" | "afternoon" | "night" | "off";
const shiftColors: Record<ShiftType, string> = { morning: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400", afternoon: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", night: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400", off: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" };
const shiftIcons: Record<ShiftType, React.ReactNode> = { morning: <Sunrise className="w-3.5 h-3.5" />, afternoon: <Sun className="w-3.5 h-3.5" />, night: <Moon className="w-3.5 h-3.5" />, off: <X className="w-3.5 h-3.5" /> };

const weekSchedule = [
    { day: "Mon 13", shift: "morning" as ShiftType, time: "06:00–14:00", ward: "Cardiology ICU" },
    { day: "Tue 14", shift: "morning" as ShiftType, time: "06:00–14:00", ward: "Cardiology ICU" },
    { day: "Wed 15", shift: "afternoon" as ShiftType, time: "14:00–22:00", ward: "General Ward" },
    { day: "Thu 16", shift: "night" as ShiftType, time: "22:00–06:00", ward: "Emergency" },
    { day: "Fri 17", shift: "morning" as ShiftType, time: "06:00–14:00", ward: "Cardiology ICU" },
    { day: "Sat 18", shift: "off" as ShiftType, time: "—", ward: "—" },
    { day: "Sun 19", shift: "off" as ShiftType, time: "—", ward: "—" },
];

const swapRequests = [
    { id: "SW-001", from: "Nurse Priya", fromShift: "Night (Thu 16)", toShift: "Morning (Thu 16)", status: "pending", reason: "Personal appointment" },
    { id: "SW-002", from: "Nurse Deepak", fromShift: "Morning (Fri 17)", toShift: "Afternoon (Fri 17)", status: "approved", reason: "Child school event" },
];

const handoverNotes = [
    { shift: "Night Shift → Morning", nurse: "Nurse Anita", time: "05:45 AM", notes: "Bed 3-A12: Ramesh Kumar — IV drip changed at 3 AM, vitals stable. Bed 3-A08: Lakshmi Devi — BP spike at 2 AM (170/100), Dr. on-call notified, medication adjusted." },
];

export default function NurseShifts() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Shift & Duty Management</h1>
                <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>Request Swap</Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="This Week" value="5 shifts" icon={<Timer className="w-5 h-5" />} color="text-teal-500" bgColor="bg-teal-50 dark:bg-teal-900/20" />
                <StatCard label="Hours Logged" value="40 hrs" icon={<Clock className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" delay={0.1} />
                <StatCard label="Overtime" value="4 hrs" icon={<Timer className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Leaves Left" value="12" icon={<Calendar className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.3} />
            </div>

            {/* Weekly Calendar */}
            <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-body-lg font-semibold">Week of Jan 13–19, 2025</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-3">
                    {weekSchedule.map((d, i) => (
                        <motion.div key={d.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className={`p-3 rounded-xl text-center ${d.day.includes("15") ? "ring-2 ring-primary-500" : ""} ${shiftColors[d.shift]}`}
                        >
                            <p className="text-[11px] font-semibold mb-1">{d.day}</p>
                            <div className="flex items-center justify-center gap-1 mb-1">{shiftIcons[d.shift]}<span className="text-[10px] font-medium capitalize">{d.shift}</span></div>
                            <p className="text-[10px] opacity-75">{d.time}</p>
                            <p className="text-[10px] opacity-75 truncate">{d.ward}</p>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Swap Requests */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary-500" /> Shift Swap Requests</h3>
                <div className="space-y-3">
                    {swapRequests.map(req => (
                        <div key={req.id} className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-body-sm font-semibold">{req.from} wants to swap</p>
                                <p className="text-body-sm text-content-secondary">{req.fromShift} → {req.toShift}</p>
                                <p className="text-caption text-content-tertiary">Reason: {req.reason}</p>
                            </div>
                            <div className="flex gap-2">
                                {req.status === "pending" ? (
                                    <>
                                        <Button size="sm" leftIcon={<Check className="w-3 h-3" />}>Accept</Button>
                                        <Button size="sm" variant="ghost" className="text-red-500"><X className="w-4 h-4" /></Button>
                                    </>
                                ) : (
                                    <StatusBadge status="active" label="Approved" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Handover Notes */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> Shift Handover Notes</h3>
                {handoverNotes.map((note, i) => (
                    <div key={i} className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-body-sm font-semibold text-amber-800 dark:text-amber-300">{note.shift}</p>
                            <span className="text-caption text-amber-600">{note.time} • {note.nurse}</span>
                        </div>
                        <p className="text-body-sm text-content-primary dark:text-content-dark-primary leading-relaxed">{note.notes}</p>
                    </div>
                ))}
            </Card>
        </div>
    );
}

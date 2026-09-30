"use client";

import { motion } from "framer-motion";
import {
    Users, UserPlus, Filter, Search, Calendar,
    Clock, Star, MoreVertical,
    Activity, CheckCircle
} from "lucide-react";
import { Card, Button, Avatar, StatusBadge, StatCard } from "@/components/ui";
import { useState } from "react";

const staff = [
    { id: "STF-101", name: "Dr. Kavitha Nair", role: "Doctor", specialty: "Oncology", shift: "Morning (8AM-4PM)", status: "on_duty", rating: 4.8, attendance: "98%", patients: 8 },
    { id: "STF-102", name: "Sr. Meenakshi", role: "Nurse", specialty: "ICU Specialist", shift: "Morning (8AM-4PM)", status: "on_duty", rating: 4.9, attendance: "95%", patients: 6 },
    { id: "STF-103", name: "Dr. Sanjay Reddy", role: "Doctor", specialty: "Cardiology", shift: "Night (8PM-4AM)", status: "off_duty", rating: 4.7, attendance: "92%", patients: 0 },
    { id: "STF-104", name: "Sr. Rajeshwari", role: "Nurse", specialty: "General Ward", shift: "Afternoon (4PM-12AM)", status: "on_duty", rating: 4.6, attendance: "88%", patients: 12 },
    { id: "STF-105", name: "Amit Kumar", role: "Support Staff", specialty: "Diagnostics", shift: "Morning (8AM-4PM)", status: "on_break", rating: 4.5, attendance: "94%", patients: 0 },
];

export default function HospitalAdminStaff() {
    const [search, setSearch] = useState("");
    const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <Users className="w-8 h-8 text-primary-500" /> Staff Management
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Apollo Hospital — Manage 45 medical and support staff</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>Roster</Button>
                    <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>Add Staff</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Staff" value="45" icon={<Users className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="On Duty Now" value="18" icon={<CheckCircle className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 4, label: "today" }} delay={0.1} />
                <StatCard label="On Break" value="3" icon={<Clock className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Avg. Performance" value="4.7/5" icon={<Star className="w-5 h-5" />} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-900/20" delay={0.3} />
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <input
                        type="text"
                        placeholder="Search staff by name, role, or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all font-medium"
                    />
                </div>
                <Button variant="outline" className="h-11 px-6 font-semibold" leftIcon={<Filter className="w-4 h-4" />}>Status</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                        <Card variant="interactive" padding="md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-3">
                                    <Avatar fallback={s.name} size="md" />
                                    <div>
                                        <h3 className="text-body-md font-bold">{s.name}</h3>
                                        <p className="text-caption text-content-tertiary">{s.role} • {s.specialty}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <StatusBadge status={s.status === "on_duty" ? "verified" : s.status === "on_break" ? "pending" : "critical"} label={s.status.replace('_', ' ')} size="sm" />
                                        </div>
                                    </div>
                                </div>
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><MoreVertical className="w-4 h-4 text-content-tertiary" /></button>
                            </div>

                            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-content-tertiary flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Shift</span>
                                    <span className="font-medium">{s.shift}</span>
                                </div>
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-content-tertiary flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Attendance</span>
                                    <span className="font-medium text-emerald-600">{s.attendance}</span>
                                </div>
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-content-tertiary flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Patients assigned</span>
                                    <span className="font-medium">{s.patients}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button size="sm" variant="ghost" fullWidth className="text-primary-600">Assign Task</Button>
                                <Button size="sm" variant="ghost" fullWidth>Performance</Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import {
    Building2, Users, Clock,
    Filter, Search,
    Bed, UserPlus, AlertTriangle, LogOut
} from "lucide-react";
import { Card, Button, Avatar, StatusBadge, StatCard } from "@/components/ui";
import { useState } from "react";

const admissions = [
    { id: "ADM-8821", patient: "Rahul V.", bed: "ICU-204", admitted: "2 hours ago", doctor: "Dr. Kavitha", nurse: "Sr. Meenakshi", status: "admitted", priority: "critical" },
    { id: "ADM-8822", patient: "Sanjay M.", bed: "GEN-412", admitted: "5 hours ago", doctor: "Dr. Sharma", nurse: "Sr. Rajeshwari", status: "admitted", priority: "medium" },
    { id: "ADM-8823", patient: "Anita D.", bed: "EMG-102", admitted: "Just now", doctor: "Dr. Nair", nurse: "Sr. Meenakshi", status: "pending", priority: "high" },
    { id: "ADM-8819", patient: "Priya K.", bed: "OXY-301", admitted: "1 day ago", doctor: "Dr. Mehta", nurse: "Sr. Lakshmi", status: "discharging", priority: "low" },
    { id: "ADM-8818", patient: "Amit S.", bed: "ICU-205", admitted: "3 days ago", doctor: "Dr. Kavitha", nurse: "Sr. Meenakshi", status: "admitted", priority: "critical" },
];

export default function HospitalAdminAdmissions() {
    const [search, setSearch] = useState("");
    const filtered = admissions.filter(a => a.patient.toLowerCase().includes(search.toLowerCase()) || a.bed.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <Building2 className="w-8 h-8 text-primary-500" /> Admissions & Discharge
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Manage active patient admissions and ward occupancy</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Waitlist</Button>
                    <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>New Admission</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Admissions" value="112" icon={<Users className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="Critical Cases" value="8" icon={<AlertTriangle className="w-5 h-5" />} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20" trend={{ value: 2, label: "today" }} delay={0.1} />
                <StatCard label="Discharges Today" value="5" icon={<LogOut className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Waitlist" value="12" icon={<Clock className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.3} />
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <input
                        type="text"
                        placeholder="Search by patient name, bed ID, or doctor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all font-medium"
                    />
                </div>
                <select className="h-11 px-6 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 font-semibold appearance-none">
                    <option>All Wards</option>
                    <option>ICU</option>
                    <option>General</option>
                    <option>Emergency</option>
                </select>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Patient & Admission ID</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Ward/Bed</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Admitted</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Doctor & Nurse</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Status</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filtered.map((a, i) => (
                                <motion.tr
                                    key={a.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar fallback={a.patient} size="sm" />
                                            <div>
                                                <p className="text-body-sm font-semibold">{a.patient}</p>
                                                <p className="text-caption text-content-tertiary">{a.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Bed className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-body-sm font-medium">{a.bed}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-content-secondary">
                                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{a.admitted}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-body-sm font-medium">{a.doctor}</p>
                                        <p className="text-caption text-content-tertiary">{a.nurse}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            status={a.status === "admitted" ? "verified" : a.status === "pending" ? "pending" : "in_progress"}
                                            label={a.status}
                                            size="sm"
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost">Records</Button>
                                            <Button size="sm" variant="outline" className="text-red-500 border-red-200">Discharge</Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

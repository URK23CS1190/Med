"use client";

import { motion } from "framer-motion";
import {
    Building2, Plus, Search, Filter, MapPin,
    Bed, CheckCircle, ExternalLink,
    Clock
} from "lucide-react";
import { Card, Button, Badge, StatCard, StatusBadge } from "@/components/ui";
import { useState } from "react";

const hospitals = [
    {
        id: "HOS-001", name: "Apollo Hospital", location: "Bandra West, Mumbai",
        type: "Multi-specialty", status: "active", beds: { total: 175, available: 66 },
        staff: 45, phone: "+91 22-2656-8000", verified: true, rating: 4.8
    },
    {
        id: "HOS-002", name: "Fortis Malar", location: "Andheri East, Mumbai",
        type: "Super-specialty", status: "active", beds: { total: 120, available: 32 },
        staff: 38, phone: "+91 22-3066-6666", verified: true, rating: 4.6
    },
    {
        id: "HOS-003", name: "Lilavati Hospital", location: "Bandra East, Mumbai",
        type: "Multi-specialty", status: "onboarding", beds: { total: 200, available: 0 },
        staff: 0, phone: "+91 22-2656-7000", verified: false, rating: null
    },
    {
        id: "HOS-004", name: "Nanavati Max", location: "Vile Parle, Mumbai",
        type: "Multi-specialty", status: "active", beds: { total: 150, available: 45 },
        staff: 52, phone: "+91 22-2626-7500", verified: true, rating: 4.7
    }
];

export default function SuperAdminHospitals() {
    const [search, setSearch] = useState("");

    const filtered = hospitals.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <Building2 className="w-8 h-8 text-primary-500" /> Facility Management
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Manage all registered hospitals, clinics, and labs</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download Directory</Button>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Register Facility</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Facilities" value="156" icon={<Building2 className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="Verified" value="142" icon={<CheckCircle className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.1} />
                <StatCard label="Onboarding" value="14" icon={<Clock className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Total Beds" value="4,850" icon={<Bed className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.3} />
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <input
                        type="text"
                        placeholder="Search by name, location, or specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all"
                    />
                </div>
                <Button variant="outline" className="h-11 px-4" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((h, i) => (
                    <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card variant="interactive" padding="md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-xl">🏥</div>
                                    <div>
                                        <h3 className="text-body-lg font-bold flex items-center gap-1.5">
                                            {h.name}
                                            {h.verified && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />}
                                        </h3>
                                        <p className="text-body-sm text-content-secondary flex items-center gap-1"><MapPin className="w-3 h-3" />{h.location}</p>
                                        <Badge variant="secondary" size="sm" className="mt-1">{h.type}</Badge>
                                    </div>
                                </div>
                                <StatusBadge status={h.status === "active" ? "verified" : "pending"} label={h.status} />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated text-center">
                                    <p className="text-heading-sm font-bold text-content-primary dark:text-content-dark-primary">{h.beds.available}/{h.beds.total}</p>
                                    <p className="text-[10px] text-content-tertiary uppercase font-semibold">Beds Avail.</p>
                                </div>
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated text-center">
                                    <p className="text-heading-sm font-bold text-content-primary dark:text-content-dark-primary">{h.staff}</p>
                                    <p className="text-[10px] text-content-tertiary uppercase font-semibold">Staff</p>
                                </div>
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated text-center">
                                    <p className="text-heading-sm font-bold text-amber-500">⭐ {h.rating || "N/A"}</p>
                                    <p className="text-[10px] text-content-tertiary uppercase font-semibold">Rating</p>
                                </div>
                            </div>

                            <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                                <Button size="sm" variant="ghost" fullWidth className="text-primary-600">View Details</Button>
                                <Button size="sm" variant="ghost" fullWidth leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>Dashboard</Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

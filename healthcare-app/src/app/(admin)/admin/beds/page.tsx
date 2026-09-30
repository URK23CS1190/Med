"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, Users, AlertCircle, Search, ArrowRight, Activity } from "lucide-react";
import { Card, Button, Input, Badge, Avatar } from "@/components/ui";

const wards = [
    { name: "General Ward", total: 40, occupied: 32, status: "Normal" },
    { name: "ICU", total: 15, occupied: 12, status: "Critical" },
    { name: "Emergency", total: 20, occupied: 8, status: "Stable" },
    { name: "Pediatric", total: 25, occupied: 22, status: "Near Capacity" },
];

const activeStaff = [
    { name: "Dr. Ananya Rao", role: "Chief Surgeon", department: "Surgical", status: "On Duty", shift: "Morning" },
    { name: "Nurse Mark J.", role: "Senior Nurse", department: "ICU", status: "On Break", shift: "Night" },
    { name: "Dr. Ken Chen", role: "Resident", department: "Emergency", status: "In Surgery", shift: "Morning" },
];

export default function AdminBedsPage() {
    const [selectedWard, setSelectedWard] = useState("General Ward");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm">Hospital Resource Management</h1>
                    <p className="text-body-md text-content-secondary mt-1">
                        Monitor bed availability, staff shifts, and department status
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Activity className="w-4 h-4" />}>Live Monitor</Button>
                    <Button variant="primary">Add Resources</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ward Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wards.map((ward) => (
                            <Card
                                key={ward.name}
                                variant="interactive"
                                className={`cursor-pointer transition-all ${selectedWard === ward.name ? 'ring-2 ring-primary-500 bg-primary-50/10' : ''}`}
                                onClick={() => setSelectedWard(ward.name)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <BedDouble className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <Badge variant={
                                        ward.status === 'Critical' ? 'danger' :
                                            ward.status === 'Near Capacity' ? 'warning' :
                                                'success'
                                    }>
                                        {ward.status}
                                    </Badge>
                                </div>
                                <h3 className="text-heading-sm font-bold mt-4">{ward.name}</h3>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-content-secondary">Occupancy</span>
                                        <span className="font-semibold">{Math.round((ward.occupied / ward.total) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${ward.status === 'Critical' ? 'bg-red-500' : 'bg-primary-500'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(ward.occupied / ward.total) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-caption text-content-tertiary">{ward.occupied} / {ward.total} beds occupied</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card padding="none">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="font-semibold">{selectedWard} - Active Patients</h3>
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-content-tertiary" />
                                <Input className="h-8 text-sm" placeholder="Search bed..." />
                            </div>
                        </div>
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${i % 4 === 0
                                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                        : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                                        }`}
                                >
                                    <span className="text-[10px] font-bold text-content-tertiary">BED {100 + i}</span>
                                    <BedDouble className={`w-6 h-6 ${i % 4 === 0 ? 'text-blue-500' : 'text-emerald-500'}`} />
                                    <span className="text-[10px] font-medium truncate w-full text-center">
                                        {i % 4 === 0 ? 'John Doe' : 'Available'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar: Staff & Alerts */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-500" /> On-Duty Staff
                        </h3>
                        <div className="space-y-4">
                            {activeStaff.map((staff) => (
                                <div key={staff.name} className="flex items-center gap-3">
                                    <Avatar fallback={staff.name} size="md" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-sm font-semibold truncate">{staff.name}</p>
                                        <p className="text-caption text-content-tertiary">{staff.role} • {staff.department}</p>
                                    </div>
                                    <Badge size="sm" variant={staff.status === 'On Duty' ? 'success' : 'warning'}>
                                        {staff.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-primary-600" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            View Staff Directory
                        </Button>
                    </Card>

                    <Card className="bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                        <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5" /> Critical Alerts
                        </h3>
                        <div className="space-y-3">
                            <div className="text-xs p-2 bg-white dark:bg-gray-800 rounded border border-red-100 dark:border-red-900 shadow-sm">
                                <p className="font-bold text-red-600 mb-1">Low Oxygen Supply</p>
                                <p className="text-content-tertiary">Main tank levels below 15% in Ward B.</p>
                                <p className="mt-2 font-semibold text-primary-600 cursor-pointer">Restock Now</p>
                            </div>
                            <div className="text-xs p-2 bg-white dark:bg-gray-800 rounded border border-red-100 dark:border-red-900 shadow-sm">
                                <p className="font-bold text-red-600 mb-1">Ambulance ETA: 2 mins</p>
                                <p className="text-content-tertiary">Incoming trauma case. Emergency Team A respond.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, AlertCircle, CheckCircle2, TrendingUp, Settings, Activity } from "lucide-react";
import { Card, Button } from "@/components/ui";

// Mock data
const mockBeds = [
    { id: "B-101", ward: "General Ward", status: "occupied", patient: "Ramesh K.", admitDate: "Oct 24" },
    { id: "B-102", ward: "General Ward", status: "available", patient: null, admitDate: null },
    { id: "B-103", ward: "General Ward", status: "available", patient: null, admitDate: null },
    { id: "ICU-01", ward: "Intensive Care Unit", status: "occupied", patient: "Sneha P.", admitDate: "Oct 25" },
    { id: "ICU-02", ward: "Intensive Care Unit", status: "maintenance", patient: null, admitDate: null },
    { id: "E-01", ward: "Emergency", status: "available", patient: null, admitDate: null },
];

export default function AdminDashboard() {
    const [filter, setFilter] = useState("all");

    const filteredBeds = mockBeds.filter(
        b => filter === "all" || b.status === filter
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">
                        Hospital Administration
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">
                        Apollo Hospital • Central Management Console
                    </p>
                </div>
                <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                    Settings
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Beds", value: "145", change: "+5", icon: <BedDouble className="w-5 h-5" />, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Available", value: "34", change: "-2", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Critical Care", value: "12/15", change: "+1", icon: <Activity className="w-5 h-5" />, color: "text-red-500 bg-red-50 dark:bg-red-900/20" },
                    { label: "Admissions Today", value: "28", change: "+14%", icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card padding="md">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-body-sm text-content-secondary">{stat.label}</h3>
                            <p className="text-display-xs font-display text-content-primary dark:text-content-dark-primary mt-1">{stat.value}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="h-[500px] flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h2 className="text-heading-sm">Live Bed Availability</h2>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <div className="flex gap-2 mb-4">
                        {["all", "available", "occupied", "maintenance"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f
                                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredBeds.map((bed) => (
                            <motion.div
                                key={bed.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${bed.status === "available"
                                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10 hover:border-emerald-300"
                                    : bed.status === "occupied"
                                        ? "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 hover:border-blue-300"
                                        : "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10 hover:border-amber-300"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <BedDouble className={`w-6 h-6 ${bed.status === "available" ? "text-emerald-500" :
                                        bed.status === "occupied" ? "text-blue-500" : "text-amber-500"
                                        }`} />
                                    <span className="text-[10px] font-bold text-gray-400">{bed.id}</span>
                                </div>
                                <h4 className="text-xs font-semibold text-content-primary mb-1">{bed.ward}</h4>
                                {bed.status === "occupied" ? (
                                    <div className="mt-2 text-xs">
                                        <p className="font-medium text-gray-700 dark:text-gray-300 truncate">{bed.patient}</p>
                                        <p className="text-gray-500">Since {bed.admitDate}</p>
                                    </div>
                                ) : bed.status === "available" ? (
                                    <div className="mt-2 text-xs text-emerald-600 font-medium">Ready for Admit</div>
                                ) : (
                                    <div className="mt-2 text-xs flex items-center gap-1 text-amber-600 font-medium">
                                        <AlertCircle className="w-3 h-3" /> Cleaning
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

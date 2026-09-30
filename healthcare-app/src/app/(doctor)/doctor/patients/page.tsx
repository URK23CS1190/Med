"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Users, Search, Filter, FileText, Heart, Activity, Pill,
    AlertTriangle, TrendingUp, Download, ChevronRight, Thermometer
} from "lucide-react";
import { Card, Button, Badge, Avatar } from "@/components/ui";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const patients: {
    id: string;
    name: string;
    age: string;
    blood: string;
    conditions: string[];
    allergies: string[];
    lastVisit: string;
    status: "active" | "critical" | "stable";
    flags: string[];
}[] = [
        { id: "P-20240832", name: "Riya Sharma", age: "28F", blood: "O+", conditions: ["Hypertension", "Hypothyroidism"], allergies: ["Penicillin", "Sulfa"], lastVisit: "12 Jan 2025", status: "active", flags: ["overdue_followup"] },
        { id: "P-20240815", name: "Mohan Rao", age: "55M", blood: "A+", conditions: ["CAD", "Diabetes"], allergies: ["None"], lastVisit: "11 Jan 2025", status: "critical", flags: ["abnormal_lab"] },
        { id: "P-20240798", name: "Priya Nair", age: "42F", blood: "B+", conditions: ["Hypothyroidism"], allergies: ["None"], lastVisit: "10 Jan 2025", status: "stable", flags: [] },
        { id: "P-20240781", name: "Suresh Kumar", age: "60M", blood: "AB+", conditions: ["Heart Failure", "CKD"], allergies: ["NSAIDs"], lastVisit: "08 Jan 2025", status: "active", flags: ["rx_expiring"] },
        { id: "P-20240770", name: "Deepa Iyer", age: "29F", blood: "O-", conditions: [], allergies: ["None"], lastVisit: "05 Jan 2025", status: "active", flags: [] },
        { id: "P-20240755", name: "Karan Gupta", age: "45M", blood: "B-", conditions: ["Hypertension"], allergies: ["Aspirin"], lastVisit: "02 Jan 2025", status: "active", flags: ["overdue_followup"] },
    ];

const clinicalTimeline = [
    { date: "12 Jan 2025", event: "Consultation: Chest palpitations, ECG ordered, Metoprolol prescribed", type: "consultation" },
    { date: "08 Jan 2025", event: "Lab Report uploaded: CBC Normal, TSH Elevated 7.2 mIU/L", type: "lab" },
    { date: "28 Dec 2024", event: "Follow-up: BP controlled, Levothyroxine dose adjusted", type: "followup" },
    { date: "15 Dec 2024", event: "Emergency: BP spike 180/110, managed and discharged", type: "emergency" },
];

const vitalsData = [
    { date: "Oct", systolic: 138, diastolic: 88, hr: 78 },
    { date: "Nov", systolic: 132, diastolic: 84, hr: 74 },
    { date: "Dec", systolic: 145, diastolic: 92, hr: 82 },
    { date: "Jan", systolic: 128, diastolic: 82, hr: 72 },
];

export default function DoctorPatients() {
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("summary");
    const patient = patients.find(p => p.id === selectedPatient);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Patient Records</h1>
                    <p className="text-body-md text-content-secondary mt-1">View and manage clinical history</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient List */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                        <input type="text" placeholder="Search patients..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm focus:ring-2 focus:ring-primary-500/20" />
                    </div>
                    <div className="space-y-2">
                        {patients.map(p => (
                            <motion.button
                                key={p.id}
                                onClick={() => { setSelectedPatient(p.id); setActiveTab("summary"); }}
                                className={`w-full text-left p-3 rounded-xl transition-all ${selectedPatient === p.id ? "bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800" : "hover:bg-gray-50 dark:hover:bg-gray-800 card-base"}`}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar fallback={p.name} size="sm" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-body-sm font-semibold truncate">{p.name}</h3>
                                            {p.status === "critical" && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                        </div>
                                        <p className="text-caption text-content-tertiary">{p.id} • {p.age} • {p.blood}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {p.flags.includes("overdue_followup") && <Badge variant="danger" className="text-[9px]">Overdue F/U</Badge>}
                                            {p.flags.includes("abnormal_lab") && <Badge variant="warning" className="text-[9px]">Abnormal Lab</Badge>}
                                            {p.flags.includes("rx_expiring") && <Badge variant="info" className="text-[9px]">Rx Expiring</Badge>}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-content-tertiary flex-shrink-0" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Patient Detail */}
                <div className="lg:col-span-2">
                    {patient ? (
                        <div className="space-y-4">
                            {/* Patient Header */}
                            <Card padding="md" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                                <div className="flex items-center gap-4">
                                    <Avatar fallback={patient.name} size="lg" />
                                    <div className="flex-1">
                                        <h2 className="text-heading-md text-content-primary dark:text-content-dark-primary">{patient.name}</h2>
                                        <p className="text-body-sm text-content-secondary">{patient.age} • Blood: {patient.blood} • {patient.id}</p>
                                        {patient.allergies[0] !== "None" && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                <span className="text-body-sm text-red-600 dark:text-red-400 font-medium">Allergies: {patient.allergies.join(", ")}</span>
                                            </div>
                                        )}
                                        {patient.conditions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {patient.conditions.map(c => <Badge key={c} variant="info">{c}</Badge>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Tabs */}
                            <div className="flex bg-gray-100 dark:bg-surface-dark-elevated rounded-xl p-1 overflow-x-auto">
                                {["summary", "timeline", "vitals", "reports", "prescriptions", "notes"].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? "bg-white dark:bg-surface-dark-card shadow-sm text-primary-600" : "text-content-secondary"}`}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {activeTab === "summary" && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <Card padding="sm" className="text-center">
                                        <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                                        <p className="text-heading-sm font-bold">128/82</p>
                                        <p className="text-caption text-content-tertiary">Last BP</p>
                                    </Card>
                                    <Card padding="sm" className="text-center">
                                        <Activity className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                                        <p className="text-heading-sm font-bold">72</p>
                                        <p className="text-caption text-content-tertiary">Heart Rate</p>
                                    </Card>
                                    <Card padding="sm" className="text-center">
                                        <Thermometer className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                        <p className="text-heading-sm font-bold">98.4°F</p>
                                        <p className="text-caption text-content-tertiary">Temp</p>
                                    </Card>
                                    <Card padding="sm" className="text-center">
                                        <Pill className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                        <p className="text-heading-sm font-bold">3</p>
                                        <p className="text-caption text-content-tertiary">Active Meds</p>
                                    </Card>
                                </div>
                            )}

                            {activeTab === "timeline" && (
                                <Card padding="md">
                                    <h3 className="text-body-lg font-semibold mb-4">Clinical Timeline</h3>
                                    <div className="space-y-4">
                                        {clinicalTimeline.map((entry, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${entry.type === "emergency" ? "bg-red-500" : entry.type === "lab" ? "bg-amber-500" : "bg-primary-500"}`} />
                                                    {i < clinicalTimeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
                                                </div>
                                                <div className="pb-4">
                                                    <p className="text-caption text-content-tertiary font-medium">{entry.date}</p>
                                                    <p className="text-body-sm text-content-primary dark:text-content-dark-primary mt-0.5">{entry.event}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {activeTab === "vitals" && (
                                <Card padding="md">
                                    <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-primary-500" /> Blood Pressure Trend
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={vitalsData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                                                <YAxis stroke="#9CA3AF" fontSize={12} />
                                                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                                                <Line type="monotone" dataKey="systolic" stroke="#EF4444" strokeWidth={2} name="Systolic" />
                                                <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} name="Diastolic" />
                                                <Line type="monotone" dataKey="hr" stroke="#10B981" strokeWidth={2} name="Heart Rate" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            )}

                            {(activeTab === "reports" || activeTab === "prescriptions" || activeTab === "notes") && (
                                <Card padding="md">
                                    <div className="text-center py-12">
                                        <FileText className="w-12 h-12 text-content-tertiary mx-auto mb-3" />
                                        <p className="text-body-md text-content-secondary">
                                            {activeTab === "reports" ? "Lab reports and radiology images will appear here" :
                                                activeTab === "prescriptions" ? "Prescription history for this patient" :
                                                    "Clinical notes and observations"}
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-4">
                                            {activeTab === "reports" ? "Upload Report" : activeTab === "prescriptions" ? "New Prescription" : "Add Note"}
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <Card padding="lg" className="flex flex-col items-center justify-center min-h-[400px]">
                            <Users className="w-16 h-16 text-content-tertiary mb-4" />
                            <p className="text-body-lg text-content-secondary">Select a patient to view their records</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

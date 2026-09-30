"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText, Search, Plus, Pill,
    Download, Eye, Printer, QrCode, ChevronRight
} from "lucide-react";
import { Card, Button, Badge, Avatar, StatusBadge } from "@/components/ui";

const recentPatients = [
    { id: "P-20240832", name: "Riya Sharma", age: "28F" },
    { id: "P-20240815", name: "Mohan Rao", age: "55M" },
    { id: "P-20240798", name: "Priya Nair", age: "42F" },
];

const prescriptionHistory = [
    { id: "RX-2025-0883", patient: "Riya Sharma", date: "12 Jan 2025", diagnosis: "Hypertension", meds: 3, status: "active", dispensed: true, pharmacy: "MedPlus BKC" },
    { id: "RX-2025-0876", patient: "Mohan Rao", date: "11 Jan 2025", diagnosis: "Coronary Artery Disease", meds: 5, status: "active", dispensed: false, pharmacy: null },
    { id: "RX-2025-0865", patient: "Priya Nair", date: "10 Jan 2025", diagnosis: "Hypothyroidism", meds: 2, status: "active", dispensed: true, pharmacy: "Apollo Pharmacy" },
    { id: "RX-2025-0841", patient: "Suresh Kumar", date: "08 Jan 2025", diagnosis: "Heart Failure", meds: 6, status: "expired", dispensed: true, pharmacy: "Netmeds" },
    { id: "RX-2025-0820", patient: "Deepa Iyer", date: "05 Jan 2025", diagnosis: "Routine Checkup", meds: 1, status: "void", dispensed: false, pharmacy: null },
];

const drugAlerts = [
    { type: "allergy", icon: "🔴", severity: "critical", text: "Patient allergic to Penicillin — Amoxicillin contains Penicillin!" },
    { type: "duplicate", icon: "🟡", severity: "warning", text: "Pantoprazole already in active prescription from 3 days ago" },
    { type: "interaction", icon: "🟡", severity: "warning", text: "Warfarin + Aspirin — Increased bleeding risk" },
];

const sampleMeds = [
    { name: "Metoprolol 25mg", form: "Tablet", dosage: "1-0-1", duration: "30 days", instruction: "After food" },
    { name: "Pantoprazole 40mg", form: "Capsule", dosage: "1-0-0", duration: "30 days", instruction: "Before food" },
    { name: "Aspirin 75mg", form: "Tablet", dosage: "0-0-1", duration: "30 days", instruction: "After food" },
];

export default function DoctorPrescriptions() {
    const [activeTab, setActiveTab] = useState<"new" | "history">("new");
    const [step, setStep] = useState(1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">e-Prescriptions</h1>
                    <p className="text-body-md text-content-secondary mt-1">Create and manage digital prescriptions</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-surface-dark-elevated rounded-xl p-1 w-fit">
                <button onClick={() => setActiveTab("new")} className={`px-5 py-2 rounded-lg text-body-sm font-medium transition-all ${activeTab === "new" ? "bg-white dark:bg-surface-dark-card shadow-sm text-primary-600" : "text-content-secondary"}`}>
                    <Plus className="w-4 h-4 inline mr-1" /> New Prescription
                </button>
                <button onClick={() => setActiveTab("history")} className={`px-5 py-2 rounded-lg text-body-sm font-medium transition-all ${activeTab === "history" ? "bg-white dark:bg-surface-dark-card shadow-sm text-primary-600" : "text-content-secondary"}`}>
                    <FileText className="w-4 h-4 inline mr-1" /> History
                </button>
            </div>

            {activeTab === "new" ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Step Progress */}
                    <Card padding="md" className="lg:col-span-1">
                        <h3 className="text-body-md font-semibold mb-4">Prescription Steps</h3>
                        <div className="space-y-3">
                            {["Patient Search", "Clinical Details", "Medication", "Tests & Diagnostics", "Instructions", "Review & Issue"].map((s, i) => (
                                <button key={s} onClick={() => setStep(i + 1)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-body-sm transition-all text-left ${step === i + 1 ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium" : step > i + 1 ? "text-emerald-600" : "text-content-secondary hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? "bg-primary-500 text-white" : step > i + 1 ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                                        {step > i + 1 ? "✓" : i + 1}
                                    </div>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Step Content */}
                    <Card padding="md" className="lg:col-span-3">
                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-heading-sm font-semibold">Step 1 — Patient Search</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                                    <input type="text" placeholder="Search by name, ID, or mobile..." className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" />
                                </div>
                                <div>
                                    <p className="text-caption text-content-tertiary mb-2">Recent Patients</p>
                                    <div className="space-y-2">
                                        {recentPatients.map(p => (
                                            <button key={p.id} onClick={() => setStep(2)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                                                <Avatar fallback={p.name} size="sm" />
                                                <div>
                                                    <p className="text-body-sm font-medium text-content-primary dark:text-content-dark-primary">{p.name}</p>
                                                    <p className="text-caption text-content-tertiary">{p.id} • {p.age}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-content-tertiary ml-auto" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-heading-sm font-semibold">Step 2 — Clinical Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-body-sm font-medium text-content-secondary block mb-1.5">Chief Complaint</label>
                                        <input type="text" defaultValue="Chest palpitations" className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm" />
                                    </div>
                                    <div>
                                        <label className="text-body-sm font-medium text-content-secondary block mb-1.5">Diagnosis (ICD-10)</label>
                                        <input type="text" defaultValue="I49.9 — Cardiac arrhythmia" className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm" />
                                    </div>
                                    <div>
                                        <label className="text-body-sm font-medium text-content-secondary block mb-1.5">Severity</label>
                                        <select className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm">
                                            <option>Mild</option><option>Moderate</option><option>Severe</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-body-sm font-medium text-content-secondary block mb-1.5">Duration</label>
                                        <input type="text" defaultValue="3 days" className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                    <Button onClick={() => setStep(3)}>Next: Medication</Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-heading-sm font-semibold">Step 3 — Medication</h3>
                                {/* Drug Alerts */}
                                <div className="space-y-2">
                                    {drugAlerts.map((alert, i) => (
                                        <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className={`flex items-start gap-2 p-3 rounded-xl ${alert.severity === "critical" ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800" : "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"}`}>
                                            <span className="text-lg">{alert.icon}</span>
                                            <span className={`text-body-sm ${alert.severity === "critical" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>{alert.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                {/* Medicine List */}
                                <div className="space-y-3">
                                    {sampleMeds.map((med, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-body-md font-semibold flex items-center gap-2">
                                                    <Pill className="w-4 h-4 text-primary-500" /> {med.name}
                                                </h4>
                                                <Badge variant="info">{med.form}</Badge>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-body-sm text-content-secondary">
                                                <div>Dosage: <span className="font-medium text-content-primary dark:text-content-dark-primary">{med.dosage}</span></div>
                                                <div>Duration: <span className="font-medium text-content-primary dark:text-content-dark-primary">{med.duration}</span></div>
                                                <div>Instruction: <span className="font-medium text-content-primary dark:text-content-dark-primary">{med.instruction}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} className="w-full border-dashed">Add Another Medicine</Button>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                                    <Button onClick={() => setStep(4)}>Next: Tests</Button>
                                </div>
                            </div>
                        )}

                        {step >= 4 && step <= 5 && (
                            <div className="space-y-4">
                                <h3 className="text-heading-sm font-semibold">
                                    {step === 4 ? "Step 4 — Tests & Diagnostics" : "Step 5 — Additional Instructions"}
                                </h3>
                                {step === 4 && (
                                    <div className="space-y-3">
                                        <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Lab Test</Button>
                                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated">
                                            <p className="text-body-sm font-medium">CBC — Complete Blood Count</p>
                                            <p className="text-caption text-content-tertiary">Routine blood work to check RBC, WBC, platelets</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated">
                                            <p className="text-body-sm font-medium">ECG — 12 Lead Electrocardiogram</p>
                                            <p className="text-caption text-content-tertiary">To evaluate cardiac rhythm and detect arrhythmias</p>
                                        </div>
                                    </div>
                                )}
                                {step === 5 && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-body-sm font-medium text-content-secondary block mb-1.5">Diet Instructions</label>
                                            <textarea defaultValue="Low sodium diet. Avoid caffeine and alcohol." className="w-full h-20 p-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm resize-none" />
                                        </div>
                                        <div>
                                            <label className="text-body-sm font-medium text-content-secondary block mb-1.5">Follow-up</label>
                                            <div className="flex gap-3">
                                                <input type="date" className="h-10 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm" />
                                                <input type="text" placeholder="Reason for follow-up" defaultValue="Review ECG results" className="flex-1 h-10 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                                    <Button onClick={() => setStep(step + 1)}>Next</Button>
                                </div>
                            </div>
                        )}

                        {step === 6 && (
                            <div className="space-y-4">
                                <h3 className="text-heading-sm font-semibold">Step 6 — Review & Issue</h3>
                                <Card padding="md" className="bg-white dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700">
                                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-heading-sm font-bold text-primary-700 dark:text-primary-400">Dr. Arjun Mehta, MD</h4>
                                                <p className="text-caption text-content-secondary">Cardiologist • MCI/2019/07342 • Lilavati Hospital</p>
                                            </div>
                                            <QrCode className="w-12 h-12 text-content-tertiary" />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-body-sm"><span className="text-content-tertiary">Patient:</span> <span className="font-semibold">Riya Sharma, 28F</span></p>
                                        <p className="text-body-sm"><span className="text-content-tertiary">Diagnosis:</span> <span className="font-medium">I49.9 — Cardiac arrhythmia</span></p>
                                        <p className="text-body-sm"><span className="text-content-tertiary">Date:</span> <span className="font-medium">15 Jan 2025</span></p>
                                    </div>
                                    <table className="w-full text-body-sm mb-4">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-2 text-content-tertiary font-medium">Medicine</th>
                                                <th className="text-left py-2 text-content-tertiary font-medium">Dosage</th>
                                                <th className="text-left py-2 text-content-tertiary font-medium">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sampleMeds.map((m, i) => (
                                                <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                                                    <td className="py-2 font-medium">{m.name}</td>
                                                    <td className="py-2">{m.dosage} ({m.instruction})</td>
                                                    <td className="py-2">{m.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-[10px] text-content-tertiary italic">This is a computer-generated prescription. Valid for 15 days.</p>
                                </Card>
                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={() => setStep(5)}>Back</Button>
                                    <div className="flex gap-2">
                                        <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />}>Print Preview</Button>
                                        <Button leftIcon={<FileText className="w-4 h-4" />}>Issue Prescription</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                /* Prescription History */
                <div className="space-y-3">
                    {prescriptionHistory.map((rx, i) => (
                        <motion.div key={rx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card variant="interactive" padding="md">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar fallback={rx.patient} size="sm" />
                                        <div>
                                            <h3 className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                                                {rx.id}
                                                <StatusBadge status={rx.status === "active" ? "active" : rx.status === "expired" ? "expired" : "cancelled"} />
                                            </h3>
                                            <p className="text-body-sm text-content-secondary">{rx.patient} • {rx.diagnosis} • {rx.meds} medications</p>
                                            <p className="text-caption text-content-tertiary mt-0.5">{rx.date} {rx.dispensed && rx.pharmacy && `• Dispensed at ${rx.pharmacy}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                                        <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

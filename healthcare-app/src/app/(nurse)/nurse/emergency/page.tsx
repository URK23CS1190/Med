"use client";

import { motion } from "framer-motion";
import { Siren, AlertTriangle, Phone, Shield } from "lucide-react";
import { Card, Button, Badge, StatusBadge } from "@/components/ui";

const emergencyProtocols = [
    { code: "Code Blue", desc: "Cardiac/Respiratory Arrest", color: "bg-blue-600", action: "Call crash cart, start CPR, notify doctor" },
    { code: "Code Red", desc: "Fire Emergency", color: "bg-red-600", action: "Evacuate patients, use fire extinguisher, call fire dept" },
    { code: "Code Pink", desc: "Infant/Child Abduction", color: "bg-pink-600", action: "Lock all exits, notify security immediately" },
    { code: "Code Orange", desc: "Mass Casualty / Disaster", color: "bg-orange-600", action: "Activate triage, clear wards, call all available staff" },
];

const activeEmergencies = [
    { id: "E-001", type: "Code Blue", location: "Bed 3-A12, Cardiology ICU", patient: "Ramesh Kumar", time: "3 min ago", status: "active", responders: 4 },
];

const escalationQueue = [
    { id: "ESC-001", patient: "Lakshmi Devi", bed: "3-A08", issue: "BP spiking 180/110 — unresponsive to oral meds", severity: "critical", escalatedTo: "Dr. Mehta", time: "5 min ago", status: "acknowledged" },
    { id: "ESC-002", patient: "Arun Joshi", bed: "3-B03", issue: "Post-op wound showing signs of infection", severity: "high", escalatedTo: "Dr. Sharma", time: "20 min ago", status: "pending" },
];

const crashCartSupplies = [
    { item: "Defibrillator", status: "ok" }, { item: "Epinephrine (5 vials)", status: "ok" },
    { item: "Ambu Bag", status: "ok" }, { item: "Oxygen Cylinder", status: "low" },
    { item: "IV Sets", status: "ok" }, { item: "Intubation Kit", status: "ok" },
];

export default function NurseEmergency() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-3">
                    <Siren className="w-8 h-8 text-red-500 animate-pulse" /> Emergency Center
                </h1>
                <Button className="bg-red-600 hover:bg-red-700 animate-pulse" leftIcon={<Phone className="w-4 h-4" />}>SOS — Call Emergency</Button>
            </div>

            {/* Active Emergency */}
            {activeEmergencies.map(e => (
                <motion.div key={e.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card padding="md" className="bg-red-50 dark:bg-red-900/10 border-2 border-red-300 dark:border-red-700 ring-2 ring-red-200 dark:ring-red-800">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center animate-pulse"><Siren className="w-6 h-6 text-white" /></div>
                                <div>
                                    <h3 className="text-heading-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">{e.type} — ACTIVE <Badge variant="danger" className="animate-pulse">LIVE</Badge></h3>
                                    <p className="text-body-sm text-red-600">{e.location} • Patient: {e.patient}</p>
                                    <p className="text-caption text-content-tertiary">Started: {e.time} • {e.responders} responders on scene</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">Respond</Button>
                                <Button size="sm" variant="outline" className="border-red-300 text-red-700">View Protocol</Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}

            {/* Emergency Codes */}
            <h2 className="text-heading-sm font-semibold">Quick Reference — Emergency Codes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {emergencyProtocols.map(p => (
                    <Card key={p.code} padding="sm" className="hover:shadow-card-hover transition-all cursor-pointer">
                        <div className={`text-white text-xs font-bold px-2 py-1 rounded-lg ${p.color} inline-block mb-2`}>{p.code}</div>
                        <p className="text-body-sm font-semibold">{p.desc}</p>
                        <p className="text-caption text-content-tertiary mt-1">{p.action}</p>
                    </Card>
                ))}
            </div>

            {/* Escalation Queue */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Escalation Queue</h3>
                <div className="space-y-3">
                    {escalationQueue.map(esc => (
                        <div key={esc.id} className={`p-4 rounded-xl border ${esc.severity === "critical" ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/5" : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/5"}`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-body-md font-semibold flex items-center gap-2">{esc.patient} — Bed {esc.bed}
                                        <StatusBadge status={esc.severity === "critical" ? "critical" : "high"} />
                                    </h4>
                                    <p className="text-body-sm text-content-secondary mt-0.5">{esc.issue}</p>
                                    <p className="text-caption text-content-tertiary mt-1">Escalated to: {esc.escalatedTo} • {esc.time}</p>
                                </div>
                                <div className="flex gap-2">
                                    {esc.status === "pending" && <Button size="sm">Follow Up</Button>}
                                    <StatusBadge status={esc.status === "acknowledged" ? "active" : "pending"} label={esc.status === "acknowledged" ? "Acknowledged" : "Pending"} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Crash Cart */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500" /> Crash Cart — Supply Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {crashCartSupplies.map(s => (
                        <div key={s.item} className={`p-3 rounded-xl text-center ${s.status === "ok" ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-red-50 dark:bg-red-900/10 ring-1 ring-red-200"}`}>
                            <p className="text-body-sm font-medium">{s.item}</p>
                            <StatusBadge status={s.status === "ok" ? "available" : "critical"} label={s.status === "ok" ? "OK" : "LOW"} />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

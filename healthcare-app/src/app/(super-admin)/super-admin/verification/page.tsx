"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Search,
    FileText, User,
    Check, X, Clock
} from "lucide-react";
import { Card, Button, Badge, Avatar, StatusBadge, AIResultCard } from "@/components/ui";

const pendingApprovals = [
    {
        id: "VER-4521", name: "Dr. Kavitha Nair", role: "doctor",
        specialty: "Oncology", location: "Bangalore", submitted: "2 hours ago",
        score: 94, docs: 3, status: "pending",
        profile: { experience: "12 years", hospital: "Apollo Hospitals", license: "MC/KAR/2012/0854" }
    },
    {
        id: "VER-4522", name: "Sunil Verma", role: "pharmacy_admin",
        specialty: "Retail", location: "Mumbai", submitted: "5 hours ago",
        score: 82, docs: 4, status: "pending",
        profile: { store: "MedPlus Pharmacy", license: "DRUG/MH/2020/0842" }
    },
    {
        id: "VER-4523", name: "Rajesh Patil", role: "ambulance_driver",
        specialty: "ALS", location: "Pune", submitted: "1 day ago",
        score: 58, docs: 5, status: "pending",
        profile: { vehicle: "KA-01-MH-5678", license: "DL/MH/2021/9921" }
    },
    {
        id: "VER-4524", name: "Sr. Meenakshi", role: "nurse",
        specialty: "ICU Specialist", location: "Chennai", submitted: "2 days ago",
        score: 96, docs: 3, status: "pending",
        profile: { experience: "8 years", hospital: "Fortis Malar", license: "TN/NURS/2015/123" }
    }
];

export default function SuperAdminVerification() {
    const [selected, setSelected] = useState<typeof pendingApprovals[0] | null>(null);
    const [search, setSearch] = useState("");

    const filtered = pendingApprovals.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-primary-500" /> AI Provider Verification
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Review and approve healthcare provider credentials</p>
                </div>
                <Badge variant="warning" className="px-3 py-1 text-sm animate-pulse">{pendingApprovals.length} Pending Actions</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: List */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                        <input
                            type="text"
                            placeholder="Search providers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>

                    <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                        {filtered.map((p) => (
                            <motion.div
                                key={p.id}
                                layoutId={p.id}
                                onClick={() => setSelected(p)}
                            >
                                <Card
                                    variant="interactive"
                                    padding="md"
                                    className={`cursor-pointer transition-all ${selected?.id === p.id ? "ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-900/10" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar fallback={p.name} size="md" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary truncate">{p.name}</h3>
                                                <StatusBadge status={p.score >= 80 ? "verified" : p.score >= 50 ? "pending" : "critical"} label={`${p.score}%`} size="sm" />
                                            </div>
                                            <p className="text-caption text-content-tertiary capitalize">{p.role.replace('_', ' ')} • {p.specialty}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] text-content-tertiary uppercase tracking-wider">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.submitted}</span>
                                                <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{p.docs} documents</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Details / Document Viewer */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card padding="lg">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex gap-4">
                                            <Avatar fallback={selected.name} size="xl" />
                                            <div>
                                                <h2 className="text-heading-lg">{selected.name}</h2>
                                                <p className="text-body-md text-content-secondary capitalize">{selected.role.replace('_', ' ')} • {selected.specialty}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="info" className="capitalize">{selected.location}</Badge>
                                                    <Badge variant="secondary">{selected.id}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" leftIcon={<X className="w-4 h-4" />} className="text-red-500">Reject</Button>
                                            <Button size="sm" leftIcon={<Check className="w-4 h-4" />} className="bg-emerald-600 hover:bg-emerald-700">Verify Profile</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 dark:bg-surface-dark-elevated p-4 rounded-2xl">
                                            <p className="text-caption text-content-tertiary uppercase tracking-wider font-semibold mb-2">Professional Credentials</p>
                                            <div className="space-y-1 text-body-sm">
                                                {"experience" in selected.profile && <p><span className="text-content-tertiary">Experience:</span> {selected.profile.experience}</p>}
                                                {"hospital" in selected.profile && <p><span className="text-content-tertiary">Facility:</span> {selected.profile.hospital}</p>}
                                                {"store" in selected.profile && <p><span className="text-content-tertiary">Store:</span> {selected.profile.store}</p>}
                                                {"vehicle" in selected.profile && <p><span className="text-content-tertiary">Vehicle:</span> {selected.profile.vehicle}</p>}
                                                <p><span className="text-content-tertiary">License:</span> {selected.profile.license}</p>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-2xl border ${selected.score >= 90 ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100" : selected.score >= 70 ? "bg-amber-50 dark:bg-amber-900/10 border-amber-100" : "bg-red-50 dark:bg-red-900/10 border-red-100"}`}>
                                            <p className="text-caption text-content-tertiary uppercase tracking-wider font-semibold mb-2">AI Confidence Score</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-display-md font-display ${selected.score >= 90 ? "text-emerald-600" : selected.score >= 70 ? "text-amber-600" : "text-red-600"}`}>{selected.score}%</span>
                                                <span className="text-body-sm text-content-secondary">Likely genuine</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white dark:bg-surface-dark-card rounded-full mt-2 overflow-hidden shadow-inner">
                                                <motion.div
                                                    className={`h-full rounded-full ${selected.score >= 90 ? "bg-emerald-500" : selected.score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${selected.score}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-heading-sm mb-4">Verification Documents</h3>
                                    <div className="space-y-4">
                                        <AIResultCard
                                            documentName="Medical Council License (Form A)"
                                            uploadedAt={selected.submitted}
                                            confidenceScore={selected.score}
                                            recommendation={selected.score >= 90 ? "likely_genuine" : selected.score >= 70 ? "needs_review" : "resubmit"}
                                            extractedFields={[
                                                { label: "Provider Name", value: selected.name, match: "match" },
                                                { label: "License Number", value: selected.profile.license, match: "match" },
                                                { label: "Issuing Authority", value: "Medical Council of India", match: "match" },
                                                { label: "Expiry Date", value: "10 Jan 2030", match: "match" }
                                            ]}
                                            detectedIssues={selected.score < 80 ? [{ severity: "high", description: "Tampering detected in header background" }] : []}
                                            fraudRisk={selected.score >= 90 ? "minimal" : selected.score >= 70 ? "low" : "high"}
                                            fraudDetails={selected.score < 80 ? ["Metadata mismatch discovered", "Signature extraction failed"] : ["All security markers present"]}
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-surface-secondary dark:bg-surface-dark-elevated rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <User className="w-10 h-10 text-content-tertiary" />
                                </div>
                                <h3 className="text-heading-sm text-content-primary dark:text-content-dark-primary">Select a Provider</h3>
                                <p className="text-body-sm text-content-secondary mt-1">Choose a pending application from the list to review their documents</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

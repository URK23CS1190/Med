"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, GraduationCap, Shield, Eye, Camera, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Card, Button, Badge, Avatar, StatusBadge, AIResultCard } from "@/components/ui";

const profile = {
    name: "Nurse Kavitha Reddy", registration: "TNMC/2020/18294", council: "Tamil Nadu Nursing Council",
    email: "kavitha.r@hospital.com", phone: "+91 87654 32109", dob: "1992-03-22", gender: "Female",
    qualification: "B.Sc Nursing", university: "Christian Medical College, Vellore", passingYear: 2014,
    experience: 10, hospital: "Lilavati Hospital", ward: "Cardiology ICU", designation: "Senior Staff Nurse",
    specializations: ["Critical Care", "Cardiac Nursing", "IV Therapy"],
    languages: ["English", "Hindi", "Tamil"],
};

const docs = [
    { name: "Nursing License Certificate", status: "verified", score: 97, date: "10 Jan 2025" },
    { name: "Government Photo ID", status: "verified", score: 99, date: "10 Jan 2025" },
    { name: "B.Sc Nursing Degree", status: "verified", score: 95, date: "10 Jan 2025" },
    { name: "BLS/ACLS Certification", status: "under_review", score: 88, date: "12 Jan 2025" },
    { name: "Hospital ID Badge", status: "verified", score: 96, date: "10 Jan 2025" },
];

const verifiedCount = docs.filter(d => d.status === "verified").length;

export default function NurseProfile() {
    const [expandedDoc, setExpandedDoc] = useState<number | null>(null);
    const [openSection, setOpenSection] = useState("personal");

    return (
        <div className="space-y-6">
            <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Profile & Verification</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Completion Ring */}
                <Card padding="md" className="flex flex-col items-center text-center">
                    <div className="relative w-28 h-28 mb-4">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                            <motion.circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round" className="stroke-teal-500"
                                strokeDasharray={2 * Math.PI * 42} initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - (verifiedCount / docs.length)) }} transition={{ duration: 1.5 }}
                            />
                        </svg>
                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-display-sm font-bold text-teal-600">{Math.round((verifiedCount / docs.length) * 100)}%</span>
                            <span className="text-caption text-content-tertiary">Verified</span>
                        </span>
                    </div>
                    <StatusBadge status={verifiedCount === docs.length ? "verified" : "needs_review"} label={`${verifiedCount}/${docs.length} verified`} size="md" />
                </Card>

                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-3">
                    <Card padding="md">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar fallback={profile.name} size="lg" />
                                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg"><Camera className="w-3.5 h-3.5" /></button>
                            </div>
                            <div>
                                <h2 className="text-heading-md">{profile.name}</h2>
                                <p className="text-body-sm text-content-secondary">{profile.designation} • {profile.ward}</p>
                                <Badge variant="info" className="mt-1">{profile.registration}</Badge>
                            </div>
                        </div>
                    </Card>

                    {[
                        {
                            key: "personal", title: "Personal Info", icon: <User className="w-5 h-5" />, content: (
                                <div className="grid grid-cols-2 gap-4 text-body-sm">
                                    <div><span className="text-content-tertiary">Email</span><p className="font-medium">{profile.email}</p></div>
                                    <div><span className="text-content-tertiary">Phone</span><p className="font-medium">{profile.phone}</p></div>
                                    <div><span className="text-content-tertiary">DOB</span><p className="font-medium">{profile.dob}</p></div>
                                    <div><span className="text-content-tertiary">Gender</span><p className="font-medium">{profile.gender}</p></div>
                                </div>
                            )
                        },
                        {
                            key: "professional", title: "Professional", icon: <GraduationCap className="w-5 h-5" />, content: (
                                <div className="grid grid-cols-2 gap-4 text-body-sm">
                                    <div><span className="text-content-tertiary">Qualification</span><p className="font-medium">{profile.qualification}</p></div>
                                    <div><span className="text-content-tertiary">University</span><p className="font-medium">{profile.university}</p></div>
                                    <div><span className="text-content-tertiary">Experience</span><p className="font-medium">{profile.experience} years</p></div>
                                    <div><span className="text-content-tertiary">Hospital</span><p className="font-medium">{profile.hospital}</p></div>
                                    <div className="col-span-2"><span className="text-content-tertiary">Specializations</span>
                                        <div className="flex gap-1.5 mt-1">{profile.specializations.map(s => <Badge key={s} variant="info">{s}</Badge>)}</div>
                                    </div>
                                </div>
                            )
                        },
                    ].map(section => (
                        <Card key={section.key} padding="none">
                            <button onClick={() => setOpenSection(openSection === section.key ? "" : section.key)} className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3"><span className="text-teal-500">{section.icon}</span><span className="font-semibold">{section.title}</span></div>
                                {openSection === section.key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {openSection === section.key && <div className="px-4 pb-4">{section.content}</div>}
                        </Card>
                    ))}
                </div>
            </div>

            {/* Documents */}
            <h2 className="text-heading-md font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-teal-500" /> Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map((doc, i) => (
                    <Card key={i} padding="md" className={`border-l-4 ${doc.status === "verified" ? "border-l-emerald-500" : "border-l-blue-500"}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-body-md font-semibold flex items-center gap-2"><FileText className="w-4 h-4" />{doc.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <StatusBadge status={doc.status === "verified" ? "verified" : "under_review"} />
                                    <span className="text-caption text-content-tertiary">Score: <span className="font-bold text-emerald-600">{doc.score}/100</span></span>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => setExpandedDoc(expandedDoc === i ? null : i)}><Eye className="w-4 h-4" /></Button>
                        </div>
                        {expandedDoc === i && (
                            <div className="mt-3">
                                <AIResultCard documentName={doc.name} uploadedAt={doc.date} confidenceScore={doc.score}
                                    recommendation={doc.score >= 90 ? "likely_genuine" : "needs_review"}
                                    extractedFields={[{ label: "Name", value: profile.name, match: "match" }, { label: "Reg #", value: profile.registration, match: "match" }]}
                                    detectedIssues={[]} fraudRisk="minimal" fraudDetails={["No anomalies detected"]}
                                />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}

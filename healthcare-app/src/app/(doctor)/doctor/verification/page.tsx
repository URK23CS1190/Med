"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, AlertTriangle, Upload, FileText, MessageSquare } from "lucide-react";
import { Card, Button, Badge, StatusBadge, AIResultCard, AdvancedProofUploader } from "@/components/ui";
import { useState } from "react";

const docs = [
    { name: "Medical License Certificate", status: "verified" as const, score: 96, uploadDate: "12 Jan 2025", reviewer: "Priya Sharma", version: 2 },
    { name: "Government Photo ID (Aadhaar)", status: "verified" as const, score: 98, uploadDate: "12 Jan 2025", reviewer: "Priya Sharma", version: 1 },
    { name: "MBBS Degree Certificate", status: "verified" as const, score: 94, uploadDate: "12 Jan 2025", reviewer: "Deepak M.", version: 1 },
    { name: "Hospital Affiliation Letter", status: "resubmit" as const, score: 62, uploadDate: "12 Jan 2025", reviewer: "", version: 1, rejectReason: "Letterhead not visible, doctor name partially cut off" },
    { name: "Profile Photo", status: "verified" as const, score: 99, uploadDate: "12 Jan 2025", reviewer: "Auto-approved", version: 1 },
    { name: "Specialization Certificate", status: "under_review" as const, score: 84, uploadDate: "13 Jan 2025", reviewer: "", version: 1 },
];

const verifiedCount = docs.filter(d => d.status === "verified").length;
const trustScore = Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length);

export default function DoctorVerification() {
    const [expandedDoc, setExpandedDoc] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">AI Credential Verification</h1>

            {/* Overview */}
            <Card padding="md" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status="needs_review" label={`PARTIAL — ${verifiedCount} of ${docs.length} verified`} size="md" />
                        </div>
                        <p className="text-body-sm text-content-secondary">Overall Trust Score: <span className="font-bold text-primary-600">{trustScore}/100</span></p>
                        <p className="text-caption text-content-tertiary">Last reviewed: 13 Jan 2025 · Profile visibility: LIMITED</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setExpandedDoc(999)} leftIcon={<Upload className="w-4 h-4" />}>Upload Document</Button>
                        <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>Contact Support</Button>
                    </div>
                </div>
            </Card>

            <AnimatePresence>
                {expandedDoc === 999 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <AdvancedProofUploader 
                            documentName="New Document" 
                            onUploadSuccess={() => setTimeout(() => setExpandedDoc(null), 3000)} 
                            onUploadError={(err: string) => console.error(err)} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Verification Timeline */}
            <Card padding="md">
                <h3 className="text-body-md font-semibold mb-4">Verification Progress</h3>
                <div className="flex items-center justify-between px-4">
                    {["Upload", "AI Scan", "Admin Review", "Final", "Active"].map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${i <= 1 ? "bg-primary-500 text-white" : i === 2 ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-content-tertiary"}`}>
                                {["📤", "🤖", "👁️", "✅", "🎉"][i]}
                            </div>
                            <span className="text-[10px] text-content-tertiary">{step}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Documents */}
            <div className="space-y-4">
                {docs.map((doc, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card padding="none" className={`border-l-4 ${doc.status === "verified" ? "border-l-emerald-500" : doc.status === "resubmit" ? "border-l-red-500" : "border-l-blue-500"}`}>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-body-md font-semibold flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> {doc.name}
                                            {doc.version > 1 && <Badge variant="info" className="text-[10px]">v{doc.version}</Badge>}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2 text-caption text-content-tertiary">
                                            <StatusBadge status={doc.status === "resubmit" ? "resubmit" : doc.status === "under_review" ? "under_review" : "verified"} />
                                            <span>Score: <span className={`font-bold ${doc.score >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{doc.score}/100</span></span>
                                            <span>Uploaded: {doc.uploadDate}</span>
                                            {doc.reviewer && <span>Reviewer: {doc.reviewer}</span>}
                                        </div>
                                        {doc.rejectReason && (
                                            <div className="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-body-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {doc.rejectReason}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => setExpandedDoc(expandedDoc === i ? null : i)}>
                                            <Eye className="w-4 h-4" /> AI Report
                                        </Button>
                                        {doc.status === "resubmit" && <Button size="sm" leftIcon={<Upload className="w-3 h-3" />}>Re-upload</Button>}
                                    </div>
                                </div>
                            </div>
                            {expandedDoc === i && (
                                <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                                    <AIResultCard
                                        documentName={doc.name} uploadedAt={doc.uploadDate} fileHash="a3f9b2c4"
                                        confidenceScore={doc.score}
                                        recommendation={doc.score >= 90 ? "likely_genuine" : doc.score >= 70 ? "needs_review" : "resubmit"}
                                        extractedFields={[
                                            { label: "Name", value: "Dr. Arjun Mehta", match: "match", note: "Matches" },
                                            { label: "Reg #", value: "MCI/2019/07342", match: "match", note: "Exact match" },
                                            { label: "Issuing Body", value: "Medical Council India", match: "match" },
                                        ]}
                                        detectedIssues={doc.score < 90 ? [{ severity: "medium", description: "Seal area unclear" }] : []}
                                        fraudRisk="low"
                                        fraudDetails={["ELA: No artifacts", "Font: Uniform"]}
                                    />
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-content-tertiary italic text-center leading-relaxed">
                ⚠️ This automated analysis is AI-assisted and may not be accurate. All credentials are subject to mandatory human review before final approval.
            </p>
        </div>
    );
}

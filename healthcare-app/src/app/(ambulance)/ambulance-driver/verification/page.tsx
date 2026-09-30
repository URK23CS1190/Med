"use client";

import { motion } from "framer-motion";
import { Eye, Upload, FileText, MessageSquare } from "lucide-react";
import { Card, Button, StatusBadge, AIResultCard, AdvancedProofUploader } from "@/components/ui";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const docs = [
    { name: "Driving License", status: "verified" as const, score: 98, date: "08 Jan 2025" },
    { name: "Government Photo ID (Aadhaar)", status: "verified" as const, score: 99, date: "08 Jan 2025" },
    { name: "Vehicle Registration Certificate", status: "verified" as const, score: 95, date: "08 Jan 2025" },
    { name: "Vehicle Insurance", status: "verified" as const, score: 96, date: "08 Jan 2025" },
    { name: "Fitness Certificate", status: "under_review" as const, score: 82, date: "12 Jan 2025" },
    { name: "Emergency Medical Technician (EMT) Certificate", status: "resubmit" as const, score: 58, date: "12 Jan 2025", reason: "Certificate partially obscured, expiry date not readable" },
];

export default function AmbulanceVerification() {
    const [expanded, setExpanded] = useState<number | null>(null);
    const verified = docs.filter(d => d.status === "verified").length;

    return (
        <div className="space-y-6">
            <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">AI Credential Verification</h1>

            <Card padding="md" className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-100 dark:border-red-800">
                <div className="flex items-center justify-between">
                    <div>
                        <StatusBadge status="needs_review" label={`${verified}/${docs.length} verified`} size="md" />
                        <p className="text-body-sm text-content-secondary mt-1">Trust Score: <span className="font-bold text-red-600">{Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length)}/100</span></p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setExpanded(999)} leftIcon={<Upload className="w-4 h-4" />}>Upload</Button>
                        <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>Support</Button>
                    </div>
                </div>
            </Card>

            <AnimatePresence>
                {expanded === 999 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <AdvancedProofUploader 
                            documentName="New Document" 
                            onUploadSuccess={() => setTimeout(() => setExpanded(null), 3000)} 
                            onUploadError={(err: string) => console.error(err)} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {docs.map((doc, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card padding="none" className={`border-l-4 ${doc.status === "verified" ? "border-l-emerald-500" : doc.status === "resubmit" ? "border-l-red-500" : "border-l-blue-500"}`}>
                            <div className="p-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-body-md font-semibold flex items-center gap-2"><FileText className="w-4 h-4" />{doc.name}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <StatusBadge status={doc.status === "verified" ? "verified" : doc.status === "resubmit" ? "resubmit" : "under_review"} />
                                        <span className="text-caption">Score: <span className={`font-bold ${doc.score >= 80 ? "text-emerald-600" : "text-red-600"}`}>{doc.score}/100</span></span>
                                    </div>
                                    {"reason" in doc && doc.reason && <p className="text-body-sm text-red-600 mt-2 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">{doc.reason}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => setExpanded(expanded === i ? null : i)}><Eye className="w-4 h-4" /></Button>
                                    {doc.status === "resubmit" && <Button size="sm" leftIcon={<Upload className="w-3 h-3" />}>Re-upload</Button>}
                                </div>
                            </div>
                            {expanded === i && (
                                <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                                    <AIResultCard documentName={doc.name} uploadedAt={doc.date} confidenceScore={doc.score}
                                        recommendation={doc.score >= 90 ? "likely_genuine" : doc.score >= 70 ? "needs_review" : "resubmit"}
                                        extractedFields={[{ label: "Name", value: "Rajesh Patil", match: "match" }, { label: "Vehicle", value: "KA-01-MH-5678", match: "match" }]}
                                        detectedIssues={doc.score < 80 ? [{ severity: "high", description: "Document partially obscured" }] : []}
                                        fraudRisk={doc.score >= 90 ? "minimal" : "low"} fraudDetails={["No tampering detected"]}
                                    />
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Eye, XCircle, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ExtractedField {
    label: string;
    value: string;
    match: "match" | "mismatch" | "warning" | "neutral";
    note?: string;
}

interface DetectedIssue {
    severity: "low" | "medium" | "high" | "critical";
    description: string;
}

interface AIResultCardProps {
    documentName: string;
    uploadedAt: string;
    fileHash?: string;
    confidenceScore: number;
    recommendation: "likely_genuine" | "needs_review" | "likely_fake" | "incomplete" | "expired" | "resubmit";
    extractedFields: ExtractedField[];
    detectedIssues: DetectedIssue[];
    fraudRisk: "minimal" | "low" | "moderate" | "high" | "critical";
    fraudDetails?: string[];
    onResubmit?: () => void;
    onEscalate?: () => void;
    onApprove?: () => void;
    className?: string;
}

const sevColor: Record<string, string> = {
    low: "text-emerald-600 dark:text-emerald-400",
    medium: "text-amber-600 dark:text-amber-400",
    high: "text-red-600 dark:text-red-400",
    critical: "text-red-700 dark:text-red-300",
};
const sevIcon: Record<string, string> = { low: "🟢", medium: "🟡", high: "🔴", critical: "🔴" };
const matchIcon: Record<string, React.ReactNode> = {
    match: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    mismatch: <XCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    neutral: <Eye className="w-4 h-4 text-gray-400" />,
};

export function AIResultCard({
    documentName, uploadedAt, fileHash, confidenceScore, recommendation,
    extractedFields, detectedIssues, fraudRisk, fraudDetails,
    onResubmit, onEscalate, onApprove, className = ""
}: AIResultCardProps) {
    const scoreColor = confidenceScore >= 80 ? "text-emerald-500" : confidenceScore >= 60 ? "text-amber-500" : "text-red-500";
    const strokeColor = confidenceScore >= 80 ? "stroke-emerald-500" : confidenceScore >= 60 ? "stroke-amber-500" : "stroke-red-500";
    const circumference = 2 * Math.PI * 40;
    const dashOffset = circumference - (confidenceScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card-base overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        📄 {documentName}
                    </h3>
                    <p className="text-caption text-content-tertiary mt-0.5">
                        Uploaded: {uploadedAt} {fileHash && `· SHA: ${fileHash.slice(0, 8)}…`}
                    </p>
                </div>
                <StatusBadge status={recommendation} size="md" />
            </div>

            {/* Score Ring */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-content-tertiary mb-3">Confidence Score</p>
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                            <motion.circle
                                cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round"
                                className={strokeColor}
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: dashOffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-heading-md font-bold ${scoreColor}`}>
                            {confidenceScore}
                        </span>
                    </div>
                    <div>
                        <p className={`text-heading-sm font-bold ${scoreColor}`}>{confidenceScore} / 100</p>
                        <StatusBadge status={recommendation} size="sm" />
                    </div>
                </div>
            </div>

            {/* Extracted Fields */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-content-tertiary mb-3">Extracted Fields</p>
                <div className="space-y-2">
                    {extractedFields.map((field, i) => (
                        <div key={i} className="flex items-start justify-between gap-2 py-1.5">
                            <span className="text-body-sm text-content-secondary min-w-[120px]">{field.label}:</span>
                            <span className="text-body-sm font-medium text-content-primary dark:text-content-dark-primary flex-1">{field.value}</span>
                            <div className="flex items-center gap-1.5">
                                {matchIcon[field.match]}
                                {field.note && <span className="text-[11px] text-content-tertiary">{field.note}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Issues */}
            {detectedIssues.length > 0 && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-content-tertiary mb-3">Detected Issues</p>
                    <div className="space-y-2">
                        {detectedIssues.map((issue, i) => (
                            <div key={i} className={`flex items-start gap-2 text-body-sm ${sevColor[issue.severity]}`}>
                                <span>{sevIcon[issue.severity]}</span>
                                <span className="font-medium uppercase text-[11px] min-w-[60px]">{issue.severity}</span>
                                <span className="text-content-primary dark:text-content-dark-primary">{issue.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Fraud Signals */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Fraud Signals</p>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${fraudRisk === "minimal" || fraudRisk === "low" ? "text-emerald-600" : fraudRisk === "moderate" ? "text-amber-600" : "text-red-600"}`}>
                        {fraudRisk === "minimal" || fraudRisk === "low" ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        Tampering Risk: {fraudRisk.toUpperCase()}
                    </span>
                </div>
                {fraudDetails && fraudDetails.map((d, i) => (
                    <p key={i} className="text-body-sm text-content-secondary py-0.5">{d}</p>
                ))}
            </div>

            {/* Actions */}
            <div className="p-4 flex flex-wrap gap-2">
                {onResubmit && (
                    <button onClick={onResubmit} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition-colors">
                        <RefreshCw className="w-4 h-4" /> Request Resubmission
                    </button>
                )}
                {onEscalate && (
                    <button onClick={onEscalate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 transition-colors">
                        <AlertTriangle className="w-4 h-4" /> Escalate to Admin
                    </button>
                )}
                {onApprove && (
                    <button onClick={onApprove} className="flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 transition-colors">
                        <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                )}
            </div>

            {/* Disclaimer */}
            <div className="px-4 pb-4">
                <p className="text-[10px] text-content-tertiary italic leading-relaxed">
                    ⚠️ This automated analysis is AI-assisted and may not be accurate. All credentials are subject to mandatory human review before final approval.
                </p>
            </div>
        </motion.div>
    );
}

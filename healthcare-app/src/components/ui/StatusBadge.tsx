"use client";

import { CheckCircle, Clock, XCircle, AlertTriangle, Eye, Ban, Loader2, ShieldCheck, ShieldAlert, FileWarning } from "lucide-react";

type StatusType =
    | "pending" | "active" | "verified" | "rejected" | "under_review" | "suspended"
    | "completed" | "in_progress" | "cancelled" | "expired" | "draft"
    | "critical" | "stable" | "available" | "offline" | "busy"
    | "low" | "medium" | "high" | "minimal"
    | "likely_genuine" | "needs_review" | "likely_fake" | "incomplete" | "resubmit" | "inactive";

const statusConfig: Record<StatusType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: { label: "Pending", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: <Clock className="w-3.5 h-3.5" /> },
    active: { label: "Active", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    verified: { label: "Verified", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    rejected: { label: "Rejected", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", icon: <XCircle className="w-3.5 h-3.5" /> },
    under_review: { label: "Under Review", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: <Eye className="w-3.5 h-3.5" /> },
    suspended: { label: "Suspended", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", icon: <Ban className="w-3.5 h-3.5" /> },
    completed: { label: "Completed", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    in_progress: { label: "In Progress", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
    cancelled: { label: "Cancelled", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-900/20", icon: <XCircle className="w-3.5 h-3.5" /> },
    expired: { label: "Expired", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    draft: { label: "Draft", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800", icon: <Clock className="w-3.5 h-3.5" /> },
    critical: { label: "Critical", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    stable: { label: "Stable", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    available: { label: "Available", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    offline: { label: "Offline", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800", icon: <Ban className="w-3.5 h-3.5" /> },
    busy: { label: "Busy", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: <Clock className="w-3.5 h-3.5" /> },
    low: { label: "Low", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    medium: { label: "Medium", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    high: { label: "High", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    minimal: { label: "Minimal", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    likely_genuine: { label: "Likely Genuine", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    needs_review: { label: "Needs Review", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: <Eye className="w-3.5 h-3.5" /> },
    likely_fake: { label: "Suspicious", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    incomplete: { label: "Incomplete", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: <FileWarning className="w-3.5 h-3.5" /> },
    resubmit: { label: "Resubmit", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: <Loader2 className="w-3.5 h-3.5" /> },
    inactive: { label: "Inactive", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800", icon: <Ban className="w-3.5 h-3.5" /> },
};

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    size?: "sm" | "md";
    pulse?: boolean;
    className?: string;
}

export function StatusBadge({ status, label, size = "sm", pulse, className = "" }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 ${size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} font-semibold rounded-full ${config.bg} ${config.color} ${className}`}>
            {pulse && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" /><span className="relative inline-flex rounded-full h-2 w-2 bg-current" /></span>}
            {config.icon}
            {label || config.label}
        </span>
    );
}

"use client";


import { ShieldCheck, Clock, FileText, Bell, RefreshCw } from "lucide-react";
import { Card, Button, Badge, StatusBadge, DataTable } from "@/components/ui";

type AuditLog = {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    impact: "low" | "medium" | "high";
    details: string;
};

const auditData: AuditLog[] = [
    { id: "LOG-102", action: "Inventory Adjustment", user: "Priya Reddy", timestamp: "Today, 10:45 AM", impact: "medium", details: "Manual stock correction for Dolo 650 (+50 units due to count error)." },
    { id: "LOG-101", action: "User Access", user: "System", timestamp: "Today, 08:00 AM", impact: "low", details: "Pharmacy store 'MedPlus BKC' opened for operations." },
    { id: "LOG-100", action: "Medicine Deletion", user: "Priya Reddy", timestamp: "Yesterday, 04:30 PM", impact: "high", details: "Removed 'Obsolete Med X' from active inventory catalog." },
];

export default function PharmacyCompliance() {
    const columns = [
        { key: "time", label: "Timestamp", render: (row: AuditLog) => <span className="text-caption text-content-tertiary">{row.timestamp}</span> },
        { 
            key: "action", 
            label: "Action", 
            render: (row: AuditLog) => (
                <div>
                    <div className="font-semibold text-body-sm">{row.action}</div>
                    <div className="text-[10px] text-content-tertiary">ID: {row.id}</div>
                </div>
            ) 
        },
        { key: "user", label: "User", render: (row: AuditLog) => <div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">DR</div><span className="text-body-sm">{row.user}</span></div> },
        { key: "details", label: "Details", render: (row: AuditLog) => <p className="text-caption text-content-secondary line-clamp-1 max-w-[300px]">{row.details}</p> },
        { key: "impact", label: "Impact", render: (row: AuditLog) => <Badge variant={row.impact === "high" ? "danger" : row.impact === "medium" ? "warning" : "info"} size="sm">{row.impact.toUpperCase()}</Badge> },
        { key: "actions", label: "", render: () => <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><FileText className="w-4 h-4 text-content-tertiary" /></Button> }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Compliance & Audit</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Monitor inventory health, license status, and system security logs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh Stats</Button>
                    <Button size="sm" leftIcon={<FileText className="w-4 h-4" />}>Download Report</Button>
                </div>
            </div>

            {/* Critical Alerts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card padding="md" className="border-red-100 bg-red-50/30 dark:border-red-900/40 dark:bg-red-900/10">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-body-md font-semibold text-red-700 dark:text-red-400 flex items-center gap-2"><Bell className="w-4 h-4 animate-pulse" /> Stock & Expiry Alerts</h3>
                        <Badge variant="danger">5 Critical</Badge>
                    </div>
                    <div className="space-y-3">
                        {[
                            { item: "Augmentin Injection", issue: "Expiring in 3 days", code: "LOT-88229" },
                            { item: "Refresh Tears Drops", issue: "Out of Stock", code: "LOT-11920" },
                            { item: "Zydus Insulin", issue: "Storage temp violation (+8°C)", code: "LOT-00123" },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-red-100 dark:border-red-900/50 shadow-sm">
                                <div>
                                    <p className="text-body-sm font-bold text-content-primary">{a.item}</p>
                                    <p className="text-caption text-red-600 font-medium">{a.issue} • {a.code}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">Resolve</Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-red-600">View All 12 Warnings</Button>
                </Card>

                <Card padding="md">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-body-md font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> License & Regulatory</h3>
                        <StatusBadge status="verified" label="Compliant" size="sm" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "FDA Drug Retail License", expiry: "12 Jan 2028", status: "Active" },
                            { name: "Narcotics Handling Permit", expiry: "05 Aug 2026", status: "Active" },
                            { name: "Pharmacy Store GSTIN", expiry: "N/A", status: "Verified" },
                        ].map((l, i) => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-content-tertiary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-body-sm font-semibold">{l.name}</p>
                                    <p className="text-caption text-content-tertiary">Valid till: {l.expiry}</p>
                                </div>
                                <Badge variant="info" size="sm">{l.status}</Badge>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-2">Manage Permits</Button>
                </Card>
            </div>

            {/* Audit Logs */}
            <Card padding="none" className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-body-md font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" /> Audit Trail</h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8">Today</Button>
                        <Button variant="ghost" size="sm" className="h-8">Security Only</Button>
                    </div>
                </div>
                <DataTable columns={columns} data={auditData} />
            </Card>
        </div>
    );
}

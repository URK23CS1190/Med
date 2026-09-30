"use client";

import { motion } from "framer-motion";
import {
    Users, Building2, ShieldCheck, Flag,
    ArrowUpRight,
    Eye, ChevronRight
} from "lucide-react";
import { Card, CardTitle, Badge, Avatar, Button } from "@/components/ui";

const stats = [
    { label: "Total Users", value: "12,458", change: "+234", icon: <Users className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Active Providers", value: "842", change: "+18", icon: <ShieldCheck className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Hospitals", value: "156", change: "+3", icon: <Building2 className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Pending Reviews", value: "23", change: "", icon: <Flag className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
];

const pendingProviders = [
    { id: "1", name: "Dr. Kavitha Nair", type: "Doctor", specialty: "Oncology", submitted: "2 hours ago", documents: 3 },
    { id: "2", name: "MedPlus Pharmacy", type: "Pharmacy", specialty: "Retail", submitted: "5 hours ago", documents: 4 },
    { id: "3", name: "Dr. Sanjay Reddy", type: "Doctor", specialty: "Cardiology", submitted: "1 day ago", documents: 3 },
];

const recentAuditLogs = [
    { action: "PROVIDER_VERIFIED", actor: "Admin", target: "Dr. Amit Shah", time: "10 min ago" },
    { action: "BED_UPDATED", actor: "Apollo Admin", target: "ICU Beds: 5→3", time: "25 min ago" },
    { action: "ORDER_CANCELLED", actor: "System", target: "Order #4521", time: "1 hour ago" },
    { action: "RECORD_ACCESSED", actor: "Dr. Priya Sharma", target: "Patient: Rahul V.", time: "2 hours ago" },
];

const actionColors: Record<string, string> = {
    PROVIDER_VERIFIED: "text-green-500",
    BED_UPDATED: "text-blue-500",
    ORDER_CANCELLED: "text-red-500",
    RECORD_ACCESSED: "text-amber-500",
};

export default function SuperAdminDashboard() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Admin Dashboard</h1>
                <p className="text-body-md text-content-secondary mt-1">Platform overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-start justify-between">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                            {stat.change && (
                                <span className="flex items-center gap-0.5 text-caption text-green-500 font-medium">
                                    <ArrowUpRight className="w-3 h-3" /> {stat.change}
                                </span>
                            )}
                        </div>
                        <p className="text-display-sm font-display text-content-primary dark:text-content-dark-primary mt-3">{stat.value}</p>
                        <p className="text-caption text-content-tertiary">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Providers */}
                <Card padding="none">
                    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <CardTitle>Pending Provider Approvals</CardTitle>
                        <Badge variant="warning" dot pulse>{pendingProviders.length} pending</Badge>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {pendingProviders.map((p) => (
                            <div key={p.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <Avatar fallback={p.name} size="md" />
                                <div className="flex-1">
                                    <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary">{p.name}</p>
                                    <p className="text-caption text-content-tertiary">{p.type} • {p.specialty} • {p.submitted}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                                    <Button size="sm" variant="success">Approve</Button>
                                    <Button size="sm" variant="destructive">Reject</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Audit Logs */}
                <Card padding="none">
                    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <CardTitle>Recent Activity</CardTitle>
                        <Button size="sm" variant="ghost">View All <ChevronRight className="w-3 h-3" /></Button>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {recentAuditLogs.map((log, i) => (
                            <div key={i} className="p-4 flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${actionColors[log.action]?.replace('text-', 'bg-') || 'bg-gray-400'}`} />
                                <div className="flex-1">
                                    <p className="text-body-sm text-content-primary dark:text-content-dark-primary">
                                        <span className={`font-semibold ${actionColors[log.action] || ''}`}>{log.action}</span>
                                        {" "}{log.target}
                                    </p>
                                    <p className="text-caption text-content-tertiary">{log.actor} • {log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}

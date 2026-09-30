"use client";

import { motion } from "framer-motion";
import {
    Settings, Shield, Database, Bell,
    Globe, Info, Activity,
    Save, ChevronRight, FileText,
    Clock, User
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { useState } from "react";

const auditLogs = [
    { id: "LOG-901", action: "PROVIDER_VERIFIED", actor: "Super Admin (You)", target: "Dr. Kavitha Nair", time: "10 min ago", severity: "info" },
    { id: "LOG-900", action: "SYSTEM_CONFIG_UPDATED", actor: "Super Admin (You)", target: "MFA Enforcement: ON", time: "1 hour ago", severity: "warning" },
    { id: "LOG-899", action: "HOSPITAL_ONBOARDED", actor: "Admin Sunil", target: "Lilavati Hospital", time: "3 hours ago", severity: "info" },
    { id: "LOG-898", action: "CRITICAL_STOCK_ALERT", actor: "System", target: "Apollo: Paracetamol IV", time: "5 hours ago", severity: "error" },
    { id: "LOG-897", action: "USER_SUSPENDED", actor: "Super Admin (You)", target: "Anita Desai", time: "1 day ago", severity: "error" },
];

export default function SuperAdminSettings() {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <Settings className="w-8 h-8 text-primary-500" /> System Settings & Logs
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Global platform configuration and security audit trails</p>
                </div>
                <Button leftIcon={<Save className="w-4 h-4" />}>Save Global Changes</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="space-y-2">
                    {[
                        { id: "general", label: "General Config", icon: <Globe className="w-4 h-4" /> },
                        { id: "security", label: "Security & MFA", icon: <Shield className="w-4 h-4" /> },
                        { id: "notifications", label: "System Alerts", icon: <Bell className="w-4 h-4" /> },
                        { id: "backup", label: "Data & Backups", icon: <Database className="w-4 h-4" /> },
                        { id: "logs", label: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-semibold transition-all ${activeTab === tab.id
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                                : "bg-white dark:bg-surface-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-content-secondary"
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === "logs" ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <Card padding="md">
                                    <h3 className="text-body-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary-500" /> Platform Audit Trail</h3>
                                    <div className="space-y-3">
                                        {auditLogs.map((log) => (
                                            <div key={log.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-surface-dark-elevated flex items-start gap-4">
                                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${log.severity === 'error' ? 'bg-red-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-body-sm text-content-primary dark:text-content-dark-primary">
                                                        <span className="font-bold">{log.action}</span> • {log.target}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-caption text-content-tertiary">
                                                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.actor}</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{log.time}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" size="sm" className="font-mono">{log.id}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full mt-4" rightIcon={<ChevronRight className="w-4 h-4" />}>Load More Logs</Button>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <Card padding="lg">
                                    <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2 capitalize">{activeTab} Settings</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-body-md font-semibold">Enforce Global 2FA</p>
                                                <p className="text-body-sm text-content-tertiary">Require all healthcare providers to use multi-factor authentication</p>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-emerald-500 relative transition-all cursor-pointer shadow-inner">
                                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-body-md font-semibold">AI Auto-Rejection</p>
                                                <p className="text-body-sm text-content-tertiary">Automatically reject documents with AI confidence score below 40%</p>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-all cursor-pointer shadow-inner">
                                                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-body-md font-semibold">Emergency Broadcast Radius</p>
                                                <p className="text-body-sm text-content-tertiary">Radius in KM to notify ambulance drivers for critical emergencies</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="number" defaultValue={10} className="w-20 h-10 text-center rounded-xl bg-gray-50 dark:bg-surface-dark-elevated border-0 font-bold" />
                                                <span className="text-body-sm font-semibold">KM</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card padding="md" className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 shadow-none">
                                    <div className="flex items-start gap-3 text-blue-700 dark:text-blue-400">
                                        <Info className="w-5 h-5 shrink-0" />
                                        <p className="text-body-sm font-medium">Global settings affect all users immediately. Automated reports will be generated every 24 hours.</p>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

import { AnimatePresence } from "framer-motion";

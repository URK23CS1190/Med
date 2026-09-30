"use client";

import { motion } from "framer-motion";
import {
    Package, AlertTriangle, TrendingUp, DollarSign, ClipboardList, Pill, Clock,
    ArrowRight, Bell, ScanLine, FileCheck
} from "lucide-react";
import { Card, Button, Badge, StatCard } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";
import { useAuthStore } from "@/stores";

const alerts = [
    { type: "expiry", icon: "🔴", text: "3 medicines expiring within 30 days", urgent: true },
    { type: "stock", icon: "🟡", text: "Paracetamol 500mg — Stock below reorder level (45 units)", urgent: true },
    { type: "order", icon: "🔵", text: "5 new prescriptions awaiting fulfillment", urgent: false },
    { type: "delivery", icon: "🟢", text: "2 deliveries out for dispatch", urgent: false },
];

const revenueData = [
    { month: "Aug", revenue: 245000 }, { month: "Sep", revenue: 268000 }, { month: "Oct", revenue: 252000 },
    { month: "Nov", revenue: 278000 }, { month: "Dec", revenue: 295000 }, { month: "Jan", revenue: 312000 },
];

const categoryData = [
    { name: "Prescription", value: 55, color: "#3B82F6" },
    { name: "OTC", value: 25, color: "#10B981" },
    { name: "Personal Care", value: 12, color: "#8B5CF6" },
    { name: "Medical Devices", value: 8, color: "#F59E0B" },
];

const pendingRx = [
    { id: "RX-0883", patient: "Riya Sharma", doctor: "Dr. Mehta", meds: 3, time: "5 min ago", priority: "high" },
    { id: "RX-0884", patient: "Mohan Rao", doctor: "Dr. Sharma", meds: 5, time: "12 min ago", priority: "medium" },
    { id: "RX-0885", patient: "Deepa Iyer", doctor: "Dr. Patel", meds: 2, time: "30 min ago", priority: "low" },
];

export default function PharmacyDashboard() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">
                        Welcome back, {user?.full_name || "Pharmacist"} 👋
                    </h1>
                    <p className="text-body-md text-content-secondary">MedPlus Pharmacy — BKC Branch</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/pharmacy-admin/inventory"><Button variant="outline" size="sm" leftIcon={<Package className="w-4 h-4" />}>Inventory</Button></Link>
                    <Link href="/pharmacy-admin/prescriptions"><Button size="sm" leftIcon={<ClipboardList className="w-4 h-4" />}>Rx Queue</Button></Link>
                </div>
            </div>

            {/* Alerts */}
            {alerts.filter(a => a.urgent).map((alert, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${alert.type === "expiry" ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800" : "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"}`}>
                    <span className="text-lg">{alert.icon}</span>
                    <span className="text-body-sm flex-1">{alert.text}</span>
                    <Button size="sm" variant="ghost">View</Button>
                </motion.div>
            ))}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard label="Total Medicines" value="1,240" icon={<Package className="w-5 h-5" />} color="text-primary-500" bgColor="bg-primary-50 dark:bg-primary-900/20" />
                <StatCard label="Low Stock Items" value="18" icon={<AlertTriangle className="w-5 h-5" />} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20" trend={{ value: 5, label: "needs reorder" }} />
                <StatCard label="Orders Today" value="34" icon={<ClipboardList className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" delay={0.1} />
                <StatCard label="Revenue Today" value="₹12,500" icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 12, label: "vs yesterday" }} />
                
                <StatCard label="Pending Prescriptions" value="7" icon={<Pill className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Most Sold Medicine" value="Paracetamol" icon={<TrendingUp className="w-5 h-5" />} color="text-teal-500" bgColor="bg-teal-50 dark:bg-teal-900/20" delay={0.3} />
                <StatCard label="Average Order Value" value="₹368" icon={<DollarSign className="w-5 h-5" />} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-900/20" delay={0.4} />
                <StatCard label="Customer Satisfaction" value="4.5 / 5" icon={<AlertTriangle className="w-5 h-5" />} color="text-orange-500" bgColor="bg-orange-50 dark:bg-orange-900/20" delay={0.5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* OCR & AI Review */}
                <div className="lg:col-span-2 space-y-4">
                    <Card padding="md" className="bg-primary-50/50 dark:bg-primary-900/5 border-primary-200 dark:border-primary-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-body-lg font-bold flex items-center gap-2">
                                <ScanLine className="w-5 h-5 text-primary-600" /> OCR Prescription Review
                            </h2>
                            <Badge variant="info">AI Powered</Badge>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3 aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 relative overflow-hidden group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1584032797267-24855702660d?w=400&auto=format&fit=crop&q=60" alt="Prescription" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ScanLine className="w-8 h-8 mb-2" />
                                    <span className="text-body-sm font-bold">Scanning...</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-caption font-bold uppercase tracking-wider text-content-tertiary">
                                        <span>AI Extraction Results</span>
                                        <span className="text-emerald-600">98% Confidence</span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                                        <div className="flex justify-between text-body-sm">
                                            <span className="text-content-secondary">Medicine Name:</span>
                                            <span className="font-bold">Amoxicillin 500mg</span>
                                        </div>
                                        <div className="flex justify-between text-body-sm">
                                            <span className="text-content-secondary">Dosage:</span>
                                            <span className="font-bold">1-0-1 (Post Meal)</span>
                                        </div>
                                        <div className="flex justify-between text-body-sm">
                                            <span className="text-content-secondary">Duration:</span>
                                            <span className="font-bold">5 Days</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button fullWidth leftIcon={<FileCheck className="w-4 h-4" />}>Approve Rx</Button>
                                    <Button variant="outline" fullWidth>Reject</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-between">
                        <h2 className="text-heading-sm font-semibold flex items-center gap-2"><Pill className="w-5 h-5 text-primary-500" /> Pending Prescriptions</h2>
                        <Link href="/pharmacy-admin/prescriptions" className="text-body-sm text-primary-600 hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
                    </div>
                    {pendingRx.map((rx, i) => (
                        <motion.div key={rx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card variant="interactive" padding="md" className={`border-l-4 ${rx.priority === "high" ? "border-l-red-500" : rx.priority === "medium" ? "border-l-amber-500" : "border-l-emerald-500"}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-body-md font-semibold flex items-center gap-2">{rx.id} <Badge variant={rx.priority === "high" ? "danger" : rx.priority === "medium" ? "warning" : "info"}>{rx.priority}</Badge></h3>
                                        <p className="text-body-sm text-content-secondary">Patient: {rx.patient} • Dr. {rx.doctor} • {rx.meds} medicines</p>
                                        <p className="text-caption text-content-tertiary flex items-center gap-1"><Clock className="w-3 h-3" />{rx.time}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm">Process</Button>
                                        <Button size="sm" variant="ghost">View Rx</Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Alerts & Quick Links */}
                <div className="space-y-4">
                    <Card padding="md">
                        <h3 className="text-body-md font-semibold mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-primary-500" /> Notifications</h3>
                        <div className="space-y-2">
                            {alerts.map((a, i) => (
                                <div key={i} className="flex items-start gap-2 text-body-sm py-1.5">
                                    <span>{a.icon}</span><span className="text-content-secondary">{a.text}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card padding="md">
                        <h3 className="text-body-md font-semibold mb-3">Category Sales</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                                    {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie><Tooltip /></PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-1 mt-2">{categoryData.map(c => (<div key={c.name} className="flex items-center justify-between text-caption"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</div><span className="font-semibold">{c.value}%</span></div>))}</div>
                    </Card>
                </div>
            </div>

            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4"><TrendingUp className="w-5 h-5 text-emerald-500 inline mr-2" />Monthly Revenue</h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value: unknown) => [`₹${Number(value as number ?? 0).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                            <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}

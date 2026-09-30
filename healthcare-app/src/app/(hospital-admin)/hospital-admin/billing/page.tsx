"use client";

import {
    DollarSign, TrendingUp,
    Download,
    Activity,
    Wallet, FileText, Clock
} from "lucide-react";
import { Card, Button, StatCard, StatusBadge } from "@/components/ui";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from "recharts";

const revenueData = [
    { day: "Mon", revenue: 450000, overhead: 280000 },
    { day: "Tue", revenue: 520000, overhead: 310000 },
    { day: "Wed", revenue: 480000, overhead: 290000 },
    { day: "Thu", revenue: 610000, overhead: 340000 },
    { day: "Fri", revenue: 580000, overhead: 320000 },
    { day: "Sat", revenue: 350000, overhead: 210000 },
    { day: "Sun", revenue: 210000, overhead: 180000 },
];

const invoices = [
    { id: "INV-2025-012", patient: "Rahul Verma", date: "Today", amount: 45200, status: "paid", method: "Insurance (HDFC Ergo)" },
    { id: "INV-2025-011", patient: "Sanjay Mishra", date: "Today", amount: 12500, status: "pending", method: "Wait" },
    { id: "INV-2025-010", patient: "Anita Desai", date: "Yesterday", amount: 8400, status: "paid", method: "Cards" },
    { id: "INV-2025-009", patient: "Priya K.", date: "15 Jan 2025", amount: 128000, status: "failed", method: "Insurance Rejected" },
];

export default function HospitalAdminBilling() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <DollarSign className="w-8 h-8 text-primary-500" /> Financial & Billing
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Apollo Hospital — Revenue tracking and invoice management</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Financial Report</Button>
                    <Button size="sm" leftIcon={<PlusIcon className="w-4 h-4" />}>New Bill</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue (WK)" value="₹3.68M" icon={<Wallet className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 12, label: "vs last week" }} />
                <StatCard label="Operating Costs" value="₹1.93M" icon={<Activity className="w-5 h-5" />} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20" delay={0.1} />
                <StatCard label="Net Profit" value="₹1.75M" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.2} />
                <StatCard label="Pending Dues" value="₹452k" icon={<Clock className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card padding="md" className="lg:col-span-2">
                    <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Weekly Revenue vs Expenses</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="overhead" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding="md">
                    <h3 className="text-body-lg font-bold mb-6">Payment Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Insurance", value: "65%", count: "₹2.4M", color: "bg-blue-500" },
                            { label: "Direct Cash/Bank", value: "25%", count: "₹0.9M", color: "bg-emerald-500" },
                            { label: "Corporate Credit", value: "10%", count: "₹0.38M", color: "bg-purple-500" }
                        ].map((p) => (
                            <div key={p.label} className="space-y-1.5">
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-content-secondary font-medium">{p.label}</span>
                                    <span className="font-bold">{p.count}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <div className={`h-full ${p.color}`} style={{ width: p.value }} />
                                    </div>
                                    <span className="text-caption text-content-tertiary w-8">{p.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card padding="none">
                <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-body-lg font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary-500" /> Recent Invoices</h3>
                    <Button variant="ghost" size="sm">View All Invoices</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Invoice & Patient</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Amount</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Payment Method</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Status</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                                    <td className="px-5 py-4">
                                        <p className="text-body-sm font-semibold">{inv.patient}</p>
                                        <p className="text-caption text-content-tertiary">{inv.id} • {inv.date}</p>
                                    </td>
                                    <td className="px-5 py-4 text-body-sm font-bold">₹{inv.amount.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-body-sm text-content-secondary">{inv.method}</td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            status={inv.status === "paid" ? "verified" : inv.status === "pending" ? "pending" : "critical"}
                                            label={inv.status}
                                            size="sm"
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" leftIcon={<Download className="w-3 h-3" />}>PDF</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

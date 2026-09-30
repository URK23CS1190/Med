"use client";

import { DollarSign, TrendingUp, CreditCard, Download, Truck, Clock, Star } from "lucide-react";
import { Card, Button, Badge, StatCard } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyEarnings = [
    { month: "Aug", amount: 18000 }, { month: "Sep", amount: 22000 }, { month: "Oct", amount: 19500 },
    { month: "Nov", amount: 24000 }, { month: "Dec", amount: 21000 }, { month: "Jan", amount: 26500 },
];

const weeklyBreakdown = [
    { day: "Mon", emergency: 1200, transfer: 400, scheduled: 600 },
    { day: "Tue", emergency: 800, transfer: 0, scheduled: 600 },
    { day: "Wed", emergency: 1600, transfer: 400, scheduled: 0 },
    { day: "Thu", emergency: 800, transfer: 800, scheduled: 0 },
    { day: "Fri", emergency: 1200, transfer: 0, scheduled: 600 },
    { day: "Sat", emergency: 400, transfer: 0, scheduled: 0 },
];

const payouts = [
    { date: "15 Jan 2025", amount: 18500, trips: 28, mode: "UPI" },
    { date: "15 Dec 2024", amount: 21000, trips: 32, mode: "UPI" },
    { date: "15 Nov 2024", amount: 24000, trips: 38, mode: "NEFT" },
];

export default function AmbulanceEarnings() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Earnings & Safety</h1>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="This Month" value="₹26,500" icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 26, label: "vs last month" }} />
                <StatCard label="Trips" value="42" icon={<Truck className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" delay={0.1} />
                <StatCard label="Avg Response" value="4.2 min" icon={<Clock className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.2} />
                <StatCard label="Safety Score" value="95/100" icon={<Star className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="md">
                    <h3 className="text-body-lg font-semibold mb-4"><TrendingUp className="w-5 h-5 text-emerald-500 inline mr-2" />Monthly Earnings</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyEarnings}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <Tooltip formatter={(v: any) => [`₹${Number(v ?? 0).toLocaleString()}`]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                                <Bar dataKey="amount" fill="#EF4444" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding="md">
                    <h3 className="text-body-lg font-semibold mb-4">Weekly Breakdown</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                <Legend />
                                <Bar dataKey="emergency" fill="#EF4444" name="Emergency" stackId="a" />
                                <Bar dataKey="transfer" fill="#3B82F6" name="Transfer" stackId="a" />
                                <Bar dataKey="scheduled" fill="#10B981" name="Scheduled" stackId="a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Payouts */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4"><CreditCard className="w-5 h-5 text-primary-500 inline mr-2" />Payout History</h3>
                <table className="w-full text-left">
                    <thead><tr className="border-b border-gray-100 dark:border-gray-800">
                        {["Date", "Amount", "Trips", "Mode", "Status"].map(h => <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {payouts.map((p, i) => (
                            <tr key={i}><td className="px-4 py-3 text-body-sm">{p.date}</td><td className="px-4 py-3 text-body-sm font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td><td className="px-4 py-3 text-body-sm">{p.trips}</td><td className="px-4 py-3 text-body-sm">{p.mode}</td><td className="px-4 py-3"><Badge variant="success">✅ Paid</Badge></td></tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Safety Score */}
            <Card padding="md" className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10">
                <h3 className="text-body-lg font-semibold mb-4">🛡️ Safety Score Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[{ l: "Speed Compliance", v: "98%", c: "text-emerald-600" }, { l: "Route Adherence", v: "95%", c: "text-blue-600" }, { l: "Total Incidents", v: "0", c: "text-emerald-600" }, { l: "SOS Drills", v: "3/3", c: "text-emerald-600" }].map(s =>
                        <div key={s.l} className="text-center p-3 rounded-xl bg-white/60 dark:bg-surface-dark-card"><p className={`text-heading-sm font-bold ${s.c}`}>{s.v}</p><p className="text-caption text-content-tertiary">{s.l}</p></div>
                    )}
                </div>
            </Card>
        </div>
    );
}

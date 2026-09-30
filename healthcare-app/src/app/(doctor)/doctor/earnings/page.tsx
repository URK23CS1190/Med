"use client";

import {
    DollarSign, TrendingUp, CreditCard, Users, Star, BarChart3, Download, Filter
} from "lucide-react";
import { Card, Button, Badge, StatCard } from "@/components/ui";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const monthlyEarnings = [
    { month: "Aug", inClinic: 45000, tele: 12000, emergency: 5000 },
    { month: "Sep", inClinic: 48000, tele: 15000, emergency: 8000 },
    { month: "Oct", inClinic: 44000, tele: 18000, emergency: 6000 },
    { month: "Nov", inClinic: 50000, tele: 17000, emergency: 8000 },
    { month: "Dec", inClinic: 52000, tele: 19000, emergency: 7300 },
    { month: "Jan", inClinic: 56000, tele: 21000, emergency: 7500 },
];

const breakdown = [
    { name: "In-Clinic", value: 56000, color: "#3B82F6" },
    { name: "Teleconsult", value: 21000, color: "#8B5CF6" },
    { name: "Emergency", value: 7500, color: "#EF4444" },
];

const payouts = [
    { date: "15 Jan 2025", amount: 62100, consults: 45, mode: "NEFT" },
    { date: "15 Dec 2024", amount: 78300, consults: 57, mode: "NEFT" },
    { date: "15 Nov 2024", amount: 75000, consults: 55, mode: "NEFT" },
];

const perfData = [
    { month: "Oct", satisfaction: 4.6, completion: 94 },
    { month: "Nov", satisfaction: 4.7, completion: 96 },
    { month: "Dec", satisfaction: 4.8, completion: 95 },
    { month: "Jan", satisfaction: 4.8, completion: 97 },
];

const reviews = [
    { patient: "Priya N.", rating: 5, comment: "Excellent doctor, very thorough and patient.", date: "12 Jan" },
    { patient: "Mohan R.", rating: 5, comment: "Best cardiologist. Very professional and caring.", date: "11 Jan" },
    { patient: "Anita D.", rating: 4, comment: "Good consultation but had to wait 20 mins.", date: "10 Jan" },
];

export default function DoctorEarnings() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Earnings & Analytics</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>This Month</Button>
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="This Month" value="₹84,500" icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 8, label: "vs last month" }} />
                <StatCard label="Consultations" value="62" icon={<Users className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" delay={0.1} />
                <StatCard label="Avg per Consult" value="₹1,363" icon={<BarChart3 className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.2} />
                <StatCard label="Payout Pending" value="₹22,400" icon={<CreditCard className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card padding="md" className="lg:col-span-2">
                    <h3 className="text-body-lg font-semibold mb-4"><TrendingUp className="w-5 h-5 text-emerald-500 inline mr-2" />Monthly Earnings</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyEarnings}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(v: unknown) => [`₹${Number(v ?? 0).toLocaleString()}`]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                                <Legend />
                                <Bar dataKey="inClinic" fill="#3B82F6" radius={[4, 4, 0, 0]} name="In-Clinic" stackId="a" />
                                <Bar dataKey="tele" fill="#8B5CF6" name="Teleconsult" stackId="a" />
                                <Bar dataKey="emergency" fill="#EF4444" radius={[4, 4, 0, 0]} name="Emergency" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding="md">
                    <h3 className="text-body-lg font-semibold mb-4">Revenue Breakdown</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={breakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                                    {breakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip formatter={(v: unknown) => [`₹${Number(v ?? 0).toLocaleString()}`]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-2">
                        {breakdown.map(e => (
                            <div key={e.name} className="flex items-center justify-between text-body-sm">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />{e.name}</div>
                                <span className="font-semibold">₹{e.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Payout History */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4"><CreditCard className="w-5 h-5 text-primary-500 inline mr-2" />Payout History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-gray-100 dark:border-gray-800">
                            {["Date", "Amount", "Consults", "Mode", "Status"].map(h => <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {payouts.map((p, i) => (
                                <tr key={i}><td className="px-4 py-3 text-body-sm">{p.date}</td><td className="px-4 py-3 text-body-sm font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td><td className="px-4 py-3 text-body-sm">{p.consults}</td><td className="px-4 py-3 text-body-sm">{p.mode}</td><td className="px-4 py-3"><Badge variant="success">✅ Paid</Badge></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Performance */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4">Performance</h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={perfData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} name="Completion %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {[{ l: "Satisfaction", v: "4.8", c: "text-amber-500" }, { l: "Completion", v: "97%", c: "text-emerald-500" }, { l: "Avg Duration", v: "18 min", c: "text-blue-500" }, { l: "Repeat Pts", v: "68%", c: "text-purple-500" }].map(s =>
                        <div key={s.l} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated"><p className={`text-heading-sm font-bold ${s.c}`}>{s.v}</p><p className="text-caption text-content-tertiary">{s.l}</p></div>
                    )}
                </div>
            </Card>

            {/* Reviews */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4"><Star className="w-5 h-5 text-amber-500 inline mr-2" />Patient Reviews</h3>
                <div className="space-y-3">
                    {reviews.map((r, i) => (
                        <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2"><span className="text-body-sm font-semibold">{r.patient}</span>
                                    <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />)}</div>
                                </div>
                                <span className="text-caption text-content-tertiary">{r.date}</span>
                            </div>
                            <p className="text-body-sm text-content-secondary">&ldquo;{r.comment}&rdquo;</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

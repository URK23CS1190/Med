"use client";

import { motion } from "framer-motion";
import {
    Users, Building2,
    Siren, DollarSign,
    BarChart3, Activity, Download
} from "lucide-react";
import { Card, StatCard, Badge, Button } from "@/components/ui";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const performanceData = [
    { month: "Aug", activeUsers: 8200, revenue: 1200000, emergencyResponses: 450 },
    { month: "Sep", activeUsers: 9500, revenue: 1450000, emergencyResponses: 380 },
    { month: "Oct", activeUsers: 10200, revenue: 1300000, emergencyResponses: 520 },
    { month: "Nov", activeUsers: 11400, revenue: 1680000, emergencyResponses: 590 },
    { month: "Dec", activeUsers: 12100, revenue: 1950000, emergencyResponses: 620 },
    { month: "Jan", activeUsers: 12458, revenue: 2120000, emergencyResponses: 480 },
];

const roleDistribution = [
    { name: "Patients", value: 8500, color: "#3B82F6" },
    { name: "Doctors", value: 450, color: "#10B981" },
    { name: "Nurses", value: 1200, color: "#8B5CF6" },
    { name: "Ambulance", value: 150, color: "#EF4444" },
    { name: "Pharmacy", value: 200, color: "#F59E0B" },
];

const emergencyStats = [
    { region: "Andheri", count: 145, time: "8.2 min" },
    { region: "Bandra", count: 98, time: "10.5 min" },
    { region: "Juhu", count: 64, time: "7.8 min" },
    { region: "Powai", count: 82, time: "11.2 min" },
    { region: "Dadar", count: 112, time: "9.5 min" },
];

export default function SuperAdminAnalytics() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-primary-500" /> Platform Analytics
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Holistic view of platform health and business metrics</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Generate Report</Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Monthly Active Users" value="12.5k" icon={<Users className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" trend={{ value: 14, label: "vs last month" }} />
                <StatCard label="Platform Revenue" value="₹2.12M" icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 8.5, label: "vs last month" }} delay={0.1} />
                <StatCard label="Critical Incidents" value="480" icon={<Siren className="w-5 h-5" />} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20" delay={0.2} />
                <StatCard label="Partner Hospitals" value="156" icon={<Building2 className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Growth Chart */}
                <Card padding="md" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-body-lg font-bold">User Growth & Revenue</h3>
                        <div className="flex gap-2">
                            <Badge variant="info">Monthly</Badge>
                            <Badge variant="secondary">Yearly</Badge>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="activeUsers" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Role Distribution */}
                <Card padding="md">
                    <h3 className="text-body-lg font-bold mb-6">User Distribution</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {roleDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                        {roleDistribution.map((r) => (
                            <div key={r.name} className="flex items-center justify-between text-body-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                    <span className="text-content-secondary">{r.name}</span>
                                </div>
                                <span className="font-semibold">{r.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Emergency Response Stats */}
                <Card padding="md">
                    <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2">
                        <Siren className="w-5 h-5 text-red-500" /> Emergency Response Analytics
                    </h3>
                    <div className="space-y-4">
                        {emergencyStats.map((s, i) => (
                            <div key={s.region} className="flex items-center gap-4">
                                <span className="text-body-sm text-content-secondary w-20">{s.region}</span>
                                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-red-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(s.count / 150) * 100}%` }}
                                        transition={{ delay: i * 0.1, duration: 1 }}
                                    />
                                </div>
                                <div className="text-right w-24">
                                    <p className="text-body-sm font-semibold">{s.count} trips</p>
                                    <p className="text-caption text-content-tertiary">Avg: {s.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* System Health */}
                <Card padding="md">
                    <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-500" /> System Infrastructure
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "API Uptime", value: "99.98%", status: "success" },
                            { label: "Server Load", value: "42%", status: "success" },
                            { label: "Database Latency", value: "24ms", status: "success" },
                            { label: "Active Connections", value: "3.2k", status: "info" }
                        ].map(sys => (
                            <div key={sys.label} className="p-4 rounded-2xl bg-gray-50 dark:bg-surface-dark-elevated">
                                <p className="text-caption text-content-tertiary uppercase font-bold tracking-wider">{sys.label}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-heading-md font-display">{sys.value}</p>
                                    <div className={`w-2 h-2 rounded-full ${sys.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

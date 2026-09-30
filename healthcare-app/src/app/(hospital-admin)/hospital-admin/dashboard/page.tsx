"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Building2, Users, TrendingUp, Minus, Plus,
    Clock, CheckCircle, Save, ShieldAlert,
    Activity, Siren, BellRing, Star
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { Card, CardTitle, Badge, Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores";

const bedCategories = [
    { key: "icu", label: "ICU", total: 20, available: 5, color: "bg-red-500" },
    { key: "general", label: "General", total: 100, available: 42, color: "bg-blue-500" },
    { key: "ventilator", label: "Ventilator", total: 15, available: 3, color: "bg-purple-500" },
    { key: "oxygen", label: "Oxygen", total: 30, available: 12, color: "bg-cyan-500" },
    { key: "emergency", label: "Emergency", total: 10, available: 4, color: "bg-amber-500" },
];

const stats = [
    { label: "Total Beds", value: 175, icon: <Building2 className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Available", value: 66, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "IPD Revenue Today", value: "₹4.2L", icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "ER Wait Time", value: "8m", icon: <Clock className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
];

const revenueData = [
    { month: "Jan", revenue: 45, claims: 32 },
    { month: "Feb", revenue: 52, claims: 38 },
    { month: "Mar", revenue: 48, claims: 34 },
    { month: "Apr", revenue: 61, claims: 45 },
    { month: "May", revenue: 55, claims: 40 },
    { month: "Jun", revenue: 67, claims: 52 },
];

const medicalFleet = [
    { id: "AMB-01", type: "ALS", status: "In Transit", patient: "Rahul S.", eta: "4m", destination: "Trauma Bay 2" },
    { id: "AMB-04", type: "BLS", status: "En Route", patient: "Unknown", eta: "12m", destination: "Emergency" },
    { id: "AMB-09", type: "ALS", status: "Stabilizing", patient: "Maria K.", eta: "7m", destination: "Cardiac Ward" },
];

const deptUtilization = [
    { name: "ICU", value: 85, color: "#EF4444" },
    { name: "OPD", value: 62, color: "#3B82F6" },
    { name: "Radiology", value: 45, color: "#10B981" },
    { name: "Trauma", value: 92, color: "#F59E0B" },
];

function OutcomeItem({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-content-tertiary">{label}</span>
                <span className="text-content-primary">{value}</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: value }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

export default function HospitalAdminDashboard() {
    const user = useAuthStore((s) => s.user);
    const [hospitalName, setHospitalName] = useState("Apollo Hospital");
    const [isEditingName, setIsEditingName] = useState(false);
    const [beds, setBeds] = useState(bedCategories);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const updateAvailable = (key: string, delta: number) => {
        setBeds((prev) =>
            prev.map((b) =>
                b.key === key
                    ? { ...b, available: Math.max(0, Math.min(b.total, b.available + delta)) }
                    : b
            )
        );
    };

    const handleSave = () => {
        setLastUpdated(new Date());
        // Would save to Supabase here
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">
                            {hospitalName} Admin Dashboard
                        </h1>
                        <Badge variant="primary" size="md">Live</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <p className="text-body-md text-content-secondary">
                            Welcome, <span className="font-semibold">{user?.full_name || "Admin"}</span>
                        </p>
                        <span className="text-content-tertiary">•</span>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={hospitalName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHospitalName(e.target.value)}
                                    className="w-64 h-8 text-sm"
                                    placeholder="Enter Hospital Name"
                                />
                                <Button size="sm" onClick={() => setIsEditingName(false)}>Save</Button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="text-primary-500 text-caption hover:underline font-medium"
                            >
                                Change Hospital Name
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-caption text-content-tertiary">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                        Save & Broadcast
                    </Button>
                </div>
            </div>

            {/* Dashboard Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Intelligence */}
                <Card padding="md" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-body-lg font-bold">Revenue Intelligence</h2>
                            <p className="text-caption text-content-tertiary font-bold uppercase tracking-wider">Financial Health & Claim Aging</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="success" size="sm">+14.2% MoM</Badge>
                            <Button variant="ghost" size="sm" className="h-8 py-0">Details</Button>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Fleet Ops */}
                <Card padding="md" className="bg-slate-900 border-0 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h2 className="text-body-md font-bold flex items-center gap-2">
                            <Siren className="w-5 h-5 text-red-500 animate-pulse" /> Fleet Monitor
                        </h2>
                        <Badge className="bg-red-500 text-white border-0">3 Active</Badge>
                    </div>
                    <div className="space-y-4 relative z-10">
                        {medicalFleet.map(amb => (
                            <div key={amb.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex justify-between mb-1">
                                    <span className="text-caption font-bold text-primary-400">{amb.id} • {amb.type}</span>
                                    <span className="text-caption font-bold text-white">{amb.eta}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-body-sm font-medium">{amb.patient}</p>
                                    <Badge size="sm" className="bg-emerald-500/10 text-emerald-400 border-0">{amb.destination}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" fullWidth className="mt-6 border-white/20 text-white hover:bg-white/10">View Logistics Map</Button>
                </Card>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                            <div>
                                <p className="text-display-sm font-display text-content-primary dark:text-content-dark-primary">{stat.value.toLocaleString()}</p>
                                <p className="text-caption text-content-tertiary">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Operational & Clinical Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Staff & Dept Utilization */}
                <Card padding="md">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-body-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-500" /> Dept Utilization
                        </h3>
                        <Badge variant="primary" size="sm">Real-time Load</Badge>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptUtilization} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                    contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                                    {deptUtilization.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-center">
                            <p className="text-display-xs font-display text-primary-600">42</p>
                            <p className="text-[10px] text-content-tertiary font-bold uppercase">Doctors Active</p>
                        </div>
                        <div className="text-center border-l border-gray-100 dark:border-gray-800">
                            <p className="text-display-xs font-display text-emerald-600">128</p>
                            <p className="text-[10px] text-content-tertiary font-bold uppercase">Nurses on Shift</p>
                        </div>
                    </div>
                </Card>

                {/* Patient Outcomes & Satisfaction */}
                <Card padding="md">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-body-lg font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" /> Clinical Outcomes
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-amber-500" />
                            <span className="text-body-sm font-bold">4.8</span>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="h-48 w-48 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={[
                                            { name: 'Discharged', value: 82, color: '#10B981' },
                                            { name: 'Under Treatment', value: 15, color: '#3B82F6' },
                                            { name: 'Critical', value: 3, color: '#EF4444' }
                                        ]} 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        <Cell fill="#10B981" />
                                        <Cell fill="#3B82F6" />
                                        <Cell fill="#EF4444" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-4">
                            <OutcomeItem label="Discharge Rate" value="92%" color="bg-emerald-500" />
                            <OutcomeItem label="Surgery Success" value="98.4%" color="bg-blue-500" />
                            <OutcomeItem label="Wait Time (Avg)" value="14m" color="bg-amber-500" />
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800">
                        <p className="text-caption text-primary-700 dark:text-primary-400 font-bold mb-1">RECENT FEEDBACK</p>
                        <p className="text-body-sm italic text-content-secondary line-clamp-2">
                            &ldquo;Excellent response time in the ER. The trauma team was ready before the ambulance even arrived...&rdquo;
                        </p>
                    </div>
                </Card>
            </div>

            {/* Emergency Protocols & Global Broadcast */}
            <Card padding="md" className="border-2 border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                            <BellRing className="w-6 h-6 animate-bounce" />
                        </div>
                        <div>
                            <h3 className="text-body-lg font-bold">Global Alert Broadcast</h3>
                            <p className="text-caption text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-[10px]">Hospital-wide Emergency Protocols</p>
                        </div>
                    </div>
                    <Badge variant="danger" pulse>System Ready</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 border-red-200 text-red-600 hover:bg-red-50 flex flex-col gap-1 items-center justify-center">
                        <Siren className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Code Blue</span>
                    </Button>
                    <Button variant="outline" className="h-16 border-amber-200 text-amber-600 hover:bg-amber-50 flex flex-col gap-1 items-center justify-center">
                        <ShieldAlert className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Disaster Protocol</span>
                    </Button>
                    <Button variant="outline" className="h-16 border-blue-200 text-blue-600 hover:bg-blue-50 flex flex-col gap-1 items-center justify-center">
                        <BellRing className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">General Page</span>
                    </Button>
                </div>

                <div className="mt-6 flex gap-3">
                    <Input 
                        placeholder="Type high-priority message to broadcast..." 
                        className="flex-1 bg-white dark:bg-slate-900"
                    />
                    <Button className="bg-red-600 hover:bg-red-700">Broadcast Now</Button>
                </div>
            </Card>

            {/* Bed Management */}
            <Card>
                <CardTitle>Bed Availability Manager</CardTitle>
                <p className="text-body-sm text-content-secondary mb-6">Update bed counts — changes are broadcast in real-time to all users</p>
                <div className="space-y-4">
                    {beds.map((bed) => {
                        const pct = (bed.available / bed.total) * 100;
                        const statusVariant = pct > 50 ? "success" : pct > 20 ? "warning" : "danger";
                        return (
                            <div key={bed.key} className="flex items-center gap-4 p-4 rounded-button bg-gray-50 dark:bg-surface-dark-elevated">
                                <div className={`w-3 h-12 rounded-full ${bed.color}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary">{bed.label}</h3>
                                            <Badge variant={statusVariant} size="sm" dot pulse={pct < 20}>{bed.available}/{bed.total}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateAvailable(bed.key, -1)}
                                                className="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center text-heading-md font-display text-content-primary dark:text-content-dark-primary">
                                                {bed.available}
                                            </span>
                                            <button
                                                onClick={() => updateAvailable(bed.key, 1)}
                                                className="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${bed.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </motion.div>
    );
}

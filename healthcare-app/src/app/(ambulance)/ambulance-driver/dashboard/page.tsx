"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Truck, Clock, DollarSign, Navigation, Phone,
    TrendingUp, Siren, Radio, Activity,
    AlertTriangle, CheckCircle2, QrCode, User, XCircle,
    ShieldAlert, Building2
} from "lucide-react";
import { EmergencyCaseDetails } from "@/components/shared/EmergencyCaseDetails";
import { TripWorkflowTracker } from "@/components/shared/TripWorkflowTracker";
import { BedReservationWorkflow } from "@/components/shared/BedReservationWorkflow";
import { RouteIntelligence } from "@/components/shared/RouteIntelligence";
import { Card, Button, Badge, StatCard, StatusBadge } from "@/components/ui";
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useAuthStore } from "@/stores";


const driverStatus = { 
    name: "Rajesh Patil", 
    id: "AMB-DRV-2044",
    bloodGroup: "O+",
    licenseNo: "MH12 2018 0045612",
    vehicle: "KA-01-MH-5678", 
    vehicleType: "Advanced Life Support (ALS)", 
    licenseExp: "Mar 2026", 
    currentStatus: "available" as const, 
    kmToday: 48, 
    tripsToday: 3, 
    earnings: 2400,
    equipment: [
        { name: "Defibrillator", status: "ok", lastCheck: "Today 08:00 AM" },
        { name: "Ventilator", status: "ok", lastCheck: "Today 08:00 AM" },
        { name: "Oxygen Cylinders", status: "low", lastCheck: "Today 08:00 AM" },
        { name: "First Aid Kit", status: "ok", lastCheck: "Yesterday" },
        { name: "Monitor", status: "error", lastCheck: "1 hour ago" },
    ]
};

const activeRequest = {
    id: "EMR-2025-0234", patient: "Lakshmi Devi", pickup: "45, Andheri West, Mumbai",
    dropoff: "Lilavati Hospital, Bandra", distance: "8.2 km", eta: "12 min",
    priority: "critical", type: "Cardiac Emergency", requester: "Dr. Mehta",
    phone: "+91 98765 43210", status: "en_route",
};



const weeklyTrips = [
    { day: "Mon", trips: 5 }, { day: "Tue", trips: 4 }, { day: "Wed", trips: 6 },
    { day: "Thu", trips: 3 }, { day: "Fri", trips: 5 }, { day: "Sat", trips: 2 },
];

export default function AmbulanceDashboard() {
    const user = useAuthStore((s) => s.user);
    const [status, setStatus] = useState<"available" | "busy" | "offline">(driverStatus.currentStatus);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">
                        Hello, {user?.full_name || "Driver"} 👋
                    </h1>
                    <p className="text-body-md text-content-secondary">{driverStatus.vehicle} • {driverStatus.vehicleType}</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Status Toggle */}
                    <div className="flex bg-gray-100 dark:bg-surface-dark-elevated rounded-xl p-1">
                        {(["available", "busy", "offline"] as const).map(s => (
                            <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-lg text-body-sm font-medium capitalize transition-all ${status === s ? (s === "available" ? "bg-emerald-500 text-white" : s === "busy" ? "bg-amber-500 text-white" : "bg-gray-500 text-white") : "text-content-secondary"
                                }`}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Emergency & SOS Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {status !== "offline" && activeRequest && (
                        <EmergencyCaseDetails 
                            emergency={{
                                ...activeRequest,
                                age: 64,
                                gender: "Female",
                                location: activeRequest.pickup,
                                eta: activeRequest.eta,
                                condition: "Patient reporting acute chest pain radiating to left arm. History of hypertension. Immediate ALS intervention required.",
                                vitals: {
                                    heartRate: 112,
                                    bp: "160/95",
                                    spO2: 92,
                                    temp: "98.6°F"
                                },
                                severity: activeRequest.priority as "critical" | "serious" | "stable"
                            }}
                            onAccept={() => alert("Dispatching to location...")}
                            onDecline={() => alert("Requesting backup...")}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    {/* SOS Actions */}
                    <Card padding="md" className="bg-red-50 dark:bg-red-900/10 border-2 border-red-500 shadow-xl shadow-red-500/10">
                        <h3 className="text-body-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-5 h-5 animate-pulse" /> Emergency Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="destructive" className="h-20 rounded-2xl flex flex-col gap-1 items-center justify-center font-bold">
                                <Siren className="w-6 h-6" />
                                <span>SOS</span>
                            </Button>
                            <Button variant="outline" className="h-20 rounded-2xl flex flex-col gap-1 items-center justify-center border-red-200 text-red-600 hover:bg-red-50">
                                <Radio className="w-6 h-6" />
                                <span>Dispatch</span>
                            </Button>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-red-100 dark:border-red-900/50">
                            <div className="flex items-center justify-between text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">
                                <span>Pre-Alert Status</span>
                                <Badge variant="danger" pulse dot>Ready</Badge>
                            </div>
                            <Button variant="ghost" fullWidth size="sm" className="text-red-600 font-bold">Alert Trauma Team</Button>
                        </div>
                    </Card>

                    {/* Quick Contacts */}
                    <Card padding="md">
                        <h3 className="text-body-md font-bold mb-4">Quick Radio</h3>
                        <div className="space-y-2">
                            <Button variant="outline" fullWidth className="justify-start gap-3 rounded-xl h-12">
                                <Building2 className="w-5 h-5 text-primary-500" />
                                <span>ER Reception</span>
                            </Button>
                            <Button variant="outline" fullWidth className="justify-start gap-3 rounded-xl h-12">
                                <Phone className="w-5 h-5 text-emerald-500" />
                                <span>Command Center</span>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Trip Progress */}
            <Card padding="md" className="bg-white/50 dark:bg-black/10 backdrop-blur-sm border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-body-lg font-bold flex items-center gap-2 text-content-primary">
                        <Truck className="w-5 h-5 text-primary-500" /> Mission Progress
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-caption text-content-tertiary">Mission ID: <strong>#MSN-8821</strong></span>
                        <Badge variant="primary" pulse>LIVE</Badge>
                    </div>
                </div>
                <TripWorkflowTracker currentStep="en_route" />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Navigation className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-content-tertiary font-bold uppercase">Current Speed</p>
                            <p className="text-body-sm font-bold">64 km/h</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-content-tertiary font-bold uppercase">Time to Target</p>
                            <p className="text-body-sm font-bold">12:04 PM (Est.)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                            <Siren className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-content-tertiary font-bold uppercase">Dispatch Status</p>
                            <p className="text-body-sm font-bold">Priority Blue</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BedReservationWorkflow />
                <RouteIntelligence />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Trips Today" value={driverStatus.tripsToday} icon={<Truck className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="KM Today" value={`${driverStatus.kmToday} km`} icon={<Navigation className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.1} />
                <StatCard label="Earnings Today" value={`₹${driverStatus.earnings}`} icon={<DollarSign className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Response Time" value="4.2 min" icon={<Clock className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" trend={{ value: -8, label: "faster than avg" }} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Driver ID Card */}
                <Card padding="none" className="overflow-hidden border-2 border-primary-100 dark:border-primary-900 shadow-xl shadow-primary-500/5">
                    <div className="bg-primary-600 p-6 text-white relative">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 mb-4">
                                <Siren className="w-5 h-5 text-white/80" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">Emergency Medical Service</span>
                            </div>
                            <Badge className="bg-white/20 text-white border-0">EMP-DRV</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-body-lg font-bold leading-tight">{driverStatus.name}</h2>
                                <p className="text-caption text-white/80 mt-0.5">{driverStatus.id}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-content-tertiary uppercase font-bold tracking-wider">Blood Group</p>
                                <p className="text-body-sm font-bold text-red-600">{driverStatus.bloodGroup}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-content-tertiary uppercase font-bold tracking-wider">License exp.</p>
                                <p className="text-body-sm font-bold">{driverStatus.licenseExp}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-content-secondary" />
                                <span className="text-[10px] font-bold text-content-secondary uppercase">Safety Passport</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] p-0 text-primary-600">View QR</Button>
                        </div>
                    </div>
                </Card>

                {/* Equipment Status */}
                <Card padding="md" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-body-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" /> Equipment Checklist</h3>
                        <StatusBadge status="verified" label="Daily Inspection Done" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {driverStatus.equipment.map((item) => (
                            <div key={item.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    {item.status === 'ok' ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : item.status === 'low' ? (
                                        <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    <div>
                                        <p className="text-body-sm font-semibold text-content-primary">{item.name}</p>
                                        <p className="text-[10px] text-content-tertiary">Last check: {item.lastCheck}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] opacity-0 group-hover:opacity-100">Details</Button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <p className="text-caption text-content-tertiary italic">Ready for level 1 cardiac emergencies.</p>
                        <Button variant="outline" size="sm">Perform Audit</Button>
                    </div>
                </Card>
            </div>

            {/* Advanced KPI Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card padding="md" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-body-lg font-bold">Activity Heatmap</h3>
                            <p className="text-caption text-content-tertiary font-bold uppercase tracking-wider">Hourly Emergency Frequency</p>
                        </div>
                        <Badge variant="info">AI Predictor: On</Badge>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyTrips.map(d => ({ ...d, predicted: d.trips + (Math.random() * 2) }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                    contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="trips" fill="url(#colorTrips)" radius={[10, 10, 0, 0]} />
                                <Bar dataKey="predicted" fill="rgba(59, 130, 246, 0.1)" radius={[10, 10, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card padding="md" className="bg-primary-600 text-white border-0 shadow-2xl shadow-primary-500/20">
                        <h3 className="text-body-md font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-200" /> Performance Index
                        </h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-display-md font-display leading-none">98.4</span>
                            <Badge className="bg-emerald-500 text-white border-0">+2.1%</Badge>
                        </div>
                        <p className="text-caption text-primary-100 font-bold uppercase tracking-widest mb-6">Safety Score • Level A+</p>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: "98.4%" }}
                                className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                            />
                        </div>
                    </Card>

                    <Card padding="md">
                        <h3 className="text-body-sm font-bold text-content-tertiary uppercase tracking-wider mb-4">Live Dispatch Load</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 font-bold">
                                42%
                            </div>
                            <div>
                                <p className="text-body-md font-bold">Optimal Condition</p>
                                <p className="text-caption text-content-tertiary">Fleet utilization in Mumbai-NW zone.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

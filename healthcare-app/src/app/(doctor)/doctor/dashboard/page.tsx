"use client";

import { motion } from "framer-motion";
import {
    Users, DollarSign, Video, Clock, Activity, Calendar,
    ArrowRight, TrendingUp, Stethoscope, AlertTriangle, Bell, Star
} from "lucide-react";
import { Card, Badge, Avatar, Button, StatCard } from "@/components/ui";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import Link from "next/link";
import { useAuthStore } from "@/stores";

const todaySchedule = [
    { id: "1", patient: "Riya Sharma", age: "28F", time: "09:00 AM", mode: "clinic" as const, status: "follow_up", reason: "Follow-up, Cardiology", avatar: null },
    { id: "2", patient: "Mohan Rao", age: "55M", time: "09:30 AM", mode: "clinic" as const, status: "new", reason: "New Patient, Chest Pain", avatar: null },
    { id: "3", patient: "Anita Desai", age: "34F", time: "10:00 AM", mode: "video" as const, status: "ready", reason: "Video Call Ready", avatar: null },
    { id: "4", patient: "Free Slot", age: "", time: "10:30 AM", mode: "clinic" as const, status: "available", reason: "", avatar: null },
    { id: "5", patient: "Priya Nair", age: "42F", time: "11:00 AM", mode: "clinic" as const, status: "post_surgery", reason: "Post-surgery Review", avatar: null },
    { id: "6", patient: "Suresh Kumar", age: "60M", time: "11:30 AM", mode: "video" as const, status: "scheduled", reason: "BP Follow-up", avatar: null },
    { id: "7", patient: "Deepa Iyer", age: "29F", time: "02:00 PM", mode: "clinic" as const, status: "scheduled", reason: "Routine Checkup", avatar: null },
    { id: "8", patient: "Karan Gupta", age: "45M", time: "03:30 PM", mode: "clinic" as const, status: "scheduled", reason: "ECG Report Review", avatar: null },
];

const weeklyData = [
    { day: "Mon", clinic: 6, tele: 3 },
    { day: "Tue", clinic: 8, tele: 2 },
    { day: "Wed", clinic: 5, tele: 4 },
    { day: "Thu", clinic: 7, tele: 5 },
    { day: "Fri", clinic: 9, tele: 3 },
    { day: "Sat", clinic: 4, tele: 1 },
    { day: "Sun", clinic: 0, tele: 0 },
];

const patientCategory = [
    { name: "New", value: 35, color: "#3B82F6" },
    { name: "Follow-up", value: 45, color: "#10B981" },
    { name: "Emergency", value: 20, color: "#EF4444" },
];

const monthlyEarnings = [
    { month: "Aug", amount: 62000, consults: 45 },
    { month: "Sep", amount: 71000, consults: 52 },
    { month: "Oct", amount: 68000, consults: 48 },
    { month: "Nov", amount: 75000, consults: 55 },
    { month: "Dec", amount: 78000, consults: 57 },
    { month: "Jan", amount: 84500, consults: 62 },
];

const notifications = [
    { type: "emergency", icon: "🔴", text: "ICU patient escalation from Nurse Kavitha", time: "2 min ago" },
    { type: "verification", icon: "🟡", text: "Medical License approved ✅", time: "1 hour ago" },
    { type: "appointment", icon: "🔵", text: "New appointment: Suresh Kumar, 2:30 PM tomorrow", time: "3 hours ago" },
    { type: "feedback", icon: "🟢", text: "5-star rating from Priya Nair", time: "5 hours ago" },
];

export default function DoctorDashboard() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">
                        Good morning, {user?.full_name || "Doctor"} 👋
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">
                        You have <span className="font-semibold text-primary-600">8 appointments</span> today
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/doctor/appointments">
                        <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>View Schedule</Button>
                    </Link>
                    <Link href="/doctor/prescriptions">
                        <Button size="sm" leftIcon={<Stethoscope className="w-4 h-4" />}>New Prescription</Button>
                    </Link>
                </div>
            </div>

            {/* Verification Banner */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <div>
                        <p className="text-body-sm font-semibold text-amber-800 dark:text-amber-300">Profile 72% complete — 2 documents pending verification</p>
                        <p className="text-caption text-amber-600 dark:text-amber-400">Complete verification to unlock full profile visibility</p>
                    </div>
                </div>
                <Link href="/doctor/verification">
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">Complete Verification</Button>
                </Link>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Today's Appointments" value="8" icon={<Calendar className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" trend={{ value: 12, label: "vs yesterday" }} delay={0} />
                <StatCard label="Pending Consultations" value="3" icon={<Video className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.1} />
                <StatCard label="Active Patients" value="142" icon={<Users className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 5, label: "new this week" }} delay={0.2} />
                <StatCard label="Monthly Earnings" value="₹84,500" icon={<DollarSign className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" trend={{ value: 8, label: "vs last month" }} delay={0.3} />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
                <Button size="sm" leftIcon={<Video className="w-4 h-4" />} className="bg-purple-600 hover:bg-purple-700">Start Teleconsult</Button>
                <Button size="sm" variant="outline" leftIcon={<Stethoscope className="w-4 h-4" />}>New Prescription</Button>
                <Button size="sm" variant="outline" leftIcon={<Users className="w-4 h-4" />}>View Patient Records</Button>
                <Button size="sm" variant="ghost" leftIcon={<Activity className="w-4 h-4" />} className="text-red-600">Emergency On-Call</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-heading-sm font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-500" /> Today&apos;s Schedule
                        </h2>
                        <Link href="/doctor/appointments" className="text-body-sm text-primary-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {todaySchedule.map((apt, i) => (
                            <motion.div key={apt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                {apt.status === "available" ? (
                                    <div className="card-base p-4 border-dashed border-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-body-sm font-medium text-primary-600">{apt.time}</span>
                                            <span className="text-body-sm text-content-tertiary">— Slot Available</span>
                                        </div>
                                        <Button size="sm" variant="ghost">Block Slot</Button>
                                    </div>
                                ) : (
                                    <Card variant="interactive" padding="none">
                                        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar fallback={apt.patient} size="sm" />
                                                <div>
                                                    <h3 className="font-semibold text-body-md text-content-primary dark:text-content-dark-primary">
                                                        {apt.patient} {apt.age && <span className="text-content-tertiary font-normal text-body-sm">{apt.age}</span>}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-body-sm text-content-secondary">
                                                        <span className="flex items-center gap-1 font-medium text-primary-600 dark:text-primary-400">
                                                            <Clock className="w-3 h-3" /> {apt.time}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            {apt.mode === "video" ? <Video className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                                            {apt.mode === "video" ? "Video" : "In-Clinic"}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{apt.reason}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                {apt.status === "ready" && (
                                                    <>
                                                        <Badge variant="danger" className="animate-pulse">🔴 Live</Badge>
                                                        <Button size="sm">Join Now</Button>
                                                    </>
                                                )}
                                                {apt.status === "new" && <Button size="sm" variant="outline">View History</Button>}
                                                {(apt.status === "follow_up" || apt.status === "post_surgery") && (
                                                    <>
                                                        <Button size="sm">Start</Button>
                                                        <Button size="sm" variant="ghost">Reschedule</Button>
                                                    </>
                                                )}
                                                {apt.status === "scheduled" && (
                                                    <Badge variant="info" className="justify-center">Scheduled</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Notifications Feed */}
                <div className="space-y-4">
                    <h2 className="text-heading-sm font-semibold flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary-500" /> Notifications
                    </h2>
                    <Card padding="none">
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {notifications.map((n, i) => (
                                <div key={i} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer">
                                    <div className="flex gap-3">
                                        <span className="text-lg">{n.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body-sm text-content-primary dark:text-content-dark-primary">{n.text}</p>
                                            <p className="text-caption text-content-tertiary mt-0.5">{n.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Patient Feedback */}
                    <Card padding="md">
                        <h3 className="text-body-md font-semibold mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" /> Patient Rating
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-display-sm font-bold text-content-primary dark:text-content-dark-primary">4.8</span>
                            <div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-200"}`} />
                                    ))}
                                </div>
                                <p className="text-caption text-content-tertiary">Based on 248 reviews</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {[5, 4, 3, 2, 1].map(r => (
                                <div key={r} className="flex items-center gap-2 text-caption">
                                    <span className="w-3">{r}</span>
                                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: r === 5 ? "72%" : r === 4 ? "18%" : r === 3 ? "6%" : r === 2 ? "3%" : "1%" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Trend */}
                <Card padding="md" className="lg:col-span-2">
                    <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" /> Weekly Consultation Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                                <Legend />
                                <Line type="monotone" dataKey="clinic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="In-Clinic" />
                                <Line type="monotone" dataKey="tele" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} name="Teleconsult" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Patient Category Pie */}
                <Card padding="md">
                    <h3 className="text-body-lg font-semibold mb-4">Patient Category</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={patientCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                                    {patientCategory.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {patientCategory.map(c => (
                            <div key={c.name} className="flex items-center gap-1.5 text-caption">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                                {c.name} ({c.value}%)
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Monthly Earnings */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" /> Monthly Earnings (Last 6 Months)
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyEarnings}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(v: unknown) => [`₹${Number(v ?? 0).toLocaleString()}`, "Earnings"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                            <Bar dataKey="amount" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}

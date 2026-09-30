"use client";

import { motion } from "framer-motion";
import {
    Users, AlertTriangle, Bed, Heart, ClipboardList,
    Siren, ArrowRight, Bell, TrendingUp, Timer
} from "lucide-react";
import { Card, Button, Badge, Avatar, StatCard } from "@/components/ui";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import Link from "next/link";
import { useAuthStore } from "@/stores";

const currentShift = {
    type: "Morning Shift",
    time: "06:00 AM – 02:00 PM",
    ward: "Cardiology Ward — Floor 3",
    headNurse: "Sr. Nurse Meenakshi",
    patientsAssigned: 8,
    tasksCompleted: 12,
    tasksPending: 5,
    totalTasks: 17,
};

const urgentTasks = [
    { id: "T-001", patient: "Ramesh Kumar", bed: "3-A12", task: "IV Drip Change", priority: "high", due: "10 min", status: "overdue" },
    { id: "T-002", patient: "Lakshmi Devi", bed: "3-A08", task: "Vitals Check (↑ BP Alert)", priority: "high", due: "15 min", status: "due_soon" },
    { id: "T-003", patient: "Arun Joshi", bed: "3-B03", task: "Post-Op Wound Dressing", priority: "medium", due: "30 min", status: "upcoming" },
];

const wardBedStatus = [
    { name: "Occupied", value: 18, color: "#3B82F6" },
    { name: "Available", value: 4, color: "#10B981" },
    { name: "Maintenance", value: 2, color: "#F59E0B" },
];

const weeklyTasks = [
    { day: "Mon", completed: 22, pending: 3 },
    { day: "Tue", completed: 18, pending: 5 },
    { day: "Wed", completed: 24, pending: 2 },
    { day: "Thu", completed: 20, pending: 4 },
    { day: "Fri", completed: 17, pending: 6 },
    { day: "Sat", completed: 15, pending: 2 },
];

const patientVitals = [
    { patient: "Ramesh Kumar", bed: "3-A12", hr: 88, bp: "148/92", o2: 95, temp: 99.2, flag: "critical" },
    { patient: "Lakshmi Devi", bed: "3-A08", hr: 72, bp: "160/95", o2: 97, temp: 98.6, flag: "warning" },
    { patient: "Arun Joshi", bed: "3-B03", hr: 78, bp: "120/80", o2: 98, temp: 98.4, flag: "stable" },
    { patient: "Divya Patel", bed: "3-B05", hr: 82, bp: "130/85", o2: 96, temp: 99.0, flag: "stable" },
];

const notifications = [
    { icon: "🔴", text: "URGENT: Bed 3-A12 IV drip running low", time: "2 min ago" },
    { icon: "🟡", text: "Dr. Mehta updated medication for Bed 3-A08", time: "15 min ago" },
    { icon: "🔵", text: "Shift handover report submitted by Night Shift", time: "1 hr ago" },
    { icon: "🟢", text: "Bed 3-B07 patient discharged", time: "2 hr ago" },
];

export default function NurseDashboard() {
    const user = useAuthStore((s) => s.user);
    const taskPct = Math.round((currentShift.tasksCompleted / currentShift.totalTasks) * 100);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">
                        Good morning, {user?.full_name || "Nurse"} 👋
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">{currentShift.type} • {currentShift.ward}</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/nurse/emergency"><Button size="sm" className="bg-red-600 hover:bg-red-700" leftIcon={<Siren className="w-4 h-4" />}>Emergency</Button></Link>
                    <Link href="/nurse/tasks"><Button size="sm" variant="outline" leftIcon={<ClipboardList className="w-4 h-4" />}>Task Board</Button></Link>
                </div>
            </div>

            {/* Shift Info Bar */}
            <Card padding="md" className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border-teal-100 dark:border-teal-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                        <Timer className="w-6 h-6 text-teal-600" />
                        <div>
                            <p className="text-body-md font-semibold text-teal-800 dark:text-teal-300">{currentShift.type}: {currentShift.time}</p>
                            <p className="text-body-sm text-teal-600 dark:text-teal-400">Head: {currentShift.headNurse} • {currentShift.patientsAssigned} patients assigned</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-body-sm font-semibold text-teal-800 dark:text-teal-300">{taskPct}% tasks done</p>
                            <p className="text-caption text-teal-600">{currentShift.tasksCompleted}/{currentShift.totalTasks}</p>
                        </div>
                        <div className="w-24 h-2 bg-teal-100 dark:bg-teal-900/30 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-teal-500" initial={{ width: 0 }} animate={{ width: `${taskPct}%` }} transition={{ duration: 1 }} />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Patients Assigned" value={currentShift.patientsAssigned} icon={<Users className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="Tasks Pending" value={currentShift.tasksPending} icon={<ClipboardList className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.1} />
                <StatCard label="Critical Alerts" value={1} icon={<AlertTriangle className="w-5 h-5" />} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20" delay={0.2} />
                <StatCard label="Beds Available" value={4} icon={<Bed className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Urgent Tasks */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-heading-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" /> Urgent Tasks
                        </h2>
                        <Link href="/nurse/tasks" className="text-body-sm text-primary-600 hover:underline flex items-center gap-1">All Tasks <ArrowRight className="w-3.5 h-3.5" /></Link>
                    </div>
                    {urgentTasks.map((task, i) => (
                        <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                            <Card padding="none" className={`border-l-4 ${task.status === "overdue" ? "border-l-red-500" : task.status === "due_soon" ? "border-l-amber-500" : "border-l-blue-500"}`}>
                                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar fallback={task.patient} size="sm" />
                                        <div>
                                            <h3 className="text-body-md font-semibold">{task.task}</h3>
                                            <p className="text-body-sm text-content-secondary">{task.patient} • Bed {task.bed}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {task.status === "overdue" && <Badge variant="danger" className="animate-pulse">⏰ Overdue</Badge>}
                                        {task.status === "due_soon" && <Badge variant="warning">Due: {task.due}</Badge>}
                                        {task.status === "upcoming" && <Badge variant="info">In {task.due}</Badge>}
                                        <Button size="sm">Mark Done</Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                    <h2 className="text-heading-sm font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-primary-500" /> Alerts</h2>
                    <Card padding="none">
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {notifications.map((n, i) => (
                                <div key={i} className="p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer">
                                    <div className="flex gap-2"><span>{n.icon}</span><div><p className="text-body-sm">{n.text}</p><p className="text-caption text-content-tertiary">{n.time}</p></div></div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Patient Vitals Grid */}
            <h2 className="text-heading-sm font-semibold flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" /> Patient Vitals Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {patientVitals.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card padding="md" className={`${p.flag === "critical" ? "ring-2 ring-red-300 dark:ring-red-700" : p.flag === "warning" ? "ring-1 ring-amber-200 dark:ring-amber-800" : ""}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div><p className="text-body-sm font-semibold">{p.patient}</p><p className="text-caption text-content-tertiary">Bed {p.bed}</p></div>
                                {p.flag === "critical" && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-caption">
                                <div><span className="text-content-tertiary">HR:</span> <span className={`font-semibold ${p.hr > 85 ? "text-red-600" : "text-content-primary dark:text-content-dark-primary"}`}>{p.hr} bpm</span></div>
                                <div><span className="text-content-tertiary">BP:</span> <span className="font-semibold">{p.bp}</span></div>
                                <div><span className="text-content-tertiary">SpO2:</span> <span className={`font-semibold ${p.o2 < 96 ? "text-amber-600" : "text-emerald-600"}`}>{p.o2}%</span></div>
                                <div><span className="text-content-tertiary">Temp:</span> <span className={`font-semibold ${p.temp > 99 ? "text-amber-600" : ""}`}>{p.temp}°F</span></div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card padding="md" className="lg:col-span-2">
                    <h3 className="text-body-lg font-semibold mb-4"><TrendingUp className="w-5 h-5 text-primary-500 inline mr-2" />Weekly Task Completion</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyTasks}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed" stackId="a" />
                                <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Pending" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding="md">
                    <h3 className="text-body-lg font-semibold mb-4">Ward Bed Status</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={wardBedStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                                    {wardBedStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-1.5 mt-2">
                        {wardBedStatus.map(b => (
                            <div key={b.name} className="flex items-center justify-between text-body-sm">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />{b.name}</div>
                                <span className="font-semibold">{b.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

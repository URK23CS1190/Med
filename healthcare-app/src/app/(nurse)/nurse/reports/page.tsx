"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, Send, Calendar, Download, BarChart3, TrendingUp } from "lucide-react";
import { Card, Button, Badge, StatCard } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const shiftReports = [
    { id: "SR-0045", date: "15 Jan 2025", shift: "Morning", ward: "Cardiology ICU", patients: 8, tasks: 17, incidents: 1, note: "Code Blue activated for Bed 3-A12 — patient stabilized." },
    { id: "SR-0044", date: "14 Jan 2025", shift: "Morning", ward: "Cardiology ICU", patients: 7, tasks: 15, incidents: 0, note: "Routine shift. All vitals normal." },
    { id: "SR-0043", date: "13 Jan 2025", shift: "Afternoon", ward: "General Ward", patients: 10, tasks: 20, incidents: 0, note: "Two patient discharges processed." },
];

const weeklyStats = [
    { day: "Mon", tasks: 22, hours: 8 }, { day: "Tue", tasks: 18, hours: 8 },
    { day: "Wed", tasks: 24, hours: 9 }, { day: "Thu", tasks: 20, hours: 8 },
    { day: "Fri", tasks: 17, hours: 8 },
];

const messages = [
    { from: "Dr. Mehta", time: "10:30 AM", text: "Please increase IV rate for Bed 3-A12 to 80 mL/hr.", unread: true },
    { from: "Sr. Nurse Meenakshi", time: "09:15 AM", text: "Team meeting at 2 PM in the nurses' station. Mandatory attendance.", unread: true },
    { from: "Pharmacy", time: "Yesterday", text: "Insulin stock replenished. New batch: INS-2025-0342", unread: false },
];

export default function NurseReports() {
    return (
        <div className="space-y-6">
            <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Reports & Communication</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Shifts This Month" value="18" icon={<Calendar className="w-5 h-5" />} color="text-teal-500" bgColor="bg-teal-50 dark:bg-teal-900/20" />
                <StatCard label="Total Tasks" value="312" icon={<BarChart3 className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" delay={0.1} />
                <StatCard label="Incidents" value="2" icon={<FileText className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Avg Tasks/Shift" value="17.3" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reports List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-heading-sm font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-primary-500" /> Shift Reports</h2>
                    {shiftReports.map((r, i) => (
                        <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card padding="md">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-body-md font-semibold">{r.id} — {r.date}</h3>
                                        <p className="text-body-sm text-content-secondary">{r.shift} Shift • {r.ward} • {r.patients} patients • {r.tasks} tasks</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {r.incidents > 0 && <Badge variant="warning">{r.incidents} incident</Badge>}
                                        <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                                <p className="text-body-sm text-content-secondary bg-gray-50 dark:bg-surface-dark-elevated p-3 rounded-lg">{r.note}</p>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Chart */}
                    <Card padding="md">
                        <h3 className="text-body-lg font-semibold mb-4">Weekly Performance</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
                                    <Bar dataKey="tasks" fill="#14B8A6" radius={[6, 6, 0, 0]} name="Tasks" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                    <h2 className="text-heading-sm font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-500" /> Messages</h2>
                    <Card padding="none">
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {messages.map((m, i) => (
                                <div key={i} className={`p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${m.unread ? "bg-blue-50/30 dark:bg-blue-900/5" : ""}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-body-sm font-semibold">{m.from}</span>
                                        <span className="text-caption text-content-tertiary">{m.time}</span>
                                    </div>
                                    <p className="text-body-sm text-content-secondary">{m.text}</p>
                                    {m.unread && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mt-1" />}
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                            <input type="text" placeholder="Type a message..." className="flex-1 h-9 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border-0 text-body-sm" />
                            <Button size="sm"><Send className="w-4 h-4" /></Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

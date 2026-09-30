"use client";

import { motion } from "framer-motion";
import { Siren, MapPin, Clock, Phone, Navigation, User, CheckCircle, X } from "lucide-react";
import { Card, Button, Badge, StatusBadge } from "@/components/ui";

const emergencyRequests = [
    { id: "EMR-0235", patient: "Unknown (Bystander Call)", location: "34, MG Road, Andheri West", distance: "2.1 km", type: "Road Accident", priority: "critical", time: "Just now", hospital: "Nearest: Kokilaben Hospital (3.5 km)", phone: "+91 98XXX XXXXX" },
    { id: "EMR-0236", patient: "Sunita Rao", location: "12, Palm Beach Rd, Navi Mumbai", distance: "8.5 km", type: "Cardiac Arrest (suspected)", priority: "critical", time: "1 min ago", hospital: "Preferred: Fortis Vashi (2 km)", phone: "+91 99XXX XXXXX" },
    { id: "EMR-0237", patient: "Mohan Das", location: "22, Linking Rd, Khar", distance: "4.3 km", type: "Scheduled Patient Transfer", priority: "medium", time: "Pickup at 2:30 PM", hospital: "To: Lilavati Hospital", phone: "+91 87XXX XXXXX" },
];

const completedToday = [
    { id: "EMR-0232", patient: "Priya N.", route: "Bandra → KEM Hospital", time: "08:15 AM", duration: "22 min", status: "completed" },
    { id: "EMR-0233", patient: "Raju K.", route: "Juhu → Nanavati Hosp.", time: "09:45 AM", duration: "18 min", status: "completed" },
    { id: "EMR-0234", patient: "Lakshmi D.", route: "Andheri → Lilavati Hosp.", time: "11:30 AM", duration: "28 min", status: "completed" },
];

export default function AmbulanceRequests() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                    <Siren className="w-7 h-7 text-red-500" /> Emergency Requests
                </h1>
                <Badge variant="danger" className="text-sm animate-pulse">{emergencyRequests.filter(r => r.priority === "critical").length} Critical</Badge>
            </div>

            {/* Live Requests */}
            <div className="space-y-4">
                {emergencyRequests.map((req, i) => (
                    <motion.div key={req.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card padding="none" className={`border-l-4 ${req.priority === "critical" ? "border-l-red-500 ring-1 ring-red-200 dark:ring-red-800" : "border-l-blue-500"}`}>
                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="text-body-md font-bold">{req.id}</h3>
                                            <StatusBadge status={req.priority === "critical" ? "critical" : "pending"} pulse={req.priority === "critical"} />
                                            <Badge variant={req.priority === "critical" ? "danger" : "info"}>{req.type}</Badge>
                                        </div>
                                        <div className="space-y-1 text-body-sm">
                                            <p className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-content-tertiary" /> {req.patient}</p>
                                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {req.location}</p>
                                            <p className="flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5 text-blue-500" /> {req.distance} away • {req.hospital}</p>
                                            <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-content-tertiary" /> {req.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                                        <Button className={req.priority === "critical" ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""} leftIcon={<CheckCircle className="w-4 h-4" />}>Accept</Button>
                                        <Button variant="outline" leftIcon={<Phone className="w-4 h-4" />}>Call</Button>
                                        <Button variant="ghost" className="text-content-tertiary" leftIcon={<X className="w-4 h-4" />}>Decline</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Completed Today */}
            <Card padding="md">
                <h3 className="text-body-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Completed Today</h3>
                <div className="space-y-2">
                    {completedToday.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated text-body-sm">
                            <div><span className="font-semibold">{t.id}</span> • {t.patient} • {t.route}</div>
                            <div className="flex items-center gap-3"><span className="text-content-tertiary">{t.time}</span><span className="font-medium">{t.duration}</span><StatusBadge status="completed" /></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

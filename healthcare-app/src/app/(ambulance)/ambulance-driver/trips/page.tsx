"use client";

import { motion } from "framer-motion";
import { Truck, MapPin, Clock, Star, Download, Filter, DollarSign, User } from "lucide-react";
import { Card, Button, Badge, StatusBadge, StatCard } from "@/components/ui";

const trips = [
    { id: "T-101", date: "15 Jan 2025", time: "11:30 AM", patient: "Lakshmi Devi", from: "45 Andheri West", to: "Lilavati Hospital", distance: "8.2 km", duration: "28 min", type: "Emergency", earnings: 1200, rating: 5, status: "completed" },
    { id: "T-100", date: "15 Jan 2025", time: "09:45 AM", patient: "Priya Nair", from: "Bandra Station", to: "KEM Hospital", distance: "12.5 km", duration: "38 min", type: "Emergency", earnings: 1200, rating: 4, status: "completed" },
    { id: "T-099", date: "15 Jan 2025", time: "08:15 AM", patient: "Raju Kumar", from: "Juhu Beach Rd", to: "Nanavati Hospital", distance: "5.1 km", duration: "18 min", type: "Transfer", earnings: 400, rating: 5, status: "completed" },
    { id: "T-098", date: "14 Jan 2025", time: "04:30 PM", patient: "Sunita Rao", from: "Powai", to: "Hiranandani Hospital", distance: "3.2 km", duration: "22 min", type: "Emergency", earnings: 800, rating: 5, status: "completed" },
    { id: "T-097", date: "14 Jan 2025", time: "10:00 AM", patient: "Mohan Das", from: "Khar West", to: "Lilavati Hospital", distance: "6.1 km", duration: "20 min", type: "Scheduled", earnings: 600, rating: 4, status: "completed" },
    { id: "T-096", date: "13 Jan 2025", time: "02:15 PM", patient: "Anonymous", from: "MG Road", to: "Cooper Hospital", distance: "4.8 km", duration: "15 min", type: "Emergency", earnings: 800, rating: null, status: "completed" },
];

export default function AmbulanceTrips() {
    const totalEarnings = trips.reduce((s, t) => s + t.earnings, 0);
    const totalKm = trips.reduce((s, t) => s + parseFloat(t.distance), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Trip History & Logs</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Trips" value={trips.length} icon={<Truck className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="Total KM" value={`${totalKm.toFixed(1)} km`} icon={<MapPin className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" delay={0.1} />
                <StatCard label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="Avg Rating" value="4.6 ⭐" icon={<Star className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.3} />
            </div>

            <div className="space-y-3">
                {trips.map((trip, i) => (
                    <motion.div key={trip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card padding="md">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="text-body-md font-semibold">{trip.id}</h3>
                                        <Badge variant={trip.type === "Emergency" ? "danger" : trip.type === "Scheduled" ? "info" : "warning"}>{trip.type}</Badge>
                                        <StatusBadge status="completed" />
                                    </div>
                                    <div className="text-body-sm text-content-secondary space-y-0.5">
                                        <p className="flex items-center gap-1.5"><User className="w-3 h-3" />{trip.patient}</p>
                                        <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-emerald-500" />{trip.from} → {trip.to}</p>
                                        <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{trip.date} at {trip.time} • {trip.distance} • {trip.duration}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-heading-sm font-bold text-emerald-600">₹{trip.earnings}</p>
                                    {trip.rating && <div className="flex items-center gap-0.5 justify-end mt-1">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= trip.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />)}</div>}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

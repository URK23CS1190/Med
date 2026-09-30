"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Building2, Phone, Search, Filter, Star, HeartPulse, Bed } from "lucide-react";
import { Card, Button, Badge, Input } from "@/components/ui";

const AmbulanceLiveMap = dynamic(() => import("@/components/shared/AmbulanceLiveMap"), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">Loading Map Engine...</div>
});

const HOSPITALS = [
    { id: "h1", name: "Apollo Hospital", distance: "2.5 km", time: "8 mins", lat: 19.112, lng: 72.858, status: "High Beds", rating: 4.8, type: "Multi-specialty", beds: 42, oxygen: true },
    { id: "h2", name: "Lilavati Hospital", distance: "4.8 km", time: "15 mins", lat: 19.051, lng: 72.829, status: "Critical Beds", rating: 4.9, type: "Multi-specialty", beds: 5, oxygen: true },
    { id: "h3", name: "Global Hospital", distance: "1.2 km", time: "4 mins", lat: 19.125, lng: 72.885, status: "Available", rating: 4.5, type: "General", beds: 18, oxygen: true },
    { id: "h4", name: "SevenHills Hospital", distance: "6.1 km", time: "22 mins", lat: 19.118, lng: 72.871, status: "Available", rating: 4.7, type: "Trauma Care", beds: 24, oxygen: true },
];

const AMBULANCE_POS: [number, number] = [19.102, 72.848];

export default function AmbulanceMap() {
    const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");

    const filteredHospitals = HOSPITALS
        .filter(h => 
            (filterType === "All" || h.type === filterType) &&
            (searchQuery === "" || h.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => parseInt(a.time) - parseInt(b.time));

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
            {/* Sidebar / List */}
            <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
                <div className="sticky top-0 z-10 bg-surface-secondary dark:bg-surface-dark pb-2">
                    <h1 className="text-display-sm mb-1">Nearby Hospitals</h1>
                    <p className="text-body-md text-content-secondary mb-4">Finding the fastest route for patient transfer</p>
                    
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                        <Input 
                            placeholder="Search hospitals..." 
                            className="pl-10" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {["All", "Multi-specialty", "Trauma Care", "General"].map(t => (
                            <Badge 
                                key={t}
                                variant={filterType === t ? "primary" : "secondary"} 
                                className="cursor-pointer whitespace-nowrap"
                                onClick={() => setFilterType(t)}
                            >
                                {t}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredHospitals.map(h => (
                        <motion.div 
                            key={h.id}
                            whileHover={{ y: -2 }}
                            onClick={() => setSelectedHospital(h)}
                        >
                            <Card 
                                padding="md" 
                                className={`cursor-pointer transition-all border-2 ${selectedHospital.id === h.id ? "border-primary-500 shadow-lg" : "border-transparent"}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-body-sm font-bold">{h.name}</h3>
                                            <p className="text-caption text-content-tertiary">{h.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-body-sm font-bold text-primary-600">{h.time}</p>
                                        <p className="text-caption text-content-tertiary">{h.distance}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex gap-2">
                                        <Badge variant={h.beds > 10 ? "success" : "danger"} size="sm" dot>{h.beds} Beds</Badge>
                                        {h.oxygen && <Badge variant="info" size="sm">O2 ✅</Badge>}
                                    </div>
                                    <div className="flex items-center gap-1 text-caption font-bold">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        {h.rating}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl border-4 border-white dark:border-gray-900">
                <AmbulanceLiveMap 
                    hospitals={HOSPITALS} 
                    selectedHospitalId={selectedHospital.id}
                    ambulancePos={AMBULANCE_POS}
                />

                {/* Map Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
                    <button className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Navigation className="w-6 h-6 text-primary-600" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Filter className="w-6 h-6 text-content-primary" />
                    </button>
                </div>

                {/* Selected Hospital Info Card (Floating Overlay) */}
                <AnimatePresence mode="wait">
                    {selectedHospital && (
                        <motion.div 
                            key={selectedHospital.id}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="absolute bottom-8 left-8 right-8 lg:left-auto lg:w-[420px] bg-white dark:bg-surface-dark-card rounded-3xl shadow-2xl border border-white/50 dark:border-gray-800 overflow-hidden z-[400]"
                        >
                            <div className="bg-primary-600 p-6 text-white relative">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Fastest Route Identified</span>
                                        </div>
                                        <h2 className="text-display-xs font-bold">{selectedHospital.name}</h2>
                                        <p className="text-body-sm text-white/80">{selectedHospital.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-display-md font-display leading-none">{selectedHospital.time}</div>
                                        <div className="text-caption text-white/70 mt-1">{selectedHospital.distance} away</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-surface-dark-elevated border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                <Bed className="w-4 h-4" />
                                            </div>
                                            <span className="text-caption text-content-tertiary font-bold uppercase">Beds</span>
                                        </div>
                                        <p className="text-body-lg font-bold text-emerald-600">{selectedHospital.beds} Available</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-surface-dark-elevated border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                                <HeartPulse className="w-4 h-4" />
                                            </div>
                                            <span className="text-caption text-content-tertiary font-bold uppercase">ER Status</span>
                                        </div>
                                        <p className="text-body-lg font-bold text-red-600">Ready</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        fullWidth 
                                        size="lg" 
                                        leftIcon={<Navigation className="w-5 h-5" />}
                                        className="h-14 rounded-2xl shadow-lg shadow-primary-500/20"
                                    >
                                        Accept & Navigate
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-14 w-14 p-0 rounded-2xl border-gray-200">
                                        <Phone className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

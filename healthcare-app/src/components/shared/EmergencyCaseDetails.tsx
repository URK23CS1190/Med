"use client";

import { motion } from "framer-motion";
import { Siren, MapPin, Activity, Heart, Thermometer, ShieldAlert } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

interface EmergencyCaseDetailsProps {
    emergency: {
        id: string;
        patient: string;
        age: number;
        gender: string;
        location: string;
        condition: string;
        vitals: {
            heartRate: number;
            bp: string;
            spO2: number;
            temp: string;
        };
        eta: string;
        severity: "critical" | "serious" | "stable";
    };
    onAccept: () => void;
    onDecline: () => void;
}

export function EmergencyCaseDetails({ emergency, onAccept, onDecline }: EmergencyCaseDetailsProps) {
    return (
        <Card padding="none" className="overflow-hidden border-2 border-red-100 dark:border-red-900 shadow-2xl">
            <div className="bg-red-600 p-6 text-white overflow-hidden relative">
                <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"
                />
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert className="w-5 h-5 text-red-200 animate-bounce" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-red-100">Active Emergency Request</span>
                        </div>
                        <h2 className="text-display-sm font-bold">{emergency.patient}</h2>
                        <p className="text-body-md text-red-100">{emergency.age}y • {emergency.gender} • {emergency.id}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <Badge variant="danger" className="bg-white text-red-600 font-bold border-0 px-4 py-1.5 shadow-lg">
                            {emergency.severity.toUpperCase()}
                        </Badge>
                        <div className="mt-4 text-right">
                            <p className="text-caption text-red-200 font-bold">ESTIMATED ETA</p>
                            <p className="text-display-xs font-display">{emergency.eta}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary font-bold uppercase tracking-wider">Pickup Location</p>
                        <p className="text-body-md font-bold text-content-primary mt-1">{emergency.location}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <VitalCard icon={<Heart className="w-4 h-4" />} label="Heart Rate" value={`${emergency.vitals.heartRate} bpm`} color="text-red-500" />
                    <VitalCard icon={<Activity className="w-4 h-4" />} label="Blood Pressure" value={emergency.vitals.bp} color="text-blue-500" />
                    <VitalCard icon={<Siren className="w-4 h-4" />} label="SpO2" value={`${emergency.vitals.spO2}%`} color="text-emerald-500" />
                    <VitalCard icon={<Thermometer className="w-4 h-4" />} label="Temp" value={emergency.vitals.temp} color="text-amber-500" />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-body-md font-bold">Chief Complaints</h3>
                        <Badge variant="info" size="sm">Pre-calculated Diagnosis</Badge>
                    </div>
                    <p className="text-body-sm text-content-secondary leading-relaxed p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 italic">
                        &ldquo;{emergency.condition}&rdquo;
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button 
                        fullWidth 
                        size="lg" 
                        className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                        onClick={onAccept}
                    >
                        Accept Request & Dispatch
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-16 rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
                        onClick={onDecline}
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function VitalCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
            <div className={`w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-2 ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] text-content-tertiary font-bold uppercase mb-1">{label}</p>
            <p className="text-body-sm font-bold">{value}</p>
        </div>
    );
}

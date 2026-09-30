"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Truck, Siren, HeartPulse } from "lucide-react";

type TripStep = "request" | "en_route" | "arrived" | "stabilizing" | "transferring" | "completed";

interface TripStepConfig {
    key: TripStep;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const STEPS: TripStepConfig[] = [
    { key: "request", label: "Request Received", description: "Emergency call validated", icon: <Clock className="w-4 h-4" /> },
    { key: "en_route", label: "En Route", description: "Ambulance dispatched", icon: <Truck className="w-4 h-4" /> },
    { key: "arrived", label: "Arrived", description: "Reached pickup location", icon: <MapPin className="w-4 h-4" /> },
    { key: "stabilizing", label: "Stabilizing", description: "Medical care in progress", icon: <HeartPulse className="w-4 h-4" /> },
    { key: "transferring", label: "Transferring", description: "Headed to hospital", icon: <Siren className="w-4 h-4" /> },
    { key: "completed", label: "Completed", description: "Patient handed over", icon: <CheckCircle2 className="w-4 h-4" /> },
];

export function TripWorkflowTracker({ currentStep }: { currentStep: TripStep }) {
    const currentIndex = STEPS.findIndex(s => s.key === currentStep);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    
                    return (
                        <div key={step.key} className="relative">
                            <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${isActive ? "bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500 shadow-lg shadow-primary-500/10 scale-105 z-10" : "bg-transparent"}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                                    isActive ? "bg-primary-500 border-primary-500 text-white animate-pulse" :
                                    "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-content-tertiary"
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-primary-600" : isCompleted ? "text-emerald-600" : "text-content-tertiary"}`}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[70%] w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-0">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: isCompleted ? "100%" : "0%" }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

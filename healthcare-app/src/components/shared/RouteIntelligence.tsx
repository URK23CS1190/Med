"use client";

import { Navigation, Clock, AlertTriangle, Fuel, Gauge } from "lucide-react";
import { Card, Badge } from "@/components/ui";

export function RouteIntelligence() {
    return (
        <Card padding="md" className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-body-lg font-bold flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary-500" /> Route Intelligence
                </h3>
                <Badge variant="info">Optimization Active</Badge>
            </div>

            <div className="space-y-4">
                <RouteOption 
                    label="Primary Route" 
                    time="12 mins" 
                    distance="8.2 km" 
                    traffic="Medium" 
                    active 
                />
                <RouteOption 
                    label="Alternative A" 
                    time="15 mins" 
                    distance="10.5 km" 
                    traffic="Low" 
                    delay="+3m"
                />
                <RouteOption 
                    label="Alternative B" 
                    time="22 mins" 
                    distance="7.8 km" 
                    traffic="Heavy" 
                    delay="+10m"
                    warning="Accident on Link Rd"
                />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <Fuel className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-content-tertiary font-bold uppercase">Estimated Fuel</p>
                        <p className="text-body-sm font-bold">1.2L Consumption</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Gauge className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-content-tertiary font-bold uppercase">Speed Avg</p>
                        <p className="text-body-sm font-bold">42 km/h</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

interface RouteOptionProps {
    label: string;
    time: string;
    distance: string;
    traffic: string;
    delay?: string;
    warning?: string;
    active?: boolean;
}

function RouteOption({ label, time, distance, traffic, delay, warning, active }: RouteOptionProps) {
    return (
        <div className={`p-4 rounded-2xl border-2 transition-all ${active ? "border-primary-500 bg-primary-50/30 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5" : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-content-tertiary"}`}>
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`text-body-sm font-bold ${active ? "text-primary-700 dark:text-primary-400" : "text-content-primary"}`}>{label}</p>
                        <p className="text-caption text-content-tertiary">{distance} • {traffic} Traffic</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-body-md font-bold ${active ? "text-primary-600" : "text-content-primary"}`}>{time}</p>
                    {delay && <p className="text-caption font-bold text-red-500">{delay}</p>}
                </div>
            </div>
            {warning && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-[10px] font-bold text-red-600 uppercase italic">
                    <AlertTriangle className="w-3 h-3" /> {warning}
                </div>
            )}
        </div>
    );
}

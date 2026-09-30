"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, CheckCircle2, Siren, UserPlus, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

export function BedReservationWorkflow() {
    const [status, setStatus] = useState<"idle" | "requesting" | "confirmed">("idle");

    return (
        <Card padding="md" className="border-2 border-primary-100 dark:border-primary-900 shadow-xl overflow-hidden relative">
            <AnimatePresence>
                {status === "confirmed" && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm z-10 pointer-events-none" 
                    />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Bed className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-body-lg font-bold">Bed Reservation</h3>
                        <p className="text-caption text-content-tertiary uppercase font-bold tracking-wider">Hospital Pre-Arrival</p>
                    </div>
                </div>
                {status === "confirmed" ? (
                    <Badge variant="success" size="lg" pulse dot>Bed #402 Secured</Badge>
                ) : (
                    <Badge variant="inactive">Pending Request</Badge>
                )}
            </div>

            <div className="space-y-4 relative z-20">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3 text-caption font-bold text-content-tertiary">
                        <span>HOSPITAL PREP CHECKLIST</span>
                        <span className="text-primary-600">60% READY</span>
                    </div>
                    <div className="space-y-2">
                        <CheckItem label="Patient ID Transmitted" checked />
                        <CheckItem label="Vitals Live Feed" checked />
                        <CheckItem label="ICU Team Alerted" checked={status === "confirmed"} />
                    </div>
                </div>

                {status === "idle" ? (
                    <Button 
                        fullWidth 
                        size="xl" 
                        leftIcon={<UserPlus className="w-5 h-5" />}
                        onClick={() => setStatus("requesting")}
                        className="shadow-lg shadow-primary-500/20"
                    >
                        Request Emergency Bed
                    </Button>
                ) : status === "requesting" ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                            <p className="text-body-sm font-bold text-amber-700">Awaiting Signal from Lilavati ER...</p>
                        </div>
                        <Button 
                            fullWidth 
                            variant="secondary"
                            onClick={() => setStatus("confirmed")}
                        >
                            Confirm Selection
                        </Button>
                    </div>
                ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-body-sm font-bold text-emerald-700">Admission Process Started</p>
                            <p className="text-caption text-emerald-600">Trauma Bay 2 is cleared for arrival.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-caption text-content-tertiary italic flex items-center gap-1">
                    <Siren className="w-3 h-3" /> Priority Level Alpha
                </p>
                <button className="text-caption font-bold text-primary-600 flex items-center gap-1 hover:underline">
                    View Details <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </Card>
    );
}

function CheckItem({ label, checked }: { label: string, checked?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 dark:border-gray-600"}`}>
                {checked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-3 h-3" /></motion.div>}
            </div>
            <span className={`text-body-xs ${checked ? "text-content-primary font-medium" : "text-content-tertiary"}`}>{label}</span>
        </div>
    );
}

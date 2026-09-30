"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, AlertTriangle, Siren, Loader2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";

export function FloatingEmergencyButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<"idle" | "getting_location" | "sending" | "sent">("idle");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const handleSOS = () => {
        setIsOpen(true);
        if (status === "idle") {
            startEmergencyFlow();
        }
    };

    const startEmergencyFlow = () => {
        setStatus("getting_location");

        // Simulate geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    sendAlert();
                },
                () => {
                    // Fallback if denied
                    setLocation({ lat: 19.076, lng: 72.877 });
                    sendAlert();
                }
            );
        } else {
            sendAlert();
        }
    };

    const sendAlert = () => {
        setStatus("sending");
        setTimeout(() => {
            setStatus("sent");
            // Simulate auto-call trigger
            console.log("Initiating emergency call to 102...");
        }, 1500);
    };

    return (
        <>
            <div className="fixed bottom-24 right-6 z-[100] md:bottom-10">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSOS}
                    className="w-16 h-16 rounded-full bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center border-4 border-white dark:border-gray-900 group relative"
                >
                    <Siren className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold items-center justify-center">!</span>
                    </span>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-surface-dark-card rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="bg-red-600 p-8 text-white text-center">
                                <AlertTriangle className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                                <h2 className="text-display-sm font-bold mb-2">EMERGENCY SOS</h2>
                                <p className="text-white/80">Connecting you to nearest medical services</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-surface-dark-elevated">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-caption text-content-tertiary">Live Location</p>
                                                <p className="text-body-sm font-bold">
                                                    {status === "getting_location" ? "Locating..." : location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Detecting..."}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={location ? "success" : "warning"}>{location ? "SHARING" : "WAITING"}</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-surface-dark-elevated">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-caption text-content-tertiary">Emergency Call</p>
                                                <p className="text-body-sm font-bold">Ambulance (102)</p>
                                            </div>
                                        </div>
                                        <Badge variant={status === "sent" ? "success" : "info"}>{status === "sent" ? "CONNECTED" : "CALLING"}</Badge>
                                    </div>
                                </div>

                                {status === "sending" || status === "getting_location" ? (
                                    <div className="flex flex-col items-center gap-3 py-4">
                                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                                        <p className="text-body-md font-medium text-red-600">
                                            {status === "getting_location" ? "Fetching Location..." : "Sending SOS Signal..."}
                                        </p>
                                    </div>
                                ) : status === "sent" ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-center">
                                            <p className="text-emerald-700 dark:text-emerald-400 font-bold">SOS Signal Received!</p>
                                            <p className="text-caption text-emerald-600">Ambulance is tracking your location.</p>
                                        </div>
                                        <Button fullWidth size="lg" variant="outline" onClick={() => setIsOpen(false)}>
                                            Close Portal
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button fullWidth size="lg" variant="outline" onClick={() => setIsOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button fullWidth size="lg" className="bg-red-600 hover:bg-red-700" onClick={startEmergencyFlow}>
                                            Retry
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

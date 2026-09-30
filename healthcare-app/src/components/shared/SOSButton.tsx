"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, MapPin, AlertTriangle } from "lucide-react";

export function SOSButton() {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSOS = () => {
        setIsExpanded(true);
    };

    const handleEmergencyCall = () => {
        window.location.href = "tel:112";
    };

    const handleFindICU = () => {
        window.location.href = "/patient/emergency";
        setIsExpanded(false);
    };

    return (
        <>
            {/* Floating SOS Button */}
            <motion.button
                onClick={handleSOS}
                className="
          fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50
          w-14 h-14 rounded-full
          bg-status-danger text-white
          shadow-sos animate-sos-pulse
          flex items-center justify-center
          hover:bg-red-600 active:scale-95
          transition-all duration-200
        "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Emergency SOS"
            >
                <AlertTriangle className="w-6 h-6" />
            </motion.button>

            {/* SOS Expanded Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsExpanded(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="
                fixed bottom-0 left-0 right-0 z-[60]
                bg-white dark:bg-surface-dark-elevated
                rounded-t-[24px] p-6
                md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                md:rounded-card md:max-w-sm md:w-full
              "
                        >
                            {/* Close */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Close emergency panel"
                            >
                                <X className="w-5 h-5 text-content-tertiary" />
                            </button>

                            {/* Emergency Icon */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                                    <AlertTriangle className="w-8 h-8 text-status-danger" />
                                </div>
                                <h2 className="text-heading-lg text-status-danger font-display">
                                    Emergency SOS
                                </h2>
                                <p className="text-body-sm text-content-secondary text-center mt-1">
                                    Get immediate help. Your location will be shared.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleEmergencyCall}
                                    className="
                    w-full flex items-center justify-center gap-3
                    h-14 rounded-button bg-status-danger text-white
                    text-body-lg font-semibold
                    hover:bg-red-600 active:scale-[0.97]
                    transition-all duration-200
                  "
                                >
                                    <Phone className="w-5 h-5" />
                                    Call Emergency (112)
                                </button>

                                <button
                                    onClick={handleFindICU}
                                    className="
                    w-full flex items-center justify-center gap-3
                    h-14 rounded-button bg-primary-500 text-white
                    text-body-lg font-semibold
                    hover:bg-primary-600 active:scale-[0.97]
                    transition-all duration-200
                  "
                                >
                                    <MapPin className="w-5 h-5" />
                                    Find Nearest ICU
                                </button>

                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="
                    w-full h-12 rounded-button border-2 border-gray-200 dark:border-gray-700
                    text-body-md font-medium text-content-secondary
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition-all duration-200
                  "
                                >
                                    I&apos;m Safe — Cancel
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

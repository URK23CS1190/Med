"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Send, X, Flag, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    context?: string;
}

const REPORT_TYPES = [
    { id: "technical", label: "Technical Issue", icon: <HelpCircle className="w-5 h-5" /> },
    { id: "incorrect_info", label: "Incorrect Information", icon: <Flag className="w-5 h-5" /> },
    { id: "feedback", label: "General Feedback", icon: <MessageCircle className="w-5 h-5" /> },
    { id: "urgent", label: "Urgent Problem", icon: <AlertTriangle className="w-5 h-5" /> },
];

export function ReportModal({ isOpen, onClose, context }: ReportModalProps) {
    const [selectedType, setSelectedType] = useState(REPORT_TYPES[0].id);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsDone(true);
            setTimeout(() => {
                onClose();
                setIsDone(false);
                setMessage("");
            }, 2000);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-surface-dark-card rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                            <div>
                                <h2 className="text-body-lg font-bold">Report / Feedback</h2>
                                {context && <p className="text-caption text-content-tertiary">Context: {context}</p>}
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {isDone ? (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                        <Send className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-heading-sm font-bold">Report Submitted!</h3>
                                    <p className="text-body-md text-content-secondary">Thank you for helping us improve.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        {REPORT_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedType(type.id)}
                                                className={`
                                                    p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                                                    ${selectedType === type.id 
                                                        ? "border-primary-500 bg-primary-50/30 dark:bg-primary-900/10 text-primary-600" 
                                                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200"
                                                    }
                                                `}
                                            >
                                                {type.icon}
                                                <span className="text-[11px] font-bold">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-body-sm font-semibold">Describe the issue</label>
                                        <textarea 
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Please provide details..."
                                            className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                                        />
                                    </div>

                                    <Button 
                                        fullWidth 
                                        size="lg" 
                                        disabled={!message || isSubmitting}
                                        onClick={handleSubmit}
                                        isLoading={isSubmitting}
                                    >
                                        Submit Report
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

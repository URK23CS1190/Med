"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useUIStore, type Toast as ToastType } from "@/stores";

const icons: Record<ToastType["variant"], React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-status-success" />,
    error: <AlertCircle className="w-5 h-5 text-status-danger" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning" />,
    info: <Info className="w-5 h-5 text-primary-500" />,
};

const borderColors: Record<ToastType["variant"], string> = {
    success: "border-l-status-success",
    error: "border-l-status-danger",
    warning: "border-l-status-warning",
    info: "border-l-primary-500",
};

function ToastItem({ toast }: { toast: ToastType }) {
    const removeToast = useUIStore((s) => s.removeToast);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
        flex items-start gap-3 p-4 rounded-card
        bg-white dark:bg-surface-dark-elevated
        shadow-elevated border-l-4 ${borderColors[toast.variant]}
        min-w-[320px] max-w-[420px]
      `}
            role="alert"
            aria-live="polite"
        >
            {icons[toast.variant]}
            <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary">
                    {toast.title}
                </p>
                {toast.description && (
                    <p className="mt-0.5 text-body-sm text-content-secondary dark:text-content-dark-secondary">
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4 text-content-tertiary" />
            </button>
        </motion.div>
    );
}

export function ToastContainer() {
    const toasts = useUIStore((s) => s.toasts);

    return (
        <div
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
            aria-label="Notifications"
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Hook for easy toast usage
export function useToast() {
    const addToast = useUIStore((s) => s.addToast);
    return {
        success: (title: string, description?: string) =>
            addToast({ title, description, variant: "success" }),
        error: (title: string, description?: string) =>
            addToast({ title, description, variant: "error" }),
        warning: (title: string, description?: string) =>
            addToast({ title, description, variant: "warning" }),
        info: (title: string, description?: string) =>
            addToast({ title, description, variant: "info" }),
    };
}

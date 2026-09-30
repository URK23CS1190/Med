"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
    bgColor?: string;
    trend?: { value: number; label: string };
    delay?: number;
    onClick?: () => void;
}

export function StatCard({ label, value, icon, color = "text-primary-500", bgColor = "bg-primary-50 dark:bg-primary-900/20", trend, delay = 0, onClick }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            onClick={onClick}
            className={`card-base p-5 ${onClick ? "cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all" : ""}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${bgColor}`}>
                    <div className={color}>{icon}</div>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${trend.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                        {trend.value >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <p className="text-body-sm text-content-secondary dark:text-content-dark-secondary mb-1">{label}</p>
            <p className="text-heading-lg font-bold text-content-primary dark:text-content-dark-primary">{value}</p>
            {trend && (
                <p className="text-[11px] text-content-tertiary mt-1">{trend.label}</p>
            )}
        </motion.div>
    );
}

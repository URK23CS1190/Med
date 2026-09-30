"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, Footprints, Timer, Flame, TrendingUp,
    Plus, Trash2, ChevronRight, Loader2, AlertCircle
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";
import { format } from "date-fns";

type ActivityType = "Walking" | "Jogging" | "Running" | "Cycling" | "Other";

interface HealthEntry {
    id: string;
    type: ActivityType;
    duration_min: number;
    distance_km: number | null;
    notes: string | null;
    created_at: string;
}

const ACTIVITY_META: Record<ActivityType, { icon: string; color: string; bg: string; cal: number }> = {
    Walking:  { icon: "🚶", color: "text-emerald-600",  bg: "bg-emerald-50 dark:bg-emerald-900/20",  cal: 4 },
    Jogging:  { icon: "🏃", color: "text-blue-600",     bg: "bg-blue-50 dark:bg-blue-900/20",        cal: 8 },
    Running:  { icon: "⚡", color: "text-violet-600",   bg: "bg-violet-50 dark:bg-violet-900/20",    cal: 11 },
    Cycling:  { icon: "🚴", color: "text-amber-600",    bg: "bg-amber-50 dark:bg-amber-900/20",      cal: 7 },
    Other:    { icon: "💪", color: "text-rose-600",     bg: "bg-rose-50 dark:bg-rose-900/20",        cal: 5 },
};

const ACTIVITIES: ActivityType[] = ["Walking", "Jogging", "Running", "Cycling", "Other"];

export function ExerciseTracker() {
    const user = useAuthStore((s) => s.user);
    const supabase = getSupabaseBrowserClient();

    const [entries, setEntries] = useState<HealthEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [type, setType] = useState<ActivityType>("Walking");
    const [duration, setDuration] = useState("");
    const [distance, setDistance] = useState("");
    const [notes, setNotes] = useState("");

    const fetchEntries = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error: err } = await supabase
            .from("health_tracker_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);
        if (err) setError(err.message);
        else setEntries((data as HealthEntry[]) ?? []);
        setLoading(false);
    }, [user, supabase]);

    useEffect(() => { fetchEntries(); }, [fetchEntries]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !duration) return;
        setSaving(true);
        setError(null);
        const { error: err } = await supabase.from("health_tracker_entries").insert({
            user_id:     user.id,
            type,
            duration_min: parseInt(duration),
            distance_km:  distance ? parseFloat(distance) : null,
            notes:        notes || null,
        });
        if (err) { setError(err.message); }
        else {
            setDuration(""); setDistance(""); setNotes(""); setShowForm(false);
            await fetchEntries();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        await supabase.from("health_tracker_entries").delete().eq("id", id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    // Summary stats
    const totalMin   = entries.reduce((s, e) => s + e.duration_min, 0);
    const totalKm    = entries.reduce((s, e) => s + (e.distance_km ?? 0), 0);
    const totalCal   = entries.reduce((s, e) => s + e.duration_min * ACTIVITY_META[e.type].cal, 0);
    const totalSessions = entries.length;

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-content-primary dark:text-content-dark-primary">
                        Health Tracker
                    </h1>
                    <p className="text-sm text-content-secondary dark:text-content-dark-secondary mt-0.5">
                        Log your daily activities and stay healthy
                    </p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-button
                               bg-gradient-to-r from-primary-500 to-secondary-500
                               text-white text-sm font-semibold shadow-md hover:shadow-lg
                               transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
                    Log Activity
                </motion.button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Sessions",    value: totalSessions,          unit: "",    icon: <Activity className="w-5 h-5" />,    color: "text-primary-500"   },
                    { label: "Active Time", value: totalMin,               unit: "min", icon: <Timer className="w-5 h-5" />,       color: "text-secondary-500" },
                    { label: "Distance",    value: totalKm.toFixed(1),     unit: "km",  icon: <Footprints className="w-5 h-5" />,  color: "text-violet-500"    },
                    { label: "Calories",    value: Math.round(totalCal),   unit: "cal", icon: <Flame className="w-5 h-5" />,       color: "text-amber-500"     },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-base p-4 flex flex-col gap-1"
                    >
                        <div className={`${stat.color}`}>{stat.icon}</div>
                        <p className="text-xl font-bold text-content-primary dark:text-content-dark-primary">
                            {stat.value}<span className="text-xs font-normal ml-0.5 text-content-tertiary">{stat.unit}</span>
                        </p>
                        <p className="text-xs text-content-secondary dark:text-content-dark-secondary">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-button bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Log Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="card-base p-5 space-y-4 overflow-hidden"
                    >
                        <h2 className="font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary-500" />
                            Log New Activity
                        </h2>

                        {/* Activity Type */}
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {ACTIVITIES.map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setType(a)}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-button border-2 transition-all text-xs font-medium
                                        ${type === a
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                            : "border-gray-200 dark:border-gray-700 hover:border-primary-300 text-content-secondary dark:text-content-dark-secondary"
                                        }`}
                                >
                                    <span className="text-xl">{ACTIVITY_META[a].icon}</span>
                                    {a}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-content-secondary dark:text-content-dark-secondary mb-1">
                                    Duration (min) *
                                </label>
                                <input
                                    type="number" min="1" max="480" required
                                    value={duration} onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                               bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                               focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                    placeholder="e.g. 30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-content-secondary dark:text-content-dark-secondary mb-1">
                                    Distance (km)
                                </label>
                                <input
                                    type="number" min="0" step="0.1"
                                    value={distance} onChange={(e) => setDistance(e.target.value)}
                                    className="w-full px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                               bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                               focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                    placeholder="optional"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-content-secondary dark:text-content-dark-secondary mb-1">
                                Notes
                            </label>
                            <input
                                type="text" maxLength={200}
                                value={notes} onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                           bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                           focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                placeholder="Felt great today!"
                            />
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit" disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-button
                                           bg-gradient-to-r from-primary-500 to-secondary-500
                                           text-white text-sm font-semibold disabled:opacity-60
                                           transition-all duration-200 hover:shadow-md"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Save Entry
                            </button>
                            <button
                                type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2.5 rounded-button text-sm font-medium
                                           text-content-secondary hover:bg-gray-100 dark:hover:bg-gray-800
                                           transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Entries List */}
            <div className="space-y-3">
                <h2 className="font-semibold text-sm text-content-secondary dark:text-content-dark-secondary uppercase tracking-wide">
                    Recent Activities
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                ) : entries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="card-base p-10 text-center"
                    >
                        <span className="text-5xl">🏃</span>
                        <p className="mt-3 font-medium text-content-primary dark:text-content-dark-primary">
                            No activities yet
                        </p>
                        <p className="text-sm text-content-secondary dark:text-content-dark-secondary mt-1">
                            Log your first workout to get started!
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence initial={false}>
                        {entries.map((entry) => {
                            const meta = ACTIVITY_META[entry.type];
                            const cal = Math.round(entry.duration_min * meta.cal);
                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="card-base p-4 flex items-center gap-4"
                                >
                                    <div className={`w-11 h-11 rounded-button flex items-center justify-center text-xl flex-shrink-0 ${meta.bg}`}>
                                        {meta.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold text-sm ${meta.color}`}>{entry.type}</span>
                                            <ChevronRight className="w-3 h-3 text-content-tertiary" />
                                            <span className="text-xs text-content-secondary dark:text-content-dark-secondary">
                                                {format(new Date(entry.created_at), "MMM d, h:mm a")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-content-secondary dark:text-content-dark-secondary">
                                            <span className="flex items-center gap-1">
                                                <Timer className="w-3 h-3" />{entry.duration_min} min
                                            </span>
                                            {entry.distance_km && (
                                                <span className="flex items-center gap-1">
                                                    <Footprints className="w-3 h-3" />{entry.distance_km} km
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Flame className="w-3 h-3 text-amber-500" />~{cal} cal
                                            </span>
                                        </div>
                                        {entry.notes && (
                                            <p className="text-xs text-content-tertiary mt-0.5 truncate">{entry.notes}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="p-2 rounded-button text-content-tertiary hover:text-red-500
                                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                                        aria-label="Delete entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

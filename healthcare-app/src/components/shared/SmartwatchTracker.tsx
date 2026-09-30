"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, Heart, Footprints,
    Plus, Trash2, ShieldAlert, Thermometer, Moon, Zap,
    TrendingUp, Loader2
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";
import { format } from "date-fns";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui";


type ActivityType = "Walking" | "Jogging" | "Running" | "Cycling" | "Other";

interface HealthEntry {
    id: string;
    type: ActivityType;
    duration_min: number;
    distance_km: number | null;
    notes: string | null;
    created_at: string;
}

export function SmartwatchTracker() {
    const user = useAuthStore((s) => s.user);
    const supabase = getSupabaseBrowserClient();

    // Vitals Simulation States
    const [heartRate, setHeartRate] = useState(72);
    const [heartRateHistory, setHeartRateHistory] = useState<{ time: string; bpm: number }[]>([]);
    const [steps, setSteps] = useState(6420);
    const [calories, setCalories] = useState(320);
    const [distanceActive, setDistanceActive] = useState(4.8);
    const [activeMin, setActiveMin] = useState(45);
    const [spo2] = useState(98);
    const [temp] = useState(36.6);
    const [sleepHours] = useState(7.2);
    const [simulating, setSimulating] = useState(true);

    // Logging entries state
    const [entries, setEntries] = useState<HealthEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form inputs state
    const [activityType, setActivityType] = useState<ActivityType>("Walking");
    const [duration, setDuration] = useState("");
    const [distance, setDistance] = useState("");
    const [notes, setNotes] = useState("");

    // Simulate real-time smartwatch vitals (Heart rate pulse, occasional step increment)
    useEffect(() => {
        if (!simulating) return;

        // Seed initial history
        const initialHistory = Array.from({ length: 15 }, (_, i) => {
            const date = new Date(Date.now() - (15 - i) * 5000);
            return {
                time: format(date, "HH:mm:ss"),
                bpm: Math.floor(Math.random() * (85 - 65 + 1)) + 65,
            };
        });
        setHeartRateHistory(initialHistory);

        const interval = setInterval(() => {
            // Heartbeat fluctuation (e.g. 68 to 82 BPM)
            setHeartRate((prev) => {
                const diff = Math.floor(Math.random() * 7) - 3; // -3 to +3
                const nextBpm = Math.max(60, Math.min(120, prev + diff));

                setHeartRateHistory((history) => {
                    const updated = [...history.slice(1), { time: format(new Date(), "HH:mm:ss"), bpm: nextBpm }];
                    return updated;
                });

                return nextBpm;
            });

            // Random step counter increase
            if (Math.random() > 0.7) {
                const addedSteps = Math.floor(Math.random() * 8) + 2;
                setSteps((s) => s + addedSteps);
                setDistanceActive((d) => parseFloat((d + addedSteps * 0.00075).toFixed(3)));
                setCalories((c) => c + Math.round(addedSteps * 0.04));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [simulating]);

    // Fetch logged activities
    const fetchEntries = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error: err } = await supabase
            .from("health_tracker_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);
        if (err) setError(err.message);
        else setEntries((data as HealthEntry[]) ?? []);
        setLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchEntries();
    }, [user, fetchEntries]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !duration) return;
        setSaving(true);
        setError(null);
        try {
            const { error: err } = await supabase.from("health_tracker_entries").insert({
                user_id: user.id,
                type: activityType,
                duration_min: parseInt(duration),
                distance_km: distance ? parseFloat(distance) : null,
                notes: notes || null,
            });
            if (err) throw err;
            setDuration("");
            setDistance("");
            setNotes("");
            setShowForm(false);
            fetchEntries();

            // Add logged activity stats directly to smartwatch active counters
            setActiveMin((m) => m + parseInt(duration));
            if (distance) setDistanceActive((d) => d + parseFloat(distance));
            const calBurn = parseInt(duration) * (activityType === "Running" ? 11 : activityType === "Jogging" ? 8 : 4);
            setCalories((c) => c + calBurn);
        } catch (err: unknown) {
            setError((err as { message?: string }).message || "Failed to log workout");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        await supabase.from("health_tracker_entries").delete().eq("id", id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary font-display flex items-center gap-2">
                        <Activity className="w-8 h-8 text-primary-500 animate-pulse" />
                        Vitals & smartwatch Tracker
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">
                        Real-time biometric data synced from your MedCare Smart Ring / Smartwatch.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSimulating(!simulating)}
                        className={`px-3 py-1.5 rounded-button text-xs font-semibold border transition-all ${
                            simulating
                                ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800"
                                : "bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700"
                        }`}
                    >
                        {simulating ? "🟢 Live Sensor Feed Syncing" : "🔴 Biometric Sync Paused"}
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-button bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4" /> Log workout
                    </button>
                </div>
            </div>

            {/* Smartwatch Screen Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Pulse Monitor */}
                <Card className="md:col-span-2 overflow-hidden flex flex-col justify-between">
                    <div className="p-4 flex items-center justify-between border-b dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500 animate-bounce" />
                            <h2 className="text-heading-sm font-semibold text-content-primary dark:text-content-dark-primary">Heartbeat Tracker</h2>
                        </div>
                        <span className="text-display-sm font-bold text-red-500 tabular-nums">
                            {heartRate} <span className="text-xs font-normal text-content-tertiary">BPM</span>
                        </span>
                    </div>
                    <div className="h-44 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={heartRateHistory}>
                                <defs>
                                    <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis domain={[50, 110]} hide />
                                <Tooltip labelClassName="text-black" />
                                <Area type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#heartGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 text-center border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 py-3">
                        <div>
                            <p className="text-caption text-content-tertiary">Resting Rate</p>
                            <p className="text-body-lg font-bold text-content-primary dark:text-content-dark-primary">64 BPM</p>
                        </div>
                        <div>
                            <p className="text-caption text-content-tertiary">Max Observed</p>
                            <p className="text-body-lg font-bold text-red-500">98 BPM</p>
                        </div>
                        <div>
                            <p className="text-caption text-content-tertiary">Status</p>
                            <p className="text-body-lg font-bold text-emerald-500">Normal</p>
                        </div>
                    </div>
                </Card>

                {/* 2. Steps Circle Ring */}
                <Card className="flex flex-col items-center justify-between p-6">
                    <div className="w-full text-left">
                        <h2 className="text-heading-sm font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                            <Footprints className="w-4 h-4 text-emerald-500" /> Running & Steps
                        </h2>
                        <p className="text-caption text-content-tertiary">Daily target: 10,000 steps</p>
                    </div>
                    
                    <div className="relative flex items-center justify-center my-6">
                        {/* Custom Circular Progress Tracker */}
                        <svg className="w-36 h-36 transform -rotate-90">
                            <circle cx="72" cy="72" r="62" strokeWidth="8" stroke="currentColor" className="text-gray-100 dark:text-gray-800" fill="transparent" />
                            <circle cx="72" cy="72" r="62" strokeWidth="8" stroke="currentColor" className="text-emerald-500" fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 62} 
                                    strokeDashoffset={2 * Math.PI * 62 * (1 - Math.min(steps, 10000) / 10000)} 
                                    strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-content-primary dark:text-content-dark-primary">{steps.toLocaleString()}</span>
                            <span className="text-[10px] uppercase font-bold text-content-tertiary tracking-wider">steps</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-1">
                            <p className="text-content-tertiary">Distance</p>
                            <p className="font-bold text-content-primary dark:text-content-dark-primary">{distanceActive} km</p>
                        </div>
                        <div className="p-1">
                            <p className="text-content-tertiary">Active</p>
                            <p className="font-bold text-content-primary dark:text-content-dark-primary">{activeMin} m</p>
                        </div>
                        <div className="p-1">
                            <p className="text-content-tertiary">Calories</p>
                            <p className="font-bold text-content-primary dark:text-content-dark-primary">{calories} kcal</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Smartwatch Sensor Widget Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* SpO2 */}
                <Card padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-xl flex-shrink-0">
                        <Zap className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary">Blood Oxygen (SpO2)</p>
                        <h3 className="text-body-lg font-bold text-content-primary dark:text-content-dark-primary">{spo2}%</h3>
                        <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Optimal levels</p>
                    </div>
                </Card>

                {/* Skin Temperature */}
                <Card padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center text-xl flex-shrink-0">
                        <Thermometer className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary">Body Temperature</p>
                        <h3 className="text-body-lg font-bold text-content-primary dark:text-content-dark-primary">{temp} °C</h3>
                        <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Healthy & stable</p>
                    </div>
                </Card>

                {/* Sleep Monitor */}
                <Card padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center text-xl flex-shrink-0">
                        <Moon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary">Last Night&apos;s Sleep</p>
                        <h3 className="text-body-lg font-bold text-content-primary dark:text-content-dark-primary">{sleepHours} hrs</h3>
                        <p className="text-[10px] text-purple-500 font-semibold mt-0.5">84/100 Quality Score</p>
                    </div>
                </Card>

            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-button bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Log Form Modal / Area */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="card-base p-5 space-y-4 overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        <h2 className="font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                            <Plus className="w-4 h-4 text-primary-500" /> Log Workout Details
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {(["Walking", "Jogging", "Running", "Cycling", "Other"] as ActivityType[]).map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setActivityType(a)}
                                    className={`py-2 px-3 rounded-button border text-xs font-semibold transition-all ${
                                        activityType === a
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/25 text-primary-600"
                                            : "border-gray-200 dark:border-gray-700 hover:border-primary-300 text-content-secondary dark:text-content-dark-secondary"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-content-secondary dark:text-content-dark-secondary mb-1">
                                    Duration (minutes) *
                                </label>
                                <input
                                    type="number" min="1" max="480" required
                                    value={duration} onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                               bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                               focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                    placeholder="e.g. 45"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-content-secondary dark:text-content-dark-secondary mb-1">
                                    Distance (km)
                                </label>
                                <input
                                    type="number" min="0" step="0.01"
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
                                Activity Notes
                            </label>
                            <input
                                type="text" maxLength={200}
                                value={notes} onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                           bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                           focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                placeholder="Felt strong, warm weather today!"
                            />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                            <button
                                type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2 rounded-button text-sm text-content-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit" disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-button bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-60 transition-all"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Save Session
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Workout Log List */}
            <div className="space-y-3">
                <h2 className="text-heading-sm font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-primary-500" /> Workout Log History
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="card-base p-8 text-center border-dashed border-2 border-gray-200 dark:border-gray-800">
                        <span className="text-4xl">👟</span>
                        <p className="mt-2 text-sm font-medium text-content-secondary">No recent workouts logged.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {entries.map((entry) => (
                            <Card key={entry.id} padding="md" className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center font-bold text-lg">
                                        {entry.type === "Walking" ? "🚶" : entry.type === "Jogging" ? "🏃" : entry.type === "Running" ? "⚡" : entry.type === "Cycling" ? "🚴" : "💪"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-body-md text-content-primary dark:text-content-dark-primary">
                                            {entry.type} • <span className="text-content-secondary font-normal text-xs">{entry.duration_min} min</span>
                                        </p>
                                        <p className="text-[10px] text-content-tertiary">
                                            {format(new Date(entry.created_at), "MMM d, yyyy • h:mm a")}
                                        </p>
                                        {entry.notes && <p className="text-[11px] text-content-secondary mt-0.5 italic">&quot;{entry.notes}&quot;</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {entry.distance_km && (
                                        <span className="text-xs font-bold text-content-secondary">{entry.distance_km} km</span>
                                    )}
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="p-1.5 rounded-button text-content-tertiary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                        aria-label="Delete entry"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

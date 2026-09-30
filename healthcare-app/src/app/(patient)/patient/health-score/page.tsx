"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Heart, Activity, Moon, Utensils, Sliders, RefreshCw, 
    TrendingUp, Award, AlertCircle, ArrowUpRight,
    Smartphone, Watch, ChevronRight
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type MetricCategory = "activity" | "recovery" | "nutrition";

interface Recommendation {
    category: MetricCategory;
    impact: "high" | "medium" | "low";
    text: string;
    action: string;
}

const initialTrends7D = [
    { day: "Mon", score: 78 },
    { day: "Tue", score: 80 },
    { day: "Wed", score: 75 },
    { day: "Thu", score: 82 },
    { day: "Fri", score: 85 },
    { day: "Sat", score: 88 },
    { day: "Sun", score: 87 },
];

const initialTrends30D = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    score: Math.floor(Math.random() * (90 - 70) + 70)
}));

export default function HealthScorePage() {
    // 1. Metric raw scores (0-100)
    const [activityScore, setActivityScore] = useState(84);
    const [recoveryScore, setRecoveryScore] = useState(72);
    const [nutritionScore, setNutritionScore] = useState(90);

    // 2. Weights (percentage sum must equal 100)
    const [weights, setWeights] = useState({
        activity: 40,
        recovery: 40,
        nutrition: 20
    });

    // 3. Overall calculated score
    const [overallScore, setOverallScore] = useState(0);
    const [trendRange, setTrendRange] = useState<"7d" | "30d">("7d");
    const [connectedDevices, setConnectedDevices] = useState({
        appleHealth: true,
        fitbit: false,
        googleFit: false,
        medRing: true
    });

    // Recalculate health score when values or weights change
    useEffect(() => {
        const totalWeight = weights.activity + weights.recovery + weights.nutrition;
        if (totalWeight === 0) return;

        const calculated = Math.round(
            (activityScore * weights.activity +
             recoveryScore * weights.recovery +
             nutritionScore * weights.nutrition) / totalWeight
        );
        setOverallScore(calculated);
    }, [activityScore, recoveryScore, nutritionScore, weights]);

    // Status Label logic
    const getStatusInfo = (score: number) => {
        if (score >= 90) return { label: "Excellent", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" };
        if (score >= 70) return { label: "Good", color: "text-blue-500 border-blue-500/30 bg-blue-500/10" };
        return { label: "Needs Attention", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" };
    };

    const status = getStatusInfo(overallScore);

    // Contextual recommendations
    const recommendations: Recommendation[] = [
        {
            category: "recovery",
            impact: "high",
            text: "Your recovery score is restricted due to inconsistent bedtimes over the last 3 days.",
            action: "Set a bedtime reminder for 10:30 PM tonight."
        },
        {
            category: "activity",
            impact: "medium",
            text: "Adding 15 more active minutes daily will boost your physical exertion category index.",
            action: "Take a fast 15-minute walk after lunch."
        },
        {
            category: "nutrition",
            impact: "low",
            text: "Hydration tracking indicates water intake is 600ml below your optimal daily target.",
            action: "Drink 2 glasses of water before your next meal."
        }
    ];

    // Radial gauge math
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (overallScore / 100) * circumference;

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 font-sans select-none">
            {/* Header */}
            <div>
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary font-display flex items-center gap-2">
                    <Heart className="w-8 h-8 text-primary-500 animate-pulse" /> Health Score Dashboard
                </h1>
                <p className="text-body-md text-content-secondary mt-1">
                    An actionable, composite index of your overall wellness powered by smartwatch telemetry and custom metric weighting.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Main Score Meter Gauge */}
                <Card className="flex flex-col items-center justify-between p-6 md:col-span-1 border border-gray-100 dark:border-gray-800">
                    <div className="w-full flex items-center justify-between">
                        <span className="text-xs uppercase font-bold text-content-tertiary tracking-wider">Composite Score</span>
                        <div className="flex items-center text-emerald-500 font-semibold text-xs gap-0.5">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+4.2% (7d)</span>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center my-8">
                        {/* Radial Score Gauge */}
                        <svg className="w-44 h-44 transform -rotate-90">
                            <circle cx="88" cy="88" r={radius} strokeWidth="12" stroke="currentColor" className="text-gray-100 dark:text-gray-800" fill="transparent" />
                            <motion.circle 
                                cx="88" cy="88" r={radius} strokeWidth="12" stroke="currentColor" 
                                className="text-primary-500" fill="transparent" 
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-content-primary dark:text-content-dark-primary tabular-nums">{overallScore}</span>
                            <span className="text-[10px] font-bold text-content-tertiary uppercase mt-1">out of 100</span>
                        </div>
                    </div>

                    <div className="w-full text-center space-y-2">
                        <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${status.color}`}>
                            {status.label}
                        </span>
                        <p className="text-xs text-content-secondary mt-1">
                            Recalculated instantly based on configured category weight parameters.
                        </p>
                    </div>
                </Card>

                {/* 2. Interactive Weights Adjuster */}
                <Card className="p-6 md:col-span-2 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-heading-sm text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                                <Sliders className="w-5 h-5 text-primary-500" /> Custom Metric Weighting
                            </h3>
                            <button 
                                onClick={() => setWeights({ activity: 40, recovery: 40, nutrition: 20 })}
                                className="text-caption font-bold text-primary-500 flex items-center gap-1 hover:underline"
                            >
                                <RefreshCw className="w-3 h-3" /> Reset Defaults
                            </button>
                        </div>
                        <p className="text-caption text-content-secondary mb-6">
                            Tailor your score model to match your current target. The weight allocation slider determines the final composite calculation.
                        </p>

                        <div className="space-y-6">
                            {/* Activity Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-body-sm">
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                                        <Activity className="w-4 h-4 text-emerald-500" /> Activity Weight
                                    </span>
                                    <span className="font-bold text-primary-500">{weights.activity}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" 
                                    value={weights.activity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const remainder = 100 - val;
                                        // Auto-distribute the remainder to keep total weight = 100%
                                        setWeights({
                                            activity: val,
                                            recovery: Math.round(remainder * (weights.recovery / (weights.recovery + weights.nutrition || 1))),
                                            nutrition: Math.round(remainder * (weights.nutrition / (weights.recovery + weights.nutrition || 1)))
                                        });
                                    }}
                                    className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>

                            {/* Recovery Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-body-sm">
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                                        <Moon className="w-4 h-4 text-purple-500" /> Recovery & Rest Weight
                                    </span>
                                    <span className="font-bold text-primary-500">{weights.recovery}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" 
                                    value={weights.recovery}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const remainder = 100 - val;
                                        setWeights({
                                            activity: Math.round(remainder * (weights.activity / (weights.activity + weights.nutrition || 1))),
                                            recovery: val,
                                            nutrition: Math.round(remainder * (weights.nutrition / (weights.activity + weights.nutrition || 1)))
                                        });
                                    }}
                                    className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>

                            {/* Nutrition Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-body-sm">
                                    <span className="font-semibold text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                                        <Utensils className="w-4 h-4 text-orange-500" /> Nutrition Weight
                                    </span>
                                    <span className="font-bold text-primary-500">{weights.nutrition}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" 
                                    value={weights.nutrition}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const remainder = 100 - val;
                                        setWeights({
                                            activity: Math.round(remainder * (weights.activity / (weights.activity + weights.recovery || 1))),
                                            recovery: Math.round(remainder * (weights.recovery / (weights.activity + weights.recovery || 1))),
                                            nutrition: val
                                        });
                                    }}
                                    className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-[10px] text-content-tertiary text-right font-medium">
                        Total weight must equal 100% (Sum: {weights.activity + weights.recovery + weights.nutrition}%)
                    </div>
                </Card>
            </div>

            {/* 3. Category Breakdown Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Activity breakdown */}
                <Card padding="md" className="border border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
                        <span className="font-bold text-body-md text-content-primary dark:text-content-dark-primary flex items-center gap-1">
                            <Activity className="w-4 h-4 text-emerald-500" /> Activity Detail
                        </span>
                        <Badge variant="success" size="sm">{activityScore}/100</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Daily Step Count</span>
                            <span className="font-bold">8,422 steps</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Active Minutes</span>
                            <span className="font-bold">45 mins</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Calories Burned</span>
                            <span className="font-bold">342 kcal</span>
                        </div>
                    </div>
                    <div className="pt-2">
                        <input 
                            type="range" min="0" max="100" value={activityScore} onChange={(e) => setActivityScore(parseInt(e.target.value))}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <span className="text-[10px] text-content-tertiary block mt-1 text-right">Adjust category rating (testing)</span>
                    </div>
                </Card>

                {/* Recovery breakdown */}
                <Card padding="md" className="border border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
                        <span className="font-bold text-body-md text-content-primary dark:text-content-dark-primary flex items-center gap-1">
                            <Moon className="w-4 h-4 text-purple-500" /> Sleep & Recovery
                        </span>
                        <Badge variant={recoveryScore >= 70 ? "info" : "danger"} size="sm">{recoveryScore}/100</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Sleep Duration</span>
                            <span className="font-bold">7.2 hrs</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Sleep Quality Score</span>
                            <span className="font-bold">84%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Heart Rate Var. (HRV)</span>
                            <span className="font-bold">62 ms</span>
                        </div>
                    </div>
                    <div className="pt-2">
                        <input 
                            type="range" min="0" max="100" value={recoveryScore} onChange={(e) => setRecoveryScore(parseInt(e.target.value))}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-[10px] text-content-tertiary block mt-1 text-right">Adjust category rating (testing)</span>
                    </div>
                </Card>

                {/* Nutrition breakdown */}
                <Card padding="md" className="border border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
                        <span className="font-bold text-body-md text-content-primary dark:text-content-dark-primary flex items-center gap-1">
                            <Utensils className="w-4 h-4 text-orange-500" /> Nutrition
                        </span>
                        <Badge variant="success" size="sm">{nutritionScore}/100</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Calorie Target</span>
                            <span className="font-bold">2,100 kcal</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Water Intake</span>
                            <span className="font-bold">2,200 ml</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-content-secondary">Macro compliance</span>
                            <span className="font-bold">92%</span>
                        </div>
                    </div>
                    <div className="pt-2">
                        <input 
                            type="range" min="0" max="100" value={nutritionScore} onChange={(e) => setNutritionScore(parseInt(e.target.value))}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <span className="text-[10px] text-content-tertiary block mt-1 text-right">Adjust category rating (testing)</span>
                    </div>
                </Card>
            </div>

            {/* 4. Visualizations & Historical Trends */}
            <Card padding="lg" className="border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold text-heading-sm text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                            <TrendingUp className="w-5 h-5 text-primary-500" /> Score Historical Trends
                        </h3>
                        <p className="text-caption text-content-secondary mt-1">Review score fluctuations and habit correlation.</p>
                    </div>
                    <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border dark:border-gray-700">
                        <button 
                            onClick={() => setTrendRange("7d")}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${trendRange === "7d" ? "bg-white dark:bg-gray-800 text-primary-600 shadow" : "text-content-secondary"}`}
                        >
                            7 Days
                        </button>
                        <button 
                            onClick={() => setTrendRange("30d")}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${trendRange === "30d" ? "bg-white dark:bg-gray-800 text-primary-600 shadow" : "text-content-secondary"}`}
                        >
                            30 Days
                        </button>
                    </div>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendRange === "7d" ? initialTrends7D : initialTrends30D}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                            <Line type="monotone" dataKey="score" stroke="#1a6fd4" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 5. Actionable Recommendations */}
            <Card padding="md" className="border border-gray-100 dark:border-gray-800 space-y-4">
                <h3 className="font-semibold text-heading-sm text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-500" /> Prescriptive Action Plan
                </h3>
                <p className="text-caption text-content-secondary mt-1">
                    Clear insights on your metrics performance and actionable tips to boost your rating score.
                </p>

                <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/10">
                            <div className="flex gap-3">
                                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${rec.impact === "high" ? "text-red-500" : rec.impact === "medium" ? "text-amber-500" : "text-blue-500"}`} />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-content-tertiary">{rec.category}</span>
                                        <Badge variant={rec.impact === "high" ? "danger" : rec.impact === "medium" ? "warning" : "info"} size="sm">
                                            {rec.impact} impact
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-content-secondary">{rec.text}</p>
                                </div>
                            </div>
                            <Button size="sm" className="rounded-xl shrink-0" rightIcon={<ChevronRight className="w-4 h-4" />}>
                                {rec.action}
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* 6. Settings & Wearable Integration Toggles */}
            <Card padding="md" className="border border-gray-100 dark:border-gray-800 space-y-4">
                <h3 className="font-semibold text-heading-sm text-content-primary dark:text-content-dark-primary flex items-center gap-1.5">
                    <Smartphone className="w-5 h-5 text-primary-500" /> Integrations & Sensors
                </h3>
                <p className="text-caption text-content-secondary mt-1">Connect third-party apps or hardware health rings to feed your telemetry dashboard.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {/* Med Ring */}
                    <div className="p-4 rounded-xl border dark:border-gray-800 flex items-center justify-between bg-white dark:bg-surface-dark-card shadow-sm">
                        <div className="flex items-center gap-2">
                            <Watch className="w-5 h-5 text-primary-500 animate-pulse" />
                            <div>
                                <p className="text-xs font-bold">MedCare Ring</p>
                                <p className="text-[10px] text-content-tertiary">Connected</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" checked={connectedDevices.medRing}
                            onChange={(e) => setConnectedDevices(prev => ({ ...prev, medRing: e.target.checked }))}
                            className="w-4 h-4 cursor-pointer accent-primary-500"
                        />
                    </div>

                    {/* Apple Health */}
                    <div className="p-4 rounded-xl border dark:border-gray-800 flex items-center justify-between bg-white dark:bg-surface-dark-card shadow-sm">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-red-500" />
                            <div>
                                <p className="text-xs font-bold">Apple Health</p>
                                <p className="text-[10px] text-content-tertiary">Connected</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" checked={connectedDevices.appleHealth}
                            onChange={(e) => setConnectedDevices(prev => ({ ...prev, appleHealth: e.target.checked }))}
                            className="w-4 h-4 cursor-pointer accent-primary-500"
                        />
                    </div>

                    {/* Fitbit */}
                    <div className="p-4 rounded-xl border dark:border-gray-800 flex items-center justify-between bg-white dark:bg-surface-dark-card shadow-sm">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Watch className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-xs font-bold">Fitbit Wearables</p>
                                <p className="text-[10px] text-content-tertiary">Sync available</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" checked={connectedDevices.fitbit}
                            onChange={(e) => setConnectedDevices(prev => ({ ...prev, fitbit: e.target.checked }))}
                            className="w-4 h-4 cursor-pointer accent-primary-500"
                        />
                    </div>

                    {/* Google Fit */}
                    <div className="p-4 rounded-xl border dark:border-gray-800 flex items-center justify-between bg-white dark:bg-surface-dark-card shadow-sm">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-xs font-bold">Google Fit</p>
                                <p className="text-[10px] text-content-tertiary">Disconnected</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" checked={connectedDevices.googleFit}
                            onChange={(e) => setConnectedDevices(prev => ({ ...prev, googleFit: e.target.checked }))}
                            className="w-4 h-4 cursor-pointer accent-primary-500"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}

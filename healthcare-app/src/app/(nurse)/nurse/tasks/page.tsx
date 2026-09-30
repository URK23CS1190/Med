"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Clock, CheckCircle, User, Plus, Pill, Heart, Thermometer, Droplets } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

type TaskStatus = "todo" | "in_progress" | "done";
interface Task { id: string; patient: string; bed: string; task: string; priority: "high" | "medium" | "low"; status: TaskStatus; due: string; category: string; }

const initialTasks: Task[] = [
    { id: "T-001", patient: "Ramesh Kumar", bed: "3-A12", task: "IV Drip Change", priority: "high", status: "todo", due: "10:00 AM", category: "medication" },
    { id: "T-002", patient: "Lakshmi Devi", bed: "3-A08", task: "Vitals Check (BP Alert)", priority: "high", status: "todo", due: "10:15 AM", category: "vitals" },
    { id: "T-003", patient: "Arun Joshi", bed: "3-B03", task: "Post-Op Wound Dressing", priority: "medium", status: "in_progress", due: "10:30 AM", category: "wound_care" },
    { id: "T-004", patient: "Divya Patel", bed: "3-B05", task: "Administer Medication (Insulin)", priority: "high", status: "todo", due: "11:00 AM", category: "medication" },
    { id: "T-005", patient: "Ramesh Kumar", bed: "3-A12", task: "Oral Medication Round", priority: "medium", status: "in_progress", due: "11:30 AM", category: "medication" },
    { id: "T-006", patient: "Lakshmi Devi", bed: "3-A08", task: "Blood Sample Collection", priority: "low", status: "done", due: "09:00 AM", category: "lab" },
    { id: "T-007", patient: "Arun Joshi", bed: "3-B03", task: "Vitals Recording", priority: "medium", status: "done", due: "08:00 AM", category: "vitals" },
    { id: "T-008", patient: "Divya Patel", bed: "3-B05", task: "Patient Hygiene Assist", priority: "low", status: "done", due: "07:30 AM", category: "care" },
];

const columns: { key: TaskStatus; label: string; color: string }[] = [
    { key: "todo", label: "To Do", color: "border-t-amber-500" },
    { key: "in_progress", label: "In Progress", color: "border-t-blue-500" },
    { key: "done", label: "Done", color: "border-t-emerald-500" },
];

const catIcon: Record<string, React.ReactNode> = {
    medication: <Pill className="w-3.5 h-3.5 text-purple-500" />,
    vitals: <Heart className="w-3.5 h-3.5 text-red-500" />,
    wound_care: <Droplets className="w-3.5 h-3.5 text-amber-500" />,
    lab: <Thermometer className="w-3.5 h-3.5 text-blue-500" />,
    care: <User className="w-3.5 h-3.5 text-teal-500" />,
};

export default function NurseTasks() {
    const [tasks, setTasks] = useState(initialTasks);
    const [filterPriority, setFilterPriority] = useState<string>("all");

    const moveTask = (id: string, newStatus: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const filtered = filterPriority === "all" ? tasks : tasks.filter(t => t.priority === filterPriority);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Patient Care Tasks</h1>
                    <p className="text-body-md text-content-secondary mt-1">Kanban board for shift tasks</p>
                </div>
                <div className="flex gap-2">
                    <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-9 px-3 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border border-gray-200 dark:border-gray-700 text-body-sm">
                        <option value="all">All Priority</option>
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                    </select>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Task</Button>
                </div>
            </div>

            {/* Summary */}
            <div className="flex gap-4 text-body-sm">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> To Do: {tasks.filter(t => t.status === "todo").length}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress: {tasks.filter(t => t.status === "in_progress").length}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Done: {tasks.filter(t => t.status === "done").length}</span>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.map(col => {
                    const colTasks = filtered.filter(t => t.status === col.key);
                    return (
                        <div key={col.key} className="space-y-3">
                            <div className={`card-base p-3 border-t-4 ${col.color}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-body-md font-semibold">{col.label}</h3>
                                    <Badge variant={col.key === "todo" ? "warning" : col.key === "in_progress" ? "info" : "success"}>{colTasks.length}</Badge>
                                </div>
                            </div>
                            <div className="space-y-2 min-h-[200px]">
                                {colTasks.map((task, i) => (
                                    <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Card padding="sm" className={`cursor-pointer hover:shadow-card-hover transition-all ${task.priority === "high" ? "border-l-4 border-l-red-500" : task.priority === "medium" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500"}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {catIcon[task.category] || <ClipboardList className="w-3.5 h-3.5" />}
                                                <span className="text-body-sm font-semibold text-content-primary dark:text-content-dark-primary">{task.task}</span>
                                            </div>
                                            <p className="text-caption text-content-secondary">{task.patient} • Bed {task.bed}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[10px] flex items-center gap-1 text-content-tertiary"><Clock className="w-3 h-3" />{task.due}</span>
                                                <div className="flex gap-1">
                                                    {col.key === "todo" && <button onClick={() => moveTask(task.id, "in_progress")} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 hover:bg-blue-100">Start</button>}
                                                    {col.key === "in_progress" && <button onClick={() => moveTask(task.id, "done")} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 hover:bg-emerald-100">Done</button>}
                                                    {col.key === "done" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

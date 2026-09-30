"use client";

import { motion } from "framer-motion";
import {
    Package, Box, Search, Filter, AlertTriangle,
    TrendingDown, Plus, Edit,
    RefreshCcw, ShoppingCart, Truck
} from "lucide-react";
import { Card, Button, StatusBadge, StatCard } from "@/components/ui";
import { useState } from "react";

const supplies = [
    { id: "SUP-001", name: "Disposable Syringes (2ml)", category: "Consumables", stock: 1250, unit: "pcs", minLevel: 500, status: "ok", lastRestocked: "10 Jan 2025" },
    { id: "SUP-002", name: "Surgical Gloves (Size M)", category: "Consumables", stock: 150, unit: "pairs", minLevel: 200, status: "low", lastRestocked: "05 Jan 2025" },
    { id: "SUP-003", name: "Paracetamol IV (100ml)", category: "Pharmacy", stock: 45, unit: "vials", minLevel: 50, status: "critical", lastRestocked: "12 Dec 2024" },
    { id: "SUP-004", name: "Oxygen Masks", category: "Respiratory", stock: 82, unit: "pcs", minLevel: 30, status: "ok", lastRestocked: "14 Jan 2025" },
    { id: "SUP-005", name: "Blood Collection Tubes", category: "Lab", stock: 2400, unit: "pcs", minLevel: 1000, status: "ok", lastRestocked: "08 Jan 2025" },
];

export default function HospitalAdminInventory() {
    const [search, setSearch] = useState("");
    const filtered = supplies.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <Package className="w-8 h-8 text-primary-500" /> Medical Inventory
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Apollo Hospital — Manage hospital-wide supplies and equipment</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<RefreshCcw className="w-4 h-4" />}>Procurement</Button>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Item</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Categories" value="12" icon={<Box className="w-5 h-5" />} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <StatCard label="Low Stock Items" value="3" icon={<TrendingDown className="w-5 h-5" />} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20" delay={0.1} />
                <StatCard label="Pending Orders" value="5" icon={<ShoppingCart className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" delay={0.2} />
                <StatCard label="In-transit" value="2" icon={<Truck className="w-5 h-5" />} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" delay={0.3} />
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <input
                        type="text"
                        placeholder="Search by item name, category, or batch ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all font-medium"
                    />
                </div>
                <Button variant="outline" className="h-11 px-6 font-semibold" leftIcon={<Filter className="w-4 h-4" />}>Category</Button>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Item Name & ID</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Category</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Current Stock</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Min. Level</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Status</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filtered.map((s, i) => (
                                <motion.tr
                                    key={s.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                                >
                                    <td className="px-5 py-4">
                                        <p className="text-body-sm font-semibold">{s.name}</p>
                                        <p className="text-caption text-content-tertiary">{s.id}</p>
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-content-secondary">{s.category}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-body-md font-bold ${s.status === 'critical' ? 'text-red-500' : s.status === 'low' ? 'text-amber-500' : 'text-content-primary dark:text-content-dark-primary'}`}>
                                            {s.stock} {s.unit}
                                        </span>
                                        <p className="text-[10px] text-content-tertiary">Last restocked: {s.lastRestocked}</p>
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-content-tertiary font-medium">{s.minLevel} {s.unit}</td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            status={s.status === "ok" ? "verified" : s.status === "low" ? "pending" : "critical"}
                                            label={s.status === "ok" ? "In Stock" : s.status === "low" ? "Low Stock" : "Critical"}
                                            size="sm"
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost"><Edit className="w-3.5 h-3.5" /></Button>
                                            <Button size="sm" variant="outline" className="text-primary-600">Restock</Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Critical Alerts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {supplies.filter(s => s.status === 'critical').map(s => (
                    <Card key={s.id} className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900 shadow-none">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-body-sm font-bold text-red-700 dark:text-red-400">Critical Stock Warning</h4>
                                <p className="text-caption text-red-600 dark:text-red-300">{s.name} is extremely low ({s.stock} {s.unit} left). Order immediately.</p>
                            </div>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">Order Now</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import {
    Users, UserPlus, Filter, Search, MoreVertical,
    Shield, ShieldCheck, UserX,
    Download, MapPin, Clock
} from "lucide-react";
import { Card, Button, Avatar, Badge, StatusBadge } from "@/components/ui";
import { useState } from "react";

const users = [
    { id: "USR-001", name: "Dr. Kavitha Nair", role: "doctor", status: "active", email: "kavitha.n@apollo.com", location: "Bangalore", lastLogin: "10 min ago", verified: true },
    { id: "USR-002", name: "Sr. Meenakshi", role: "nurse", status: "active", email: "meena.v@fortis.com", location: "Chennai", lastLogin: "2 hours ago", verified: true },
    { id: "USR-003", name: "Rajesh Patil", role: "ambulance_driver", status: "pending", email: "rajesh.p@ems.com", location: "Mumbai", lastLogin: "Never", verified: false },
    { id: "USR-004", name: "Rahul Verma", role: "patient", status: "active", email: "rahul.v@gmail.com", location: "Delhi", lastLogin: "5 mins ago", verified: true },
    { id: "USR-005", name: "MedPlus BKC", role: "pharmacy_admin", status: "active", email: "bkc@medplus.com", location: "Mumbai", lastLogin: "1 day ago", verified: true },
    { id: "USR-006", name: "Anita Desai", role: "patient", status: "suspended", email: "anita.d@outlook.com", location: "Pune", lastLogin: "3 days ago", verified: true },
    { id: "USR-007", name: "Dr. Amit Shah", role: "doctor", status: "active", email: "amit.s@hospital.com", location: "Ahmedabad", lastLogin: "4 hours ago", verified: true },
];

export default function SuperAdminUsers() {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = users.filter(u =>
        (filter === "all" || u.role === filter) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary flex items-center gap-2">
                        <Users className="w-8 h-8 text-primary-500" /> User Management
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">Management of all 12,458 users across roles</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
                    <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>Add User</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card padding="md">
                    <div className="flex items-center justify-between">
                        <p className="text-caption text-content-tertiary">Total Registered</p>
                        <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-display-sm font-display mt-1">12,458</p>
                </Card>
                <Card padding="md">
                    <div className="flex items-center justify-between">
                        <p className="text-caption text-content-tertiary">Active Now</p>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-display-sm font-display mt-1">842</p>
                </Card>
                <Card padding="md">
                    <div className="flex items-center justify-between">
                        <p className="text-caption text-content-tertiary">Pending Approvals</p>
                        <Shield className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-display-sm font-display mt-1">23</p>
                </Card>
                <Card padding="md">
                    <div className="flex items-center justify-between">
                        <p className="text-caption text-content-tertiary">Suspended</p>
                        <UserX className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-display-sm font-display mt-1">14</p>
                </Card>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <input
                        type="text"
                        placeholder="Search name, email, or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-10 px-4 pr-10 rounded-xl bg-surface-secondary dark:bg-surface-dark-elevated border-0 text-body-sm ring-1 ring-gray-200 dark:ring-gray-800"
                >
                    <option value="all">All Roles</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="ambulance_driver">Driver</option>
                    <option value="pharmacy_admin">Pharmacy</option>
                    <option value="patient">Patient</option>
                </select>
                <Button variant="outline" size="sm" className="h-10 px-4" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">User</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Role</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Status</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Location</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary">Last Active</th>
                                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filtered.map((u, i) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar fallback={u.name} size="sm" />
                                            <div>
                                                <p className="text-body-sm font-semibold flex items-center gap-1">
                                                    {u.name}
                                                    {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                                                </p>
                                                <p className="text-caption text-content-tertiary">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge variant="secondary" className="capitalize">{u.role.replace('_', ' ')}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            status={u.status === "active" ? "verified" : u.status === "pending" ? "pending" : "critical"}
                                            label={u.status}
                                            size="sm"
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-content-secondary">
                                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{u.location}</div>
                                    </td>
                                    <td className="px-5 py-4 text-body-sm text-content-secondary">
                                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{u.lastLogin}</div>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4 text-content-tertiary" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

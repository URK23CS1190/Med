"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Calendar, Pill, FileText, Users, Activity,
    Stethoscope, Building2, Truck, ShieldCheck, BarChart3,
    Package, ClipboardList, Baby, X, ChevronLeft,
    Heart, CreditCard, Siren, MessageSquare, ShoppingCart,
    AlertTriangle, Clipboard, Navigation, Timer
} from "lucide-react";
import { useUIStore, useAuthStore } from "@/stores";
import type { UserRole } from "@/lib/supabase/types";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
}

const navByRole: Record<UserRole, NavItem[]> = {
    patient: [
        { label: "Home", href: "/patient/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Doctors", href: "/patient/doctors", icon: <Stethoscope className="w-5 h-5" /> },
        { label: "Appointments", href: "/patient/appointments", icon: <Calendar className="w-5 h-5" /> },
        { label: "Pharmacy", href: "/patient/pharmacy", icon: <Pill className="w-5 h-5" /> },
        { label: "Records", href: "/patient/records", icon: <FileText className="w-5 h-5" /> },
        { label: "Children", href: "/patient/children", icon: <Baby className="w-5 h-5" /> },
        { label: "Health Score", href: "/patient/health-score", icon: <Heart className="w-5 h-5" /> },
        { label: "Health Tracker", href: "/patient/tracker", icon: <Activity className="w-5 h-5" /> },
        { label: "Emergency", href: "/patient/emergency", icon: <Activity className="w-5 h-5" /> },
        { label: "Symptom Check", href: "/patient/symptom-checker", icon: <Stethoscope className="w-5 h-5" /> },
    ],
    doctor: [
        { label: "Dashboard", href: "/doctor/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Profile", href: "/doctor/profile", icon: <Users className="w-5 h-5" /> },
        { label: "Appointments", href: "/doctor/appointments", icon: <Calendar className="w-5 h-5" /> },
        { label: "Prescriptions", href: "/doctor/prescriptions", icon: <FileText className="w-5 h-5" /> },
        { label: "Patients", href: "/doctor/patients", icon: <Users className="w-5 h-5" /> },
        { label: "Earnings", href: "/doctor/earnings", icon: <CreditCard className="w-5 h-5" /> },
        { label: "Verification", href: "/doctor/verification", icon: <ShieldCheck className="w-5 h-5" /> },
    ],
    nurse: [
        { label: "Dashboard", href: "/nurse/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Profile", href: "/nurse/profile", icon: <Users className="w-5 h-5" /> },
        { label: "Shifts", href: "/nurse/shifts", icon: <Timer className="w-5 h-5" /> },
        { label: "Tasks", href: "/nurse/tasks", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Emergency", href: "/nurse/emergency", icon: <Siren className="w-5 h-5" /> },
        { label: "Reports", href: "/nurse/reports", icon: <MessageSquare className="w-5 h-5" /> },
        { label: "Verification", href: "/nurse/verification", icon: <ShieldCheck className="w-5 h-5" /> },
    ],
    hospital_admin: [
        { label: "Dashboard", href: "/hospital-admin/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Beds", href: "/hospital-admin/beds", icon: <Building2 className="w-5 h-5" /> },
        { label: "Staff", href: "/hospital-admin/staff", icon: <Users className="w-5 h-5" /> },
        { label: "Queue", href: "/hospital-admin/queue", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Analytics", href: "/hospital-admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    ],
    pharmacy_admin: [
        { label: "Dashboard", href: "/pharmacy-admin/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Promotions", href: "/pharmacy-admin/promotions", icon: <ShoppingCart className="w-5 h-5" /> },
        { label: "Inventory", href: "/pharmacy-admin/inventory", icon: <Package className="w-5 h-5" /> },
        { label: "Prescriptions", href: "/pharmacy-admin/prescriptions", icon: <Clipboard className="w-5 h-5" /> },
        { label: "Orders", href: "/pharmacy-admin/orders", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Delivery", href: "/pharmacy-admin/delivery", icon: <Truck className="w-5 h-5" /> },
        { label: "Compliance", href: "/pharmacy-admin/compliance", icon: <ShieldCheck className="w-5 h-5" /> },
        { label: "Analytics", href: "/pharmacy-admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
        { label: "Profile", href: "/pharmacy-admin/profile", icon: <Users className="w-5 h-5" /> },
    ],
    ambulance_driver: [
        { label: "Dashboard", href: "/ambulance-driver/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Map / Routing", href: "/ambulance-driver/map", icon: <Navigation className="w-5 h-5" /> },
        { label: "Requests", href: "/ambulance-driver/requests", icon: <AlertTriangle className="w-5 h-5" /> },
        { label: "Trips", href: "/ambulance-driver/trips", icon: <Truck className="w-5 h-5" /> },
        { label: "Earnings", href: "/ambulance-driver/earnings", icon: <CreditCard className="w-5 h-5" /> },
        { label: "Verification", href: "/ambulance-driver/verification", icon: <ShieldCheck className="w-5 h-5" /> },
    ],
    super_admin: [
        { label: "Dashboard", href: "/super-admin/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Verification", href: "/super-admin/verification", icon: <ShieldCheck className="w-5 h-5" /> },
        { label: "Providers", href: "/super-admin/providers", icon: <Users className="w-5 h-5" /> },
        { label: "Beds", href: "/super-admin/beds", icon: <Building2 className="w-5 h-5" /> },
        { label: "Analytics", href: "/super-admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
        { label: "Audit Log", href: "/super-admin/audit", icon: <FileText className="w-5 h-5" /> },
    ],
};

export function Sidebar() {
    const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
    const role = useAuthStore((s) => s.role);
    const pathname = usePathname();
    const items = navByRole[role || "patient"];

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-20 left-0 z-40 h-[calc(100vh-5rem)]
          transition-all duration-300 ease-out
          ${sidebarOpen ? "overflow-y-auto scrollbar-thin" : "overflow-visible"}
          
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64

          md:translate-x-0
          ${sidebarOpen ? "md:w-64" : "md:w-[72px]"}
        `}
                style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRight: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
                }}
            >
                {/* Collapse toggle - desktop */}
                <div className="hidden md:flex items-center justify-end p-3">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <ChevronLeft className={`w-4 h-4 text-content-tertiary transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {/* Close button - mobile */}
                <div className="flex md:hidden items-center justify-end p-3">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5 text-content-tertiary" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="px-3 py-2" aria-label="Main navigation">
                    <ul className="space-y-1">
                        {items.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                      relative group flex items-center gap-3 px-3 py-2.5 rounded-button
                      text-body-sm font-medium transition-all duration-200
                      ${isActive
                                                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                                : "text-content-secondary dark:text-content-dark-secondary hover:bg-gray-50 dark:hover:bg-gray-800"
                                            }
                    `}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <span className={`flex-shrink-0 ${isActive ? "text-primary-500" : ""}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`${sidebarOpen ? "opacity-100" : "md:hidden opacity-0"} transition-opacity whitespace-nowrap`}>
                                            {item.label}
                                        </span>
                                        {item.badge && sidebarOpen && (
                                            <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}

                                        {/* Premium Floating Tooltip on Collapse */}
                                        {!sidebarOpen && (
                                            <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 rounded-lg bg-gray-900 dark:bg-gray-800 text-white px-3 py-1.5 text-xs font-semibold shadow-lg whitespace-nowrap z-50 pointer-events-none origin-left flex items-center border border-gray-800 dark:border-gray-700">
                                                <div className="absolute -left-1 w-2.5 h-2.5 bg-gray-900 dark:bg-gray-800 rotate-45 border-l border-b border-gray-800 dark:border-gray-700" />
                                                <span className="relative z-10">{item.label}</span>
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}

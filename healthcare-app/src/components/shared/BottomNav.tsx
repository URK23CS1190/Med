"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Calendar, Pill, User, Stethoscope, ClipboardList,
    Timer, Siren, Package, Truck, Navigation, CreditCard,
    ShieldCheck, Users, BarChart3
} from "lucide-react";
import { useAuthStore } from "@/stores";
import type { UserRole } from "@/lib/supabase/types";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const mobileNavByRole: Record<UserRole, NavItem[]> = {
    patient: [
        { label: "Home", href: "/patient/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Doctors", href: "/patient/doctors", icon: <Stethoscope className="w-5 h-5" /> },
        { label: "Booking", href: "/patient/appointments", icon: <Calendar className="w-5 h-5" /> },
        { label: "Pharmacy", href: "/patient/pharmacy", icon: <Pill className="w-5 h-5" /> },
        { label: "Profile", href: "/patient/profile", icon: <User className="w-5 h-5" /> },
    ],
    doctor: [
        { label: "Home", href: "/doctor/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Schedule", href: "/doctor/appointments", icon: <Calendar className="w-5 h-5" /> },
        { label: "Patients", href: "/doctor/patients", icon: <Users className="w-5 h-5" /> },
        { label: "Rx", href: "/doctor/prescriptions", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Profile", href: "/doctor/profile", icon: <User className="w-5 h-5" /> },
    ],
    nurse: [
        { label: "Home", href: "/nurse/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Shifts", href: "/nurse/shifts", icon: <Timer className="w-5 h-5" /> },
        { label: "Tasks", href: "/nurse/tasks", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Emergency", href: "/nurse/emergency", icon: <Siren className="w-5 h-5" /> },
        { label: "Profile", href: "/nurse/profile", icon: <User className="w-5 h-5" /> },
    ],
    hospital_admin: [
        { label: "Home", href: "/hospital-admin/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Beds", href: "/hospital-admin/beds", icon: <Home className="w-5 h-5" /> },
        { label: "Staff", href: "/hospital-admin/staff", icon: <User className="w-5 h-5" /> },
    ],
    pharmacy_admin: [
        { label: "Home", href: "/pharmacy-admin/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Inventory", href: "/pharmacy-admin/inventory", icon: <Package className="w-5 h-5" /> },
        { label: "Rx Queue", href: "/pharmacy-admin/prescriptions", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Orders", href: "/pharmacy-admin/orders", icon: <Calendar className="w-5 h-5" /> },
        { label: "Profile", href: "/pharmacy-admin/profile", icon: <User className="w-5 h-5" /> },
    ],
    ambulance_driver: [
        { label: "Home", href: "/ambulance-driver/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Requests", href: "/ambulance-driver/requests", icon: <Siren className="w-5 h-5" /> },
        { label: "Map", href: "/ambulance-driver/map", icon: <Navigation className="w-5 h-5" /> },
        { label: "Trips", href: "/ambulance-driver/trips", icon: <Truck className="w-5 h-5" /> },
        { label: "Earnings", href: "/ambulance-driver/earnings", icon: <CreditCard className="w-5 h-5" /> },
    ],
    super_admin: [
        { label: "Home", href: "/super-admin/dashboard", icon: <Home className="w-5 h-5" /> },
        { label: "Verify", href: "/super-admin/verification", icon: <ShieldCheck className="w-5 h-5" /> },
        { label: "Providers", href: "/super-admin/providers", icon: <Users className="w-5 h-5" /> },
        { label: "Analytics", href: "/super-admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    ],
};

export function BottomNav() {
    const pathname = usePathname();
    const role = useAuthStore((s) => s.role);
    const items = mobileNavByRole[role || "patient"];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-gray-200/50 dark:border-gray-700/50"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around h-16 pb-safe max-w-lg mx-auto">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex flex-col items-center justify-center gap-0.5 px-3 py-1.5
                min-w-[64px] rounded-xl transition-all duration-200
                ${isActive
                                    ? "text-primary-500"
                                    : "text-content-tertiary dark:text-content-dark-secondary"
                                }
              `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-medium ${isActive ? "text-primary-500" : ""}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-500" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

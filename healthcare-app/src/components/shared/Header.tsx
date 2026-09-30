"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
    Sun, Moon, Bell, Search, User, Settings, LogOut,
    ChevronDown, AlertTriangle, Shield
} from "lucide-react";
import { useThemeStore, useAuthStore } from "@/stores";
import { Avatar } from "@/components/ui";
import { ReportModal } from "./ReportModal";
import type { UserRole } from "@/lib/supabase/types";

const roleRoutes: Record<UserRole, string> = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    hospital_admin: "/hospital-admin/dashboard",
    pharmacy_admin: "/pharmacy-admin/dashboard",
    ambulance_driver: "/ambulance-driver/dashboard",
    nurse: "/nurse/dashboard",
    super_admin: "/super-admin/dashboard",
};

/* ─── Dock Item (Siri magnification) ─────────────────────────────── */
function DockItem({
    children,
    mouseX,
    className = "",
}: {
    children: React.ReactNode;
    mouseX: MotionValue<number>;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const scaleX = useSpring(
        useTransform(distance, [-100, 0, 100], [1, 1.16, 1]),
        { mass: 0.1, stiffness: 150, damping: 12 }
    );
    const scaleY = useSpring(
        useTransform(distance, [-100, 0, 100], [1, 1.10, 1]),
        { mass: 0.1, stiffness: 150, damping: 12 }
    );

    return (
        <motion.div ref={ref} style={{ scaleX, scaleY }} className={`origin-bottom ${className}`}>
            {children}
        </motion.div>
    );
}

export function Header() {
    const router = useRouter();
    const { isDark, toggleTheme } = useThemeStore();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [hovered, setHovered] = useState(false);

    const navRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(Infinity);

    const handleLogout = () => {
        logout();
        setShowProfile(false);
        router.push("/login");
    };

    const handleNavigate = (path: string) => {
        setShowProfile(false);
        router.push(path);
    };

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-between items-start px-4 pointer-events-none">

            {/* Left: Logo pill */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-auto"
            >
                <Link href="/">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{
                            background: "rgba(15, 15, 20, 0.85)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                        }}
                    >
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-white font-semibold text-sm tracking-tight hidden sm:block">
                            {process.env.NEXT_PUBLIC_APP_NAME || "MedCare"}
                        </span>
                    </div>
                </Link>
            </motion.div>

            {/* Center: Search + Nav pill (Siri Dock) */}
            <motion.nav
                ref={navRef}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="hidden md:flex pointer-events-auto"
                onMouseMove={(e) => {
                    const rect = navRef.current?.getBoundingClientRect();
                    if (rect) mouseX.set(e.clientX - rect.left);
                }}
                onMouseLeave={() => { mouseX.set(Infinity); setHovered(false); }}
                onMouseEnter={() => setHovered(true)}
            >
                <div
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full relative overflow-hidden"
                    style={{
                        background: "rgba(15, 15, 20, 0.85)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Search */}
                    <DockItem mouseX={mouseX}>
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-8 pl-8 pr-3 w-36 rounded-full text-xs text-white/80 placeholder:text-white/35 focus:outline-none focus:w-48 transition-all duration-300"
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                }}
                            />
                        </div>
                    </DockItem>

                    <div className="w-px h-5 bg-white/15 mx-1" />

                    {/* Siri glow */}
                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.07), rgba(6,182,212,0.07), transparent)",
                                    filter: "blur(2px)",
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Theme toggle */}
                    <DockItem mouseX={mouseX}>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isDark ? "dark" : "light"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {isDark ? (
                                        <Sun className="w-4 h-4 text-amber-400" />
                                    ) : (
                                        <Moon className="w-4 h-4 text-white/70" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </DockItem>

                    {/* Notifications */}
                    <DockItem mouseX={mouseX}>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                                aria-label="Notifications"
                            >
                                <Bell className="w-4 h-4 text-white/70" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </button>
                        </div>
                    </DockItem>

                    {/* Report */}
                    <DockItem mouseX={mouseX}>
                        <button
                            onClick={() => setShowReport(true)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Report issue"
                        >
                            <AlertTriangle className="w-4 h-4 text-white/70" />
                        </button>
                    </DockItem>

                    <div className="w-px h-5 bg-white/15 mx-1" />

                    {/* Profile */}
                    <DockItem mouseX={mouseX}>
                        <div className="relative">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="User menu"
                            >
                                <Avatar
                                    src={user?.avatar_url}
                                    fallback={user?.full_name || "U"}
                                    size="sm"
                                    status="online"
                                />
                                <ChevronDown className="w-3 h-3 text-white/50" />
                            </button>

                            <AnimatePresence>
                                {showProfile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-3 w-56 py-2 rounded-2xl shadow-2xl"
                                        style={{
                                            background: "rgba(15,15,20,0.92)",
                                            backdropFilter: "blur(20px)",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                        }}
                                    >
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-sm font-semibold text-white">
                                                {user?.full_name || "User"}
                                            </p>
                                            <p className="text-xs text-white/40">
                                                {user?.email || "user@example.com"}
                                            </p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => handleNavigate(roleRoutes[user?.role || "patient"])}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/08 hover:text-white transition-colors"
                                            >
                                                <User className="w-4 h-4" /> Profile
                                            </button>
                                            <button
                                                onClick={() => handleNavigate(roleRoutes[user?.role || "patient"])}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/08 hover:text-white transition-colors"
                                            >
                                                <Settings className="w-4 h-4" /> Settings
                                            </button>
                                        </div>
                                        <div className="border-t border-white/10 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </DockItem>
                </div>
            </motion.nav>

            {/* Right: Mobile actions */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-2 pointer-events-auto md:hidden"
            >
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full transition-colors"
                    style={{
                        background: "rgba(15,15,20,0.85)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-white/70" />}
                </button>
                <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="p-1.5 rounded-full transition-colors"
                    style={{
                        background: "rgba(15,15,20,0.85)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    <Avatar src={user?.avatar_url} fallback={user?.full_name || "U"} size="sm" status="online" />
                </button>
            </motion.div>

            <ReportModal isOpen={showReport} onClose={() => setShowReport(false)} context="Global Header" />
        </header>
    );
}

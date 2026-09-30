"use client";

import { Header } from "@/components/shared";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, ShieldCheck, Building2, BarChart3, ClipboardList,
    FileText, Flag, Users, Settings
} from "lucide-react";

const adminNav = [
    { label: "Dashboard", href: "/super-admin/dashboard", icon: <Home className="w-5 h-5" /> },
    { label: "Provider Approval", href: "/super-admin/providers", icon: <ShieldCheck className="w-5 h-5" /> },
    { label: "Bed Monitoring", href: "/super-admin/beds", icon: <Building2 className="w-5 h-5" /> },
    { label: "Analytics", href: "/super-admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Reviews", href: "/super-admin/reviews", icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Fraud Flags", href: "/super-admin/fraud", icon: <Flag className="w-5 h-5" /> },
    { label: "Audit Log", href: "/super-admin/audit", icon: <FileText className="w-5 h-5" /> },
    { label: "RBAC", href: "/super-admin/rbac", icon: <Users className="w-5 h-5" /> },
    { label: "Settings", href: "/super-admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="min-h-screen relative" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="fixed inset-0 z-0" style={{ backgroundImage: "url('/medical-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(160deg, rgba(219,234,254,0.60) 0%, rgba(186,230,255,0.50) 40%, rgba(224,242,254,0.55) 100%)" }} />
            <div className="relative z-10">
                <Header />
                <div className="flex pt-20">
                    {/* Fixed sidebar for admin */}
                    <aside
                        className="hidden md:block fixed top-20 left-0 w-60 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin"
                        style={{
                            background: "rgba(255,255,255,0.8)",
                            backdropFilter: "blur(16px)",
                            borderRight: "1px solid rgba(255,255,255,0.9)",
                        }}
                    >
                        <div className="px-4 py-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Admin Panel</h3>
                            <nav className="space-y-1">
                                {adminNav.map((item) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-600 hover:bg-white/80"
                                                }`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>
                    <main className="flex-1 md:ml-60 pb-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}

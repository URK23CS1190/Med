"use client";

import { Header, Sidebar, BottomNav, FloatingEmergencyButton } from "@/components/shared";
import { useUIStore } from "@/stores";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const sidebarOpen = useUIStore((s) => s.sidebarOpen);

    return (
        <div className="min-h-screen relative" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Medical background */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: "url('/medical-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <div
                className="fixed inset-0 z-0"
                style={{
                    background: "linear-gradient(160deg, rgba(219,234,254,0.60) 0%, rgba(186,230,255,0.50) 40%, rgba(224,242,254,0.55) 100%)",
                }}
            />
            <div className="relative z-10">
                <Header />
                <Sidebar />
                <main
                    className={`
              transition-all duration-300 pt-20
              md:ml-[72px] ${sidebarOpen ? "md:ml-64" : "md:ml-[72px]"}
              pb-20 md:pb-6
            `}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                        {children}
                    </div>
                </main>
                <BottomNav />
                <FloatingEmergencyButton />
            </div>
        </div>
    );
}

"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { isDark, setTheme } = useThemeStore();

    useEffect(() => {
        // Check system preference on mount
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const stored = localStorage.getItem("theme-preference");

        if (stored) {
            const parsed = JSON.parse(stored);
            setTheme(parsed.state?.isDark ?? prefersDark);
        } else {
            setTheme(prefersDark);
        }
    }, [setTheme]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return <>{children}</>;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole, Profile } from "@/lib/supabase/types";

// ===================================================================
// Theme Store
// ===================================================================
interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: false,
            toggleTheme: () =>
                set((state) => {
                    const newDark = !state.isDark;
                    if (typeof document !== "undefined") {
                        document.documentElement.classList.toggle("dark", newDark);
                    }
                    return { isDark: newDark };
                }),
            setTheme: (dark: boolean) =>
                set(() => {
                    if (typeof document !== "undefined") {
                        document.documentElement.classList.toggle("dark", dark);
                    }
                    return { isDark: dark };
                }),
        }),
        { name: "theme-preference" }
    )
);

// ===================================================================
// Auth Store
// ===================================================================
interface AuthState {
    user: Profile | null;
    role: UserRole | null;
    isLoading: boolean;
    setUser: (user: Profile | null) => void;
    setRole: (role: UserRole | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    role: null,
    isLoading: true,
    setUser: (user) => set({ user, role: user?.role ?? null }),
    setRole: (role) => set({ role }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, role: null }),
}));

// ===================================================================
// UI Store (Sidebar, modals, toasts)
// ===================================================================
export interface Toast {
    id: string;
    title: string;
    description?: string;
    variant: "success" | "error" | "warning" | "info";
    duration?: number;
}

interface UIState {
    sidebarOpen: boolean;
    toasts: Toast[];
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
    sidebarOpen: false,
    toasts: [],
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    addToast: (toast) => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, toast.duration ?? 4000);
    },
    removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ===================================================================
// Cart Store (Pharmacy)
// ===================================================================
export interface CartItem {
    id: string;
    name: string;
    price: number;
    mrp: number;
    qty: number;
    image_url: string | null;
    requires_prescription: boolean;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "qty">) => void;
    removeItem: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((s) => {
                    const existing = s.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: s.items.map((i) =>
                                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                            ),
                        };
                    }
                    return { items: [...s.items, { ...item, qty: 1 }] };
                }),
            removeItem: (id) =>
                set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
            updateQty: (id, qty) =>
                set((s) => ({
                    items:
                        qty <= 0
                            ? s.items.filter((i) => i.id !== id)
                            : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
                })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
            itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
        }),
        { name: "pharmacy-cart" }
    )
);

"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((s) => s.setUser);
    const user = useAuthStore((s) => s.user);
    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        const loadSession = async () => {
            if (!user) {
                try {
                    const { data: { user: authUser } } = await supabase.auth.getUser();
                    if (authUser) {
                        const { data: profile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", authUser.id)
                            .maybeSingle();

                        if (profile) {
                            setUser(profile);
                        }
                    }
                } catch (e) {
                    console.error("Error loading session:", e);
                }
            }
        };

        loadSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
                try {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .maybeSingle();

                    if (profile) {
                        setUser(profile);
                    }
                } catch (e) {
                    console.error("Error on auth state change:", e);
                }
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, setUser, user]);

    return <>{children}</>;
}

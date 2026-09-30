import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/patient/dashboard";

    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Called from Server Component - safe to ignore
                        }
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Ensure profile exists
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id, role")
                .eq("id", data.user.id)
                .maybeSingle();

            if (!existingProfile) {
                // Create profile for OAuth user
                const fullName =
                    data.user.user_metadata?.full_name ||
                    data.user.user_metadata?.name ||
                    data.user.email?.split("@")[0] ||
                    "User";

                await supabase.from("profiles").insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: fullName,
                    avatar_url: data.user.user_metadata?.avatar_url || null,
                    role: "patient",
                    is_verified: true,
                    mfa_enabled: false,
                    preferred_language: "en",
                    consent_accepted_at: new Date().toISOString(),
                });
            }

            const role = existingProfile?.role || "patient";
            const roleRoutes: Record<string, string> = {
                patient: "/patient/dashboard",
                doctor: "/doctor/dashboard",
                hospital_admin: "/hospital-admin/dashboard",
                pharmacy_admin: "/pharmacy-admin/dashboard",
                ambulance_driver: "/ambulance-driver/dashboard",
                nurse: "/nurse/dashboard",
                super_admin: "/super-admin/dashboard",
            };

            return NextResponse.redirect(
                new URL(roleRoutes[role] || next, requestUrl.origin)
            );
        }
    }

    // Return to login on error
    return NextResponse.redirect(new URL("/login?error=oauth_error", requestUrl.origin));
}

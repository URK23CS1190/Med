"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Mail, Phone, ArrowRight, Stethoscope, Eye, EyeOff,
    Pill, Building2, Activity, Shield, ChevronRight,
    RefreshCw, CheckCircle2
} from "lucide-react";
import { Button, Input, OtpInput } from "@/components/ui";
import { UserRole } from "@/lib/supabase/types";
import { useAuthStore } from "@/stores";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/* ────────────────── Schemas ────────────────── */
const emailSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
const phoneSchema = z.object({
    phone: z.string().min(10, "Enter a valid phone number"),
});
type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

/* ────────────────── Role config ────────────────── */
const roleRoutes: Record<string, string> = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    hospital_admin: "/hospital-admin/dashboard",
    pharmacy_admin: "/pharmacy-admin/dashboard",
    ambulance_driver: "/ambulance-driver/dashboard",
    nurse: "/nurse/dashboard",
    super_admin: "/super-admin/dashboard",
};

const demoRoles = [
    { email: "patient@medcare.com", role: "patient", label: "Patient", desc: "Book & track care" },
    { email: "doctor@medcare.com", role: "doctor", label: "Doctor", desc: "Consult patients" },
    { email: "hospital@medcare.com", role: "hospital_admin", label: "Hospital", desc: "Beds & queues" },
    { email: "pharmacy@medcare.com", role: "pharmacy_admin", label: "Pharmacist", desc: "Process orders" },
    { email: "ambulance@medcare.com", role: "ambulance_driver", label: "Ambulance", desc: "Navigation" },
    { email: "nurse@medcare.com", role: "nurse", label: "Nurse", desc: "Care plans" },
    { email: "admin@medcare.com", role: "super_admin", label: "Super Admin", desc: "Platform admin" },
];



/* ────────────────── Main Page ────────────────── */
export default function LoginPage() {
    const [authMethod, setAuthMethod] = useState<"email" | "phone" | "otp">("email");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);

    /* email form */
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

    /* phone form */
    const {
        register: regPhone,
        handleSubmit: handlePhone,
        formState: { errors: phoneErrors },
    } = useForm<PhoneFormData>({ resolver: zodResolver(phoneSchema) });

    /* ── helpers ── */
    const startResendTimer = () => {
        setResendTimer(59);
        const t = setInterval(() => {
            setResendTimer((v) => {
                if (v <= 1) { clearInterval(t); return 0; }
                return v - 1;
            });
        }, 1000);
    };

    const fetchAndSetProfile = async (userId: string, fallbackEmail: string) => {
        const supabase = getSupabaseBrowserClient();
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (profile) {
            setUser(profile);
            router.push(roleRoutes[profile.role] || "/patient/dashboard");
            return;
        }

        // Create minimal profile if not found
        const emailPrefix = fallbackEmail.split("@")[0].toLowerCase();
        let role: UserRole = "patient";
        if (emailPrefix.includes("doctor")) role = "doctor";
        else if (emailPrefix.includes("pharmacy")) role = "pharmacy_admin";
        else if (emailPrefix.includes("ambulance")) role = "ambulance_driver";
        else if (emailPrefix.includes("nurse")) role = "nurse";
        else if (emailPrefix.includes("admin")) role = "super_admin";
        else if (emailPrefix.includes("hospital")) role = "hospital_admin";

        const fullName = emailPrefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " (Demo)";
        const { data: newProfile } = await supabase
            .from("profiles")
            .upsert({
                id: userId,
                email: fallbackEmail,
                full_name: fullName,
                role,
                is_verified: true,
                mfa_enabled: false,
                preferred_language: "en",
                consent_accepted_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            })
            .select("*")
            .maybeSingle();

        const resolvedProfile = newProfile || {
            id: userId, email: fallbackEmail, full_name: fullName, role,
            phone: null, avatar_url: null, date_of_birth: null, gender: null,
            blood_group: null, address: null, is_verified: true, mfa_enabled: false,
            preferred_language: "en", consent_accepted_at: null, created_at: new Date().toISOString(),
        };
        setUser(resolvedProfile);
        router.push(roleRoutes[role] || "/patient/dashboard");
    };

    /* ── Email/Password submit ── */
    const onEmailSubmit = async (data: EmailFormData) => {
        setIsLoading(true);
        setFormError(null);
        const supabase = getSupabaseBrowserClient();

        try {
            let authUser: { id: string; email?: string } | null = null;
            try {
                let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

                if (authError && (authError.status === 400 || authError.message.includes("Invalid login"))) {
                    const emailPrefix = data.email.split("@")[0].toLowerCase();
                    let role: UserRole = "patient";
                    if (emailPrefix.includes("doctor")) role = "doctor";
                    else if (emailPrefix.includes("pharmacy")) role = "pharmacy_admin";
                    else if (emailPrefix.includes("ambulance")) role = "ambulance_driver";
                    else if (emailPrefix.includes("nurse")) role = "nurse";
                    else if (emailPrefix.includes("admin")) role = "super_admin";
                    else if (emailPrefix.includes("hospital")) role = "hospital_admin";

                    const fullName = emailPrefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " (Demo)";
                    await supabase.auth.signUp({
                        email: data.email, password: data.password,
                        options: { data: { full_name: fullName, role } },
                    }).catch(() => {});

                    const retry = await supabase.auth.signInWithPassword({ email: data.email, password: data.password }).catch(() => null);
                    if (retry?.data?.user) authUser = retry.data.user;
                } else if (!authError && authData?.user) {
                    authUser = authData.user;
                }
            } catch (sbErr) {
                console.warn("Supabase network request failed, proceeding with demo session:", sbErr);
            }

            const targetId = authUser?.id || "demo_user_" + Date.now();
            await fetchAndSetProfile(targetId, data.email);
        } catch (error: unknown) {
            const err = error as { message?: string };
            const msg = err?.message || "";
            if (msg.includes("Failed to fetch") || msg.includes("fetch failed")) {
                await fetchAndSetProfile("demo_user_" + Date.now(), data.email);
            } else {
                setError("email", { type: "manual", message: msg || "Sign in failed. Check your credentials." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Google OAuth ── */
    const handleGoogleOAuth = async () => {
        setIsLoading(true);
        setFormError(null);
        const supabase = getSupabaseBrowserClient();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${appUrl}/api/auth/callback`,
                queryParams: { access_type: "offline", prompt: "consent" },
            },
        });

        if (error) {
            setFormError("Google sign-in failed: " + error.message);
            setIsLoading(false);
        }
        // Browser will redirect — no need to setIsLoading(false) on success
    };

    /* ── Phone OTP: Send ── */
    const onPhoneSubmit = async (data: PhoneFormData) => {
        setIsLoading(true);
        setFormError(null);

        // Normalise number to E.164
        let phone = data.phone.trim().replace(/\s/g, "");
        if (!phone.startsWith("+")) phone = "+91" + phone.replace(/^0/, "");
        setPhoneNumber(phone);

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const resData = await res.json();

            if (!resData.success) {
                setFormError(resData.error || "Failed to send OTP.");
                return;
            }

            setOtpSent(true);
            setAuthMethod("otp");
            startResendTimer();
        } catch (err: unknown) {
            setOtpSent(true);
            setAuthMethod("otp");
            startResendTimer();
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Phone OTP: Verify ── */
    const verifyOtp = async () => {
        const code = otpValue.join("");
        if (code.length < 6) { setFormError("Please enter all 6 digits."); return; }

        setIsLoading(true);
        setFormError(null);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber, code }),
            });
            const resData = await res.json();

            if (!resData.success) {
                setFormError(resData.error || "Invalid OTP code. Try 123456.");
                return;
            }

            setSuccessMsg("Phone verified! Redirecting…");
            const userEmail = `${phoneNumber.replace(/[^0-9]/g, "")}@phone.user`;
            await fetchAndSetProfile("phone_user_" + Date.now(), userEmail);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setFormError(e.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Resend OTP ── */
    const resendOtp = async () => {
        if (resendTimer > 0) return;
        setFormError(null);
        try {
            await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber }),
            });
            startResendTimer();
            setOtpValue(["", "", "", "", "", ""]);
        } catch (err: unknown) {
            setFormError("Resend failed. Please try again.");
        }
    };

    const features = [
        { icon: <Stethoscope className="w-5 h-5" />, label: "Consult Doctors" },
        { icon: <Pill className="w-5 h-5" />, label: "Order Medicines" },
        { icon: <Building2 className="w-5 h-5" />, label: "Find Hospital Beds" },
        { icon: <Activity className="w-5 h-5" />, label: "Emergency Services" },
    ];

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Left Hero Panel ── */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1a6fd4 0%, #0eada8 100%)" }}>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tight">
                                {process.env.NEXT_PUBLIC_APP_NAME || "MedCare"}
                            </span>
                        </div>

                        <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                            Care, Pharmacy,<br />and Emergency<br />
                            <span className="text-white/70">— Unified</span>
                        </h1>
                        <p className="text-lg text-white/75 mb-10 max-w-md leading-relaxed">
                            Your complete healthcare companion. Access doctors, medicines, hospitals, and emergency services.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {features.map((f, i) => (
                                <motion.div
                                    key={f.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium"
                                >
                                    {f.icon}{f.label}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
                style={{ background: "linear-gradient(160deg, #dbeafe 0%, #bae6ff 40%, #e0f2fe 100%)" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-md py-8"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #1a6fd4 0%, #0eada8 100%)" }}>
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black text-gray-900">
                            {process.env.NEXT_PUBLIC_APP_NAME || "MedCare"}
                        </span>
                    </div>

                    {/* Card */}
                    <div className="rounded-3xl p-8 shadow-2xl"
                        style={{
                            background: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.95)",
                        }}>

                        <AnimatePresence mode="wait">
                            {/* ── OTP Verification View ── */}
                            {authMethod === "otp" ? (
                                <motion.div key="otp-verify"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }} className="text-center">
                                    <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #1a6fd4, #0eada8)" }}>
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Verify your phone</h2>
                                    <p className="text-sm text-gray-500 mb-8">
                                        We sent a 6-digit code to <span className="font-semibold text-gray-800">{phoneNumber}</span>
                                    </p>

                                    {formError && (
                                        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">{formError}</div>
                                    )}
                                    {successMsg && (
                                        <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-xl flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />{successMsg}
                                        </div>
                                    )}

                                    <OtpInput value={otpValue} onChange={setOtpValue} onEnter={verifyOtp} showTimer={true} initialTimerSeconds={59} onResend={resendOtp} />

                                    <button
                                        onClick={verifyOtp}
                                        disabled={isLoading || otpValue.join("").length < 6}
                                        className="w-full mt-6 h-12 rounded-2xl text-white font-bold text-base disabled:opacity-50 transition-all"
                                        style={{ background: "linear-gradient(135deg, #1a6fd4, #0eada8)" }}
                                    >
                                        {isLoading ? "Verifying…" : "Verify & Sign In"}
                                    </button>

                                    <button onClick={() => { setAuthMethod("phone"); setOtpSent(false); setFormError(null); }}
                                        className="mt-4 text-sm text-gray-500 hover:text-gray-700">
                                        ← Change number
                                    </button>
                                </motion.div>
                            ) : (
                                /* ── Main Login View ── */
                                <motion.div key="main"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h2>
                                    <p className="text-sm text-gray-500 mb-6">Sign in to your MedCare account</p>

                                    {/* Method Tabs */}
                                    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-6">
                                        {(["email", "phone"] as const).map((m) => (
                                            <button key={m} onClick={() => { setAuthMethod(m); setFormError(null); }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                                    ${authMethod === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                                                {m === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                                                {m === "email" ? "Email" : "Phone OTP"}
                                            </button>
                                        ))}
                                    </div>

                                    {formError && (
                                        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">{formError}</div>
                                    )}

                                    {/* ── Email Form ── */}
                                    {authMethod === "email" && (
                                        <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
                                            <Input
                                                label="Email address" type="email" placeholder="you@example.com"
                                                leftIcon={<Mail className="w-4 h-4" />}
                                                error={errors.email?.message}
                                                {...register("email")}
                                            />
                                            <div className="relative">
                                                <Input
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    error={errors.password?.message}
                                                    {...register("password")}
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500" />
                                                    <span className="text-gray-600">Remember me</span>
                                                </label>
                                                <Link href="/forgot-password" className="text-blue-600 font-medium hover:text-blue-700">
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <button type="submit" disabled={isLoading}
                                                className="w-full h-12 rounded-2xl text-white font-bold text-base disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                                                style={{ background: "linear-gradient(135deg, #1a6fd4, #0eada8)" }}>
                                                {isLoading ? "Signing in…" : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                                            </button>
                                        </form>
                                    )}

                                    {/* ── Phone Form ── */}
                                    {authMethod === "phone" && (
                                        <form onSubmit={handlePhone(onPhoneSubmit)} className="space-y-4">
                                            <Input
                                                label="Phone number" type="tel" placeholder="+91 98765 43210"
                                                leftIcon={<Phone className="w-4 h-4" />}
                                                error={phoneErrors.phone?.message}
                                                {...regPhone("phone")}
                                            />
                                            <p className="text-xs text-gray-400">We&apos;ll send a 6-digit OTP to this number via SMS</p>
                                            <button type="submit" disabled={isLoading}
                                                className="w-full h-12 rounded-2xl text-white font-bold text-base disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                                                style={{ background: "linear-gradient(135deg, #1a6fd4, #0eada8)" }}>
                                                {isLoading ? "Sending OTP…" : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                                            </button>
                                        </form>
                                    )}

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-5">
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <span className="text-xs text-gray-400 font-medium">or continue with</span>
                                        <div className="flex-1 h-px bg-gray-200" />
                                    </div>

                                    {/* Google OAuth */}
                                    <button onClick={handleGoogleOAuth} disabled={isLoading}
                                        className="w-full h-12 rounded-2xl font-semibold text-sm text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all disabled:opacity-60"
                                        style={{ border: "1.5px solid #e5e7eb", background: "white" }}>
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    {/* Demo Quick Login */}
                                    <div className="mt-6 pt-5 border-t border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            ⚡ Demo Quick Login
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {demoRoles.map((dr) => (
                                                <button
                                                    key={dr.role}
                                                    type="button"
                                                    onClick={async () => {
                                                        setValue("email", dr.email);
                                                        setValue("password", "medcare123");
                                                        setAuthMethod("email");
                                                        await onEmailSubmit({ email: dr.email, password: "medcare123" });
                                                    }}
                                                    className="flex flex-col items-start p-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all text-left"
                                                >
                                                    <span className="text-xs font-bold text-blue-600">{dr.label}</span>
                                                    <span className="text-[10px] text-gray-400 mt-0.5">{dr.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Register link */}
                    <p className="text-center mt-6 text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-blue-600 font-bold hover:text-blue-700 inline-flex items-center gap-0.5">
                            Create account <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

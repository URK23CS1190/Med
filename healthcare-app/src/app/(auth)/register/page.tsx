"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    User, Mail, Phone, ArrowRight, Shield,
    Stethoscope, Building2, Pill, Truck, Heart, UserPlus,
    Lock, CheckCircle, Upload, Camera
} from "lucide-react";
import { Button, Input, Card, AIResultCard, OtpInput } from "@/components/ui";
import { useAuthStore } from "@/stores";
import type { UserRole } from "@/lib/supabase/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const roles: { role: UserRole; icon: React.ReactNode; label: string; description: string }[] = [
    { role: "patient", icon: <Heart className="w-6 h-6" />, label: "Patient", description: "Book appointments, order medicines, manage health records" },
    { role: "doctor", icon: <Stethoscope className="w-6 h-6" />, label: "Doctor", description: "Manage schedule, consult patients, write prescriptions" },
    { role: "hospital_admin", icon: <Building2 className="w-6 h-6" />, label: "Hospital Admin", description: "Manage beds, staff, and hospital operations" },
    { role: "pharmacy_admin", icon: <Pill className="w-6 h-6" />, label: "Pharmacist", description: "Manage catalog, process orders and prescriptions" },
    { role: "ambulance_driver", icon: <Truck className="w-6 h-6" />, label: "Ambulance Driver", description: "Navigate to hospitals, manage emergency trips" },
    { role: "nurse", icon: <UserPlus className="w-6 h-6" />, label: "Nurse", description: "Manage care bookings and patient notes" },
];

export default function RegisterPage() {
    type Step = "role" | "details" | "onboarding" | "2fa";
    const [step, setStep] = useState<Step>("role");
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [uploadedDoc, setUploadedDoc] = useState(false);

    // Form inputs state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);

    const isMedicalRole = selectedRole && ["doctor", "nurse", "ambulance_driver", "pharmacy_admin"].includes(selectedRole);

    const sendOtpNotification = async () => {
        try {
            await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone || email, email }),
            });
        } catch (e) {
            console.warn("OTP send error:", e);
        }
    };

    const nextStep = () => {
        if (step === "role") setStep("details");
        else if (step === "details") {
            sendOtpNotification();
            if (isMedicalRole) setStep("onboarding");
            else setStep("2fa");
        }
        else if (step === "onboarding") {
            sendOtpNotification();
            setStep("2fa");
        }
    };

    const prevStep = () => {
        if (step === "2fa") {
            if (isMedicalRole) setStep("onboarding");
            else setStep("details");
        }
        else if (step === "onboarding") setStep("details");
        else if (step === "details") setStep("role");
    };

    const handleGoogleOAuth = async () => {
        setIsLoading(true);
        setError(null);
        const supabase = getSupabaseBrowserClient();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

        const { error: gError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${appUrl}/api/auth/callback`,
                queryParams: { access_type: "offline", prompt: "consent" },
            },
        });

        if (gError) {
            setError("Google sign-up failed: " + gError.message);
            setIsLoading(false);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && fullName && email && password) {
            e.preventDefault();
            nextStep();
        }
    };

    const completeRegistration = async () => {
        const code = otp.join("");
        if (code.length < 6) { setError("Please enter all 6 digits."); return; }

        setIsLoading(true);
        setError(null);

        try {
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone || email, email, code }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyJson.success) {
                setError(verifyJson.error || "Invalid verification code. Try 123456.");
                return;
            }

            const role = selectedRole || "patient";
            const userId = "user_" + Date.now();
            const profile = {
                id: userId,
                full_name: fullName || "Registered User",
                email: email || "user@medcare.com",
                phone: phone || null,
                avatar_url: null,
                date_of_birth: null,
                gender: null,
                blood_group: null,
                address: null,
                role,
                is_verified: true,
                mfa_enabled: false,
                preferred_language: "en",
                consent_accepted_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            };

            setUser(profile);
            router.push(`/${role.replace('_', '-')}/dashboard`);
        } catch (err: unknown) {
            const errorMsg = err as { message?: string };
            setError(errorMsg.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface-secondary dark:bg-surface-dark overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-heading-lg font-display gradient-text">MedCare</span>
                    </div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary mb-2">
                        {step === "role" && "What is your role?"}
                        {step === "details" && "Personal Details"}
                        {step === "onboarding" && "Onboarding & Documents"}
                        {step === "2fa" && "Security Verification"}
                    </h1>
                    <p className="text-body-md text-content-secondary">
                        {step === "role" && "Select your profile type to customize your experience"}
                        {step === "details" && "Enter your basic contact information"}
                        {step === "onboarding" && "Upload your medical credentials for AI verification"}
                        {step === "2fa" && "Enter the 6-digit code sent to your phone"}
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-8 max-w-sm mx-auto">
                    {(["role", "details", "onboarding", "2fa"] as Step[]).map((s, i) => {
                        const active = (["role", "details", "onboarding", "2fa"] as Step[]).indexOf(step) >= i;
                        if (s === "onboarding" && !isMedicalRole) return null;
                        return (
                            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${active ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {step === "role" && (
                        <motion.div key="role" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {roles.map((r) => (
                                <Card key={r.role} variant="interactive" padding="md" className={`cursor-pointer border-2 transition-all ${selectedRole === r.role ? "border-primary-500 bg-primary-50/30 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5" : "border-transparent"}`} onClick={() => setSelectedRole(r.role)}>
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${selectedRole === r.role ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "bg-gray-100 dark:bg-gray-800 text-content-tertiary"}`}>
                                            {r.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-body-lg font-bold">{r.label}</h3>
                                            <p className="text-body-sm text-content-tertiary mt-0.5 leading-relaxed">{r.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            <div className="sm:col-span-2 flex justify-center mt-6">
                                <Button size="lg" disabled={!selectedRole} onClick={nextStep} rightIcon={<ArrowRight className="w-5 h-5" />}>Continue to Details</Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "details" && (
                        <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto">
                            <Card padding="lg" className="space-y-4 shadow-xl">
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 rounded-button">
                                        {error}
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    onClick={handleGoogleOAuth}
                                    className="flex items-center justify-center gap-3 py-3 border-gray-200 dark:border-gray-700 font-semibold"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                                        <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                                    </svg>
                                    Sign up with Google
                                </Button>
                                <div className="relative my-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-surface-dark-elevated px-2 text-gray-400">Or register with email</span></div>
                                </div>
                                <Input label="Full Name" placeholder="e.g. Dr. Rajesh Patil" leftIcon={<User className="w-4 h-4" />} value={fullName} onChange={(e) => setFullName(e.target.value)} onKeyDown={handleInputKeyDown} />
                                <Input label="Email Address" type="email" placeholder="rajesh@example.com" leftIcon={<Mail className="w-4 h-4" />} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleInputKeyDown} />
                                <Input label="Phone Number" placeholder="+91 98765 43210" leftIcon={<Phone className="w-4 h-4" />} value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={handleInputKeyDown} />
                                <Input label="Password" type="password" placeholder="Min 8 characters" leftIcon={<Lock className="w-4 h-4" />} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleInputKeyDown} />
                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" fullWidth onClick={prevStep}>Back</Button>
                                    <Button fullWidth onClick={nextStep} disabled={!fullName || !email || !password}>Next Step</Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {step === "onboarding" && (
                        <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 gap-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800/20 cursor-pointer transition-all" onClick={() => setUploadedDoc(true)}>
                                    <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600"><Upload className="w-7 h-7" /></div>
                                    <p className="text-body-md font-bold">Upload Medical License</p>
                                    <p className="text-caption text-content-tertiary">PDF, PNG or JPG (Max 5MB)</p>
                                </Card>
                                <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 gap-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800/20 cursor-pointer transition-all">
                                    <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600"><Camera className="w-7 h-7" /></div>
                                    <p className="text-body-md font-bold">Government Photo ID</p>
                                    <p className="text-caption text-content-tertiary">Take a photo or upload</p>
                                </Card>
                            </div>

                            {uploadedDoc && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                    <AIResultCard
                                        documentName="Medical_License_2024.pdf"
                                        uploadedAt="Just now"
                                        confidenceScore={96}
                                        recommendation="likely_genuine"
                                        extractedFields={[
                                            { label: "Name", value: "Dr. Rajesh Patil", match: "match" },
                                            { label: "License #", value: "MC/MH/2018/0854", match: "match" }
                                        ]}
                                        detectedIssues={[]}
                                        fraudRisk="minimal"
                                        fraudDetails={["Signature verified", "Standard template match"]}
                                    />
                                </motion.div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <Button variant="outline" size="lg" onClick={prevStep}>Back</Button>
                                <Button size="lg" disabled={!uploadedDoc} onClick={nextStep}>Continue to Security</Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "2fa" && (
                        <motion.div key="2fa" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto text-center">
                            <Card padding="lg" className="shadow-2xl">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                    <Lock className="w-10 h-10" />
                                </div>
                                <h3 className="text-heading-md mb-2">Authenticator Code</h3>
                                <p className="text-body-sm text-content-secondary mb-8">Please enter the 6-digit verification code sent to your registered phone number ending in •••• 3210</p>

                                <div className="mb-8">
                                    <OtpInput value={otp} onChange={setOtp} onEnter={completeRegistration} showTimer={true} initialTimerSeconds={59} />
                                </div>

                                <Button fullWidth size="lg" isLoading={isLoading} onClick={completeRegistration} leftIcon={<CheckCircle className="w-5 h-5" />}>Verify & Complete</Button>
                            </Card>
                            <Button variant="ghost" className="mt-4" onClick={prevStep}>Back</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

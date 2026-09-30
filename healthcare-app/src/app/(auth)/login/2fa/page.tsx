"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Shield, Lock, CheckCircle, ArrowLeft,
    Smartphone
} from "lucide-react";
import { Button, Card, OtpInput } from "@/components/ui";
import Link from "next/link";

export default function TwoFactorPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState<"sms" | "app">("app");
    const router = useRouter();

    const handleVerify = () => {
        setIsLoading(true);
        setTimeout(() => {
            router.push("/doctor/dashboard"); // For demo
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface-secondary dark:bg-surface-dark relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
                <Card padding="lg" className="shadow-2xl border-0">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/30 mb-6">
                            <Shield className="w-8 h-8" />
                        </div>

                        <h1 className="text-display-xs font-display mb-2">Two-Step Verification</h1>
                        <p className="text-body-sm text-content-secondary mb-8">
                            Enter the 6-digit code from your {method === "app" ? "authenticator app" : "SMS"} to continue to your dashboard.
                        </p>

                        <div className="mb-8">
                            <OtpInput value={otp} onChange={setOtp} showTimer={true} initialTimerSeconds={59} />
                        </div>

                        <Button fullWidth size="lg" isLoading={isLoading} onClick={handleVerify} leftIcon={<CheckCircle className="w-5 h-5" />}>
                            Verify Identity
                        </Button>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 w-full space-y-4">
                            <button
                                onClick={() => setMethod(method === "app" ? "sms" : "app")}
                                className="flex items-center justify-center gap-2 text-body-sm text-content-secondary hover:text-primary-500 transition-colors mx-auto"
                            >
                                <Smartphone className="w-4 h-4" />
                                Use another method
                            </button>
                            <Link href="/login" className="flex items-center justify-center gap-2 text-body-sm text-content-tertiary hover:text-content-primary mx-auto">
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </div>
                    </div>
                </Card>

                <div className="mt-8 flex items-center justify-center gap-2 text-caption text-content-tertiary">
                    <Lock className="w-3 h-3" />
                    Secure encrypted login system
                </div>
            </motion.div>
        </div>
    );
}

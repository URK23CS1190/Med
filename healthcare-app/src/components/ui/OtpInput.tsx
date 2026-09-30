"use client";

import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { RefreshCw } from "lucide-react";

interface OtpInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    showTimer?: boolean;
    initialTimerSeconds?: number;
    onResend?: () => void;
    onEnter?: () => void;
}

export function OtpInput({
    value,
    onChange,
    length = 6,
    disabled = false,
    autoFocus = true,
    showTimer = true,
    initialTimerSeconds = 59,
    onResend,
    onEnter,
}: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(initialTimerSeconds);
    const [isResending, setIsResending] = useState(false);

    // Focus first input on mount
    useEffect(() => {
        if (autoFocus && refs.current[0]) {
            refs.current[0].focus();
        }
    }, [autoFocus]);

    // Timer countdown effect
    useEffect(() => {
        if (!showTimer) return;
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, showTimer]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const lastChar = val.replace(/\D/g, "").slice(-1);

        const newOtp = [...value];
        newOtp[index] = lastChar;
        onChange(newOtp);

        // Advance to next box if character entered
        if (lastChar && index < length - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (onEnter) onEnter();
        } else if (e.key === "Backspace") {
            if (!value[index] && index > 0) {
                // Focus previous and clear it
                refs.current[index - 1]?.focus();
                const newOtp = [...value];
                newOtp[index - 1] = "";
                onChange(newOtp);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            refs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pastedData) return;

        const digits = pastedData.split("");
        const newOtp = [...value];
        for (let i = 0; i < length; i++) {
            newOtp[i] = digits[i] || "";
        }
        onChange(newOtp);

        const nextIndex = Math.min(digits.length, length - 1);
        refs.current[nextIndex]?.focus();
    };

    const handleResendClick = async () => {
        if (timeLeft > 0 || isResending) return;
        setIsResending(true);
        if (onResend) {
            await onResend();
        }
        setTimeLeft(initialTimerSeconds);
        setIsResending(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            refs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={value[i] || ""}
                        disabled={disabled}
                        onChange={(e) => handleChange(i, e)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all outline-none ${
                            value[i]
                                ? "border-primary-500 bg-primary-50/50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-dark-elevated text-gray-900 dark:text-white"
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20`}
                    />
                ))}
            </div>

            {showTimer && (
                <div className="mt-4 text-center">
                    {timeLeft > 0 ? (
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 justify-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Resend code in <span className="font-semibold text-primary-500">{formatTime(timeLeft)}</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendClick}
                            disabled={isResending}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 hover:underline transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
                            Resend Verification Code
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: "default" | "search";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, hint, leftIcon, rightIcon, variant = "default", className = "", type, ...props },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const isSearch = variant === "search";

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-body-sm font-medium text-content-primary dark:text-content-dark-primary mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {(leftIcon || isSearch) && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary">
                            {isSearch ? <Search className="w-4 h-4" /> : leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword && showPassword ? "text" : type}
                        className={`
              w-full h-11 rounded-input border bg-white dark:bg-surface-dark-elevated
              text-body-md text-content-primary dark:text-content-dark-primary
              placeholder:text-content-tertiary dark:placeholder:text-content-dark-secondary
              transition-all duration-200
              focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error
                                ? "border-status-danger focus:ring-red-500/20 focus:border-status-danger"
                                : "border-gray-200 dark:border-gray-700"
                            }
              ${leftIcon || isSearch ? "pl-10" : "pl-4"}
              ${rightIcon || isPassword ? "pr-10" : "pr-4"}
              ${className}
            `}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary transition-colors"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}
                    {rightIcon && !isPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-body-sm text-status-danger" role="alert">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-1 text-body-sm text-content-tertiary">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
export { Input, type InputProps };

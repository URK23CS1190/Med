"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "success";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-gradient-button text-white hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.97]",
    secondary:
        "bg-gradient-teal text-white hover:shadow-lg hover:shadow-secondary-500/25 active:scale-[0.97]",
    outline:
        "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 active:scale-[0.97]",
    ghost:
        "text-content-secondary hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.97]",
    destructive:
        "bg-status-danger text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.97]",
    success:
        "bg-status-success text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.97]",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-body-sm rounded-button gap-1.5",
    md: "h-10 px-5 text-body-md rounded-button gap-2",
    lg: "h-12 px-6 text-body-lg rounded-button gap-2.5",
    xl: "h-14 px-8 text-heading-sm rounded-button gap-3",
    icon: "h-10 w-10 rounded-full flex items-center justify-center p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading,
            leftIcon,
            rightIcon,
            fullWidth,
            children,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
                className={`
          btn-ripple inline-flex items-center justify-center font-semibold
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
                disabled={disabled || isLoading}
                {...(props as Record<string, unknown>)}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                ) : (
                    leftIcon
                )}
                {children}
                {rightIcon}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };

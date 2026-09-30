"use client";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "inactive" | "primary" | "secondary";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    pulse?: boolean;
    dot?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
    secondary: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400",
};

const dotColors: Record<BadgeVariant, string> = {
    success: "bg-status-success",
    warning: "bg-status-warning",
    danger: "bg-status-danger",
    info: "bg-primary-500",
    inactive: "bg-status-inactive",
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-caption px-2.5 py-1",
    lg: "text-body-sm px-3 py-1.5",
};

export function Badge({
    variant = "primary",
    size = "md",
    pulse = false,
    dot = false,
    children,
    className = "",
    onClick,
}: BadgeProps) {
    return (
        <span
            onClick={onClick}
            className={`
        inline-flex items-center gap-1.5 rounded-chip font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        ${className}
      `}
        >
            {dot && (
                <span className="relative flex h-2 w-2">
                    {pulse && (
                        <span
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotColors[variant]}`}
                        />
                    )}
                    <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
                    />
                </span>
            )}
            {children}
        </span>
    );
}

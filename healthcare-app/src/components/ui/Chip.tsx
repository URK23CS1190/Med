"use client";

interface ChipProps {
    label: string;
    selected?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
    size?: "sm" | "md";
    variant?: "default" | "outline";
    className?: string;
}

export function Chip({
    label,
    selected = false,
    onClick,
    icon,
    removable = false,
    onRemove,
    size = "md",
    variant = "default",
    className = "",
}: ChipProps) {
    const baseClasses = `
    inline-flex items-center gap-1.5 rounded-chip font-medium
    transition-all duration-200 cursor-pointer select-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
  `;

    const sizeClasses = size === "sm"
        ? "text-caption px-2.5 py-1"
        : "text-body-sm px-3.5 py-1.5";

    const variantClasses = selected
        ? "bg-primary-500 text-white shadow-sm hover:bg-primary-600"
        : variant === "outline"
            ? "border border-gray-200 dark:border-gray-700 text-content-secondary dark:text-content-dark-secondary hover:border-primary-500 hover:text-primary-500"
            : "bg-gray-100 dark:bg-gray-800 text-content-secondary dark:text-content-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
            role="option"
            aria-selected={selected}
        >
            {icon}
            <span>{label}</span>
            {removable && (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    className="ml-0.5 hover:text-white/80 cursor-pointer"
                    aria-label={`Remove ${label}`}
                >
                    ×
                </span>
            )}
        </button>
    );
}

"use client";

import Image from "next/image";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    status?: "online" | "busy" | "away" | "offline";
    fallback?: string;
    className?: string;
}

const sizeClasses: Record<string, string> = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-caption",
    md: "w-10 h-10 text-body-sm",
    lg: "w-14 h-14 text-body-lg",
    xl: "w-20 h-20 text-heading-lg",
};

const sizePixels: Record<string, number> = {
    xs: 24, sm: 32, md: 40, lg: 56, xl: 80,
};

const statusColors: Record<string, string> = {
    online: "bg-status-success",
    busy: "bg-status-danger",
    away: "bg-status-warning",
    offline: "bg-status-inactive",
};

const statusSizeClasses: Record<string, string> = {
    xs: "w-1.5 h-1.5 border",
    sm: "w-2 h-2 border",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-4 h-4 border-2",
};

export function Avatar({
    src,
    alt = "",
    size = "md",
    status,
    fallback,
    className = "",
}: AvatarProps) {
    const initials = fallback
        ? fallback
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";

    return (
        <div className={`relative inline-flex flex-shrink-0 ${className}`}>
            {src ? (
                <Image
                    src={src}
                    alt={alt || fallback || "Avatar"}
                    width={sizePixels[size]}
                    height={sizePixels[size]}
                    className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-surface-dark`}
                />
            ) : (
                <div
                    className={`
            ${sizeClasses[size]} rounded-full flex items-center justify-center
            bg-gradient-hero text-white font-semibold
            ring-2 ring-white dark:ring-surface-dark
          `}
                    aria-label={alt || fallback}
                >
                    {initials}
                </div>
            )}
            {status && (
                <span
                    className={`
            absolute bottom-0 right-0 rounded-full
            border-white dark:border-surface-dark
            ${statusColors[status]}
            ${statusSizeClasses[size]}
          `}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
}

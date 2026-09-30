"use client";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "card";
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export function Skeleton({
    className = "",
    variant = "text",
    width,
    height,
    lines = 1,
}: SkeletonProps) {
    const style: React.CSSProperties = {
        width: width || undefined,
        height: height || undefined,
    };

    if (variant === "circular") {
        return (
            <div
                className={`skeleton rounded-full ${className}`}
                style={{ ...style, width: width || 40, height: height || 40 }}
            />
        );
    }

    if (variant === "card") {
        return (
            <div className={`skeleton rounded-card ${className}`} style={{ ...style, height: height || 200 }} />
        );
    }

    if (variant === "rectangular") {
        return <div className={`skeleton ${className}`} style={style} />;
    }

    // Text variant - renders multiple lines
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton h-4 rounded"
                    style={{
                        width: i === lines - 1 && lines > 1 ? "75%" : width || "100%",
                    }}
                />
            ))}
        </div>
    );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
    return (
        <div className="card-base p-5 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="40%" height={12} />
                </div>
            </div>
            <Skeleton lines={3} />
            <div className="flex gap-2">
                <Skeleton width={80} height={32} variant="rectangular" className="rounded-button" />
                <Skeleton width={80} height={32} variant="rectangular" className="rounded-button" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="70%" height={14} />
                        <Skeleton width="50%" height={12} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="space-y-2">
            <div className="flex gap-4 p-3">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} width={`${100 / cols}%`} height={14} />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3">
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton key={j} width={`${100 / cols}%`} height={12} />
                    ))}
                </div>
            ))}
        </div>
    );
}

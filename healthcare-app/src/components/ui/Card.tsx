"use client";

import { forwardRef, type HTMLAttributes } from "react";

type CardVariant = "default" | "interactive" | "gradient" | "glass" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses: Record<CardVariant, string> = {
    default: "card-base",
    interactive: "card-interactive",
    gradient: "card-gradient",
    glass: "glass rounded-card",
    elevated: "card-base shadow-elevated",
};

const paddingClasses: Record<string, string> = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-6 md:p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = "default", padding = "md", className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Sub-components
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div ref={ref} className={`flex items-center justify-between mb-4 ${className}`} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = "", ...props }, ref) => (
        <h3 ref={ref} className={`text-heading-md text-content-primary dark:text-content-dark-primary ${className}`} {...props} />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className = "", ...props }, ref) => (
        <p ref={ref} className={`text-body-sm text-content-secondary dark:text-content-dark-secondary ${className}`} {...props} />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div ref={ref} className={className} {...props} />
    )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, type CardProps };

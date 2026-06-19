import React, { HTMLAttributes, forwardRef } from "react";

type CardVariant = "default" | "elevated" | "interactive" | "outlined";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  clickable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", clickable = false, className = "", children, onClick, ...props }, ref) => {
    const base = "rounded-xl bg-white transition-all duration-200";
    const variants: Record<CardVariant, string> = {
      default: "border border-gray-200 shadow-sm",
      elevated: "border-0 shadow-md hover:shadow-lg",
      interactive:
        "border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      outlined: "border-2 border-gray-100",
    };

    const baseProps = {
      className: `${base} ${variants[variant]} ${className}`,
    };

    if (clickable) {
      return (
        <button
          ref={ref as any}
          type="button"
          {...(baseProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
        >
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref}
        {...(baseProps as React.HTMLAttributes<HTMLDivElement>)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`px-6 pt-5 pb-4 ${className}`} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 ${className}`} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`px-6 pb-5 pt-4 flex items-center justify-between gap-3 ${className}`} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = "", ...props }, ref) => (
    <h3 ref={ref} className={`text-lg font-semibold text-gray-900 ${className}`} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => (
    <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
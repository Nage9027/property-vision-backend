import React, { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 " +
      "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " +
      "rounded-lg select-none";

    // Variant styles
    const variantMap: Record<Variant, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      link: "bg-transparent text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500 h-auto px-2 py-1 min-h-0",
    };

    // Size styles (link overrides these naturally)
    const sizeMap: Record<Exclude<Size, "icon">, string> = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const sizeClass = size === "icon" ? "h-10 w-10 p-0" : variant === "link" ? "" : sizeMap[size];

    // Loading spinner (inline SVG to avoid extra deps)
    const spinner = (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Combine classes
    const classes = [
      base,
      variantMap[variant],
      sizeClass,
      fullWidth ? "w-full" : "",
      className,
    ].filter(Boolean).join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? spinner : null}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
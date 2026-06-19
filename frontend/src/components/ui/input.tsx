import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      id,
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`
              w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50
              transition-all duration-200
              ${leftIcon ? "pl-9" : ""} ${rightIcon ? "pr-9" : ""}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
              ${className}
            `}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
        {description && !error && (
          <p id={`${inputId}-desc`} className="text-xs text-gray-500">
            {description}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
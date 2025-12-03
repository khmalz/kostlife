"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CurrencyInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange"
> {
    value: string;
    onChange: (value: string) => void;
}

function formatToIndonesian(value: string): string {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseFromIndonesian(value: string): string {
    return value.replace(/\./g, "");
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, value, onChange, placeholder, ...props }, ref) => {
        const displayValue = formatToIndonesian(value);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            const rawValue = parseFromIndonesian(inputValue);
            onChange(rawValue);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const allowedKeys = [
                "Backspace",
                "Delete",
                "Tab",
                "Escape",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End",
            ];

            if (allowedKeys.includes(e.key)) {
                return;
            }

            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (
                e.ctrlKey &&
                ["a", "c", "v", "x"].includes(e.key.toLowerCase())
            ) {
                return;
            }

            // Block non-numeric characters
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        };

        return (
            <input
                type="text"
                inputMode="numeric"
                ref={ref}
                value={displayValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                {...props}
            />
        );
    },
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput, formatToIndonesian, parseFromIndonesian };

"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export function SearchBar({
    placeholder = "Search...",
    value,
    onChange,
}: SearchBarProps) {
    return (
        <div className="relative flex-1">
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="h-10 rounded-full border-none bg-secondary pl-4 pr-10 text-secondary-foreground placeholder:text-secondary-foreground/60"
            />
            <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-secondary-foreground/60" />
        </div>
    );
}

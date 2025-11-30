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
                className="h-10 rounded-full border-foreground ring ring-foreground bg-background pl-4 pr-10 text-foreground placeholder:text-foreground/70"
            />
            <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-foreground/70" />
        </div>
    );
}

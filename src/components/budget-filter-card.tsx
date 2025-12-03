"use client";

import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "income" | "expense";
export type SortOrder = "ascending" | "descending";

interface BudgetFilterCardProps {
    filterType: FilterType;
    sortOrder: SortOrder;
    onFilterChange: (filter: FilterType) => void;
    onSortChange: (sort: SortOrder) => void;
    className?: string;
}

export function BudgetFilterCard({
    filterType,
    sortOrder,
    onFilterChange,
    onSortChange,
    className,
}: BudgetFilterCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasActiveFilter = filterType !== "all";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center size-10 rounded-full transition-colors shrink-0",
                    hasActiveFilter
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/50 text-primary-foreground hover:bg-primary/70",
                )}
                aria-label="Toggle filter"
                title={
                    hasActiveFilter ? "Filter active" : "Filter transactions"
                }
            >
                <Filter className="size-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 min-w-[180px] bg-background rounded-xl p-4 shadow-lg border border-foreground/10">
                    <div className="mb-3">
                        <p className="text-xs text-foreground/60 mb-1.5">
                            Filter
                        </p>
                        <div className="flex flex-col gap-0.5">
                            <button
                                onClick={() => {
                                    onFilterChange("income");
                                }}
                                className={cn(
                                    "text-left text-sm font-medium px-2 py-1.5 rounded transition-colors",
                                    filterType === "income"
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground hover:bg-foreground/5",
                                )}
                            >
                                Pemasukan
                            </button>
                            <button
                                onClick={() => {
                                    onFilterChange("expense");
                                }}
                                className={cn(
                                    "text-left text-sm font-medium px-2 py-1.5 rounded transition-colors",
                                    filterType === "expense"
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground hover:bg-foreground/5",
                                )}
                            >
                                Pengeluaran
                            </button>
                            {filterType !== "all" && (
                                <button
                                    onClick={() => {
                                        onFilterChange("all");
                                    }}
                                    className="text-left text-xs text-foreground/60 px-2 py-1 hover:text-foreground transition-colors"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-foreground/20 my-3" />

                    <div>
                        <p className="text-xs text-foreground/60 mb-1.5">
                            Sort
                        </p>
                        <div className="flex flex-col gap-0.5">
                            <button
                                onClick={() => {
                                    onSortChange("ascending");
                                }}
                                className={cn(
                                    "text-left text-sm font-medium px-2 py-1.5 rounded transition-colors",
                                    sortOrder === "ascending"
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground hover:bg-foreground/5",
                                )}
                            >
                                Ascending
                            </button>
                            <button
                                onClick={() => {
                                    onSortChange("descending");
                                }}
                                className={cn(
                                    "text-left text-sm font-medium px-2 py-1.5 rounded transition-colors",
                                    sortOrder === "descending"
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground hover:bg-foreground/5",
                                )}
                            >
                                Descending
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

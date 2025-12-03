"use client";

import {
    BudgetFilterCard,
    FilterType,
    SortOrder,
} from "@/components/budget-filter-card";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Transaction, TransactionCard } from "@/components/transaction-card";
import { WalletCard } from "@/components/wallet-card";
import { useAuth } from "@/hooks/useAuth";
import { getUserBudgets } from "@/lib/services/budget.service";
import type { Budget } from "@/types/budgets";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function budgetToTransaction(budget: Budget): Transaction {
    return {
        id: budget.id,
        type: budget.type,
        amount: budget.amount,
        description: budget.description,
        date: new Date(budget.budget_at),
    };
}

export default function BudgetPageClient() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("descending");

    const fetchBudgets = useCallback(async () => {
        if (!user?.id) return;

        setIsLoadingBudgets(true);
        setError(null);

        try {
            const fetchedBudgets = await getUserBudgets(
                user.id,
                "budget_at",
                "desc",
            );
            setBudgets(fetchedBudgets);
        } catch (err) {
            console.error("Error fetching budgets:", err);
            setError("Gagal memuat transaksi. Silakan coba lagi.");
        } finally {
            setIsLoadingBudgets(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchBudgets();
        } else if (!authLoading && !isAuthenticated) {
            setIsLoadingBudgets(false);
        }
    }, [isAuthenticated, user?.id, authLoading, fetchBudgets]);

    const transactions = useMemo(
        () => budgets.map(budgetToTransaction),
        [budgets],
    );

    const balance = user?.amount_budget ?? 0;

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleAddTransaction = () => {
        router.push("/budget/add");
    };

    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.description.toLowerCase().includes(query) ||
                    t.amount.toString().includes(query),
            );
        }

        // Apply type filter
        if (filterType !== "all") {
            result = result.filter((t) => t.type === filterType);
        }

        // Apply sort
        result.sort((a, b) => {
            const dateA = a.date.getTime();
            const dateB = b.date.getTime();
            return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [transactions, searchQuery, filterType, sortOrder]);

    const isLoading = authLoading || isLoadingBudgets;

    return (
        <div className="min-h-screen bg-secondary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={authLoading}
                username={user?.username}
                onLogout={handleLogout}
            />

            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                {/* Mobile Header */}
                <header className="mb-6 flex items-center gap-3 md:hidden">
                    <MobileSidebar />
                    <SearchBar
                        placeholder="Search Transaction"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </header>

                <div className="hidden md:flex md:items-center md:justify-center md:gap-4 md:mb-8 md:max-w-xl md:mx-auto">
                    <SearchBar
                        placeholder="Search Transaction..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                    <BudgetFilterCard
                        filterType={filterType}
                        sortOrder={sortOrder}
                        onFilterChange={setFilterType}
                        onSortChange={setSortOrder}
                    />
                </div>

                <section className="mb-8 md:flex md:justify-center">
                    <div className="md:w-full md:max-w-lg">
                        <WalletCard
                            balance={balance}
                            onAddTransaction={handleAddTransaction}
                        />
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-xl font-bold text-primary-foreground md:text-2xl">
                            Transactions
                        </h2>
                        <BudgetFilterCard
                            filterType={filterType}
                            sortOrder={sortOrder}
                            onFilterChange={setFilterType}
                            onSortChange={setSortOrder}
                            className="md:hidden"
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground"></div>
                            <p className="text-primary-foreground/60">
                                Loading transactions...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={fetchBudgets}
                                className="text-primary-foreground underline hover:no-underline"
                            >
                                Coba lagi
                            </button>
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                            {filteredTransactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-primary/60">
                                No transactions found.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

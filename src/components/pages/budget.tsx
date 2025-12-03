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
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Static dummy data for transactions
const DUMMY_TRANSACTIONS: Transaction[] = [
    {
        id: "1",
        type: "income",
        amount: 20000,
        description: "Beli Bahan Masakan",
        date: new Date("2025-12-03"),
    },
    {
        id: "2",
        type: "expense",
        amount: 30000,
        description: "Kebutuhan Kuliah",
        date: new Date("2025-11-28"),
    },
    {
        id: "3",
        type: "expense",
        amount: 5000,
        description: "Jajan Siang",
        date: new Date("2025-11-25"),
    },
    {
        id: "4",
        type: "income",
        amount: 50000,
        description: "Transfer dari Orang Tua",
        date: new Date("2025-11-20"),
    },
    {
        id: "5",
        type: "expense",
        amount: 15000,
        description: "Beli Pulsa",
        date: new Date("2025-11-18"),
    },
];

const DUMMY_BALANCE = 40000;

export default function BudgetPageClient() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("descending");

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleAddTransaction = () => {
        router.push("/budget/add");
    };

    const filteredTransactions = useMemo(() => {
        let result = [...DUMMY_TRANSACTIONS];

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
    }, [searchQuery, filterType, sortOrder]);

    return (
        <div className="min-h-screen bg-secondary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={isLoading}
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
                            balance={DUMMY_BALANCE}
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

                    {filteredTransactions.length > 0 ? (
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

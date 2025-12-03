"use client";

import { useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { TransactionForm } from "@/components/transaction-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import type { Transaction } from "@/components/transaction-card";

// TODO: This will be replaced with actual data from Firebase
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

export default function EditTransactionPage() {
    const router = useRouter();
    const params = useParams();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    // Use useMemo to derive transaction from params - no setState needed
    const transaction = useMemo(() => {
        const id = params.id as string;
        return DUMMY_TRANSACTIONS.find((t) => t.id === id) ?? null;
    }, [params.id]);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleSubmit = (data: Omit<Transaction, "id">) => {
        // TODO: Integrate with Firebase to update transaction
        console.log("Updated transaction:", { id: params.id, ...data });

        // For now, just redirect back to budget page
        router.push("/budget");
    };

    if (!transaction) {
        return (
            <div className="min-h-screen bg-secondary">
                <Navbar
                    isLoggedIn={isAuthenticated}
                    isLoading={isLoading}
                    username={user?.username}
                    onLogout={handleLogout}
                />
                <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-primary-foreground/60">
                            Transaction not found.
                        </p>
                        <button
                            onClick={() => router.push("/budget")}
                            className="text-primary-foreground underline hover:no-underline"
                        >
                            Back to Budget
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={isLoading}
                username={user?.username}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                {/* Mobile Header - just hamburger menu */}
                <header className="mb-6 flex items-center md:hidden">
                    <MobileSidebar />
                </header>

                {/* Transaction Form - use key to reset form when transaction changes */}
                <TransactionForm
                    key={transaction.id}
                    mode="edit"
                    initialData={transaction}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

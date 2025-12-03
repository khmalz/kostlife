"use client";

import { Navbar } from "@/components/navbar";
import type { Transaction } from "@/components/transaction-card";
import { TransactionForm } from "@/components/transaction-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AddTransactionPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleSubmit = (data: Omit<Transaction, "id">) => {
        // TODO: Integrate with Firebase to save transaction
        console.log("New transaction:", data);

        // For now, just redirect back to budget page
        router.push("/budget");
    };

    return (
        <div className="min-h-screen bg-secondary">
            {/* Desktop Navbar */}
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={isLoading}
                username={user?.username}
                onLogout={handleLogout}
            />

            <div className="mx-auto max-w-md md:max-w-6xl md:px-8 md:py-10">
                <TransactionForm mode="add" onSubmit={handleSubmit} />
            </div>
        </div>
    );
}

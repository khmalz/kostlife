"use client";

import { Navbar } from "@/components/navbar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { TransactionForm } from "@/components/transaction-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { Transaction } from "@/components/transaction-card";

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

            <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                {/* Mobile Header - just hamburger menu */}
                <header className="mb-6 flex items-center md:hidden">
                    <MobileSidebar />
                </header>

                <TransactionForm mode="add" onSubmit={handleSubmit} />
            </div>
        </div>
    );
}

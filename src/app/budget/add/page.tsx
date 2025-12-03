"use client";

import { Navbar } from "@/components/navbar";
import type { Transaction } from "@/components/transaction-card";
import { TransactionForm } from "@/components/transaction-form";
import { useAuth } from "@/hooks/useAuth";
import { addBudget } from "@/lib/services/budget.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddTransactionPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleSubmit = async (data: Omit<Transaction, "id">) => {
        if (!user?.id) {
            toast.error("Silakan login terlebih dahulu");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await addBudget(user.id, {
                type: data.type,
                amount: data.amount,
                description: data.description,
                budget_at: data.date.toISOString(),
            });

            if (result.success) {
                toast.success("Transaksi berhasil ditambahkan");
                router.push("/budget");
            } else {
                toast.error(result.error || "Gagal menambahkan transaksi");
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary">
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={isLoading}
                username={user?.username}
                onLogout={handleLogout}
            />

            <div className="mx-auto max-w-md md:max-w-6xl md:px-8 md:py-10">
                <TransactionForm
                    mode="add"
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}

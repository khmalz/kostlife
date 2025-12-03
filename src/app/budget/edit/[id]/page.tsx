"use client";

import { Navbar } from "@/components/navbar";
import type { Transaction } from "@/components/transaction-card";
import { TransactionForm } from "@/components/transaction-form";
import { useAuth } from "@/hooks/useAuth";
import { getBudgetById, updateBudget } from "@/lib/services/budget.service";
import type { Budget } from "@/types/budgets";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function budgetToTransaction(budget: Budget): Transaction {
    return {
        id: budget.id,
        type: budget.type,
        amount: budget.amount,
        description: budget.description,
        date: new Date(budget.budget_at),
    };
}

export default function EditTransactionPage() {
    const router = useRouter();
    const params = useParams();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const budgetId = params.id as string;

    useEffect(() => {
        async function fetchBudget() {
            if (!budgetId) return;

            setIsLoadingData(true);
            setError(null);

            try {
                const budget = await getBudgetById(budgetId);

                if (budget) {
                    setTransaction(budgetToTransaction(budget));
                } else {
                    setError("Transaksi tidak ditemukan");
                }
            } catch (err) {
                console.error("Error fetching budget:", err);
                setError("Failed to load transaction");
            } finally {
                setIsLoadingData(false);
            }
        }

        fetchBudget();
    }, [budgetId]);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleSubmit = async (data: Omit<Transaction, "id">) => {
        if (!budgetId) {
            toast.error("ID transaksi tidak ditemukan");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await updateBudget(budgetId, {
                type: data.type,
                amount: data.amount,
                description: data.description,
                budget_at: data.date.toISOString(),
            });

            if (result.success) {
                toast.success("Transaksi berhasil diperbarui");
                router.push("/budget");
            } else {
                toast.error(result.error || "Gagal memperbarui transaksi");
            }
        } catch (error) {
            console.error("Error updating transaction:", error);
            toast.error("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-secondary">
                <Navbar
                    isLoggedIn={isAuthenticated}
                    isLoading={authLoading}
                    username={user?.username}
                    onLogout={handleLogout}
                />
                <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground"></div>
                        <p className="text-primary-foreground/60">
                            Memuat transaksi...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Error or not found state
    if (error || !transaction) {
        return (
            <div className="min-h-screen bg-secondary">
                <Navbar
                    isLoggedIn={isAuthenticated}
                    isLoading={authLoading}
                    username={user?.username}
                    onLogout={handleLogout}
                />
                <div className="mx-auto max-w-md px-4 py-6 md:max-w-6xl md:px-8 md:py-10">
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-primary-foreground/60">
                            {error || "Transaksi tidak ditemukan."}
                        </p>
                        <button
                            onClick={() => router.push("/budget")}
                            className="text-primary-foreground underline hover:no-underline"
                        >
                            Kembali ke Halaman Budget
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary">
            <Navbar
                isLoggedIn={isAuthenticated}
                isLoading={authLoading}
                username={user?.username}
                onLogout={handleLogout}
            />

            <div className="mx-auto max-w-md md:max-w-6xl md:px-8 md:py-10">
                <TransactionForm
                    key={transaction.id}
                    mode="edit"
                    initialData={transaction}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}

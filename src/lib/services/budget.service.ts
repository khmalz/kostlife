"use client";

import { getAuthCookie, setAuthCookie, type UserSession } from "@/lib/cookies";
import {
    addDocument,
    deleteDocument,
    getDocument,
    queryDocuments,
    updateDocument,
} from "@/lib/firebase/firestore";
import type { Budget, BudgetSummary } from "@/types/budgets";
import type { User } from "./auth.service";

// Re-export types for convenience
export type { Budget, BudgetSummary } from "@/types/budgets";

export interface CreateBudgetInput {
    type: "income" | "expense";
    amount: number;
    description: string;
    budget_at?: string; // ISO date string, defaults to now
}

export interface UpdateBudgetInput {
    type?: "income" | "expense";
    amount?: number;
    description?: string;
    budget_at?: string;
}

/**
 * Get single budget by ID
 */
export const getBudgetById = async (
    budgetId: string,
): Promise<Budget | null> => {
    try {
        const budget = await getDocument<Budget>("budgets", budgetId);
        return budget;
    } catch (error) {
        console.error("Get budget error:", error);
        return null;
    }
};

/**
 * Get all budgets for a user
 */
export const getUserBudgets = async (
    userId: string,
    orderByField: "budget_at" | "createdAt" = "budget_at",
    direction: "asc" | "desc" = "desc",
    limitCount?: number,
): Promise<Budget[]> => {
    try {
        const budgets = await queryDocuments<Budget>(
            "budgets",
            [{ field: "userId", operator: "==", value: userId }],
            orderByField,
            direction,
            limitCount,
        );

        return budgets;
    } catch (error) {
        console.error("Get user budgets error:", error);
        return [];
    }
};

/**
 * Get budgets by type (income/expense)
 */
export const getBudgetsByType = async (
    userId: string,
    type: "income" | "expense",
    limitCount?: number,
): Promise<Budget[]> => {
    try {
        const budgets = await queryDocuments<Budget>(
            "budgets",
            [
                { field: "userId", operator: "==", value: userId },
                { field: "type", operator: "==", value: type },
            ],
            "budget_at",
            "desc",
            limitCount,
        );

        return budgets;
    } catch (error) {
        console.error("Get budgets by type error:", error);
        return [];
    }
};

/**
 * Get budgets within date range
 */
export const getBudgetsByDateRange = async (
    userId: string,
    startDate: string,
    endDate: string,
): Promise<Budget[]> => {
    try {
        const budgets = await queryDocuments<Budget>(
            "budgets",
            [
                { field: "userId", operator: "==", value: userId },
                { field: "budget_at", operator: ">=", value: startDate },
                { field: "budget_at", operator: "<=", value: endDate },
            ],
            "budget_at",
            "desc",
        );

        return budgets;
    } catch (error) {
        console.error("Get budgets by date range error:", error);
        return [];
    }
};

/**
 * Get budget summary (total income, expense, balance)
 */
export const getBudgetSummary = async (
    userId: string,
    currentUserBudget: number = 0,
): Promise<BudgetSummary> => {
    try {
        const budgets = await getUserBudgets(userId);

        const totalIncome = budgets
            .filter((b) => b.type === "income")
            .reduce((sum, b) => sum + b.amount, 0);

        const totalExpense = budgets
            .filter((b) => b.type === "expense")
            .reduce((sum, b) => sum + b.amount, 0);

        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance,
            currentBudget: currentUserBudget,
        };
    } catch (error) {
        console.error("Get budget summary error:", error);
        return {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            currentBudget: currentUserBudget,
        };
    }
};

/**
 * Get monthly summary
 */
export const getMonthlySummary = async (
    userId: string,
    year: number,
    month: number, // 1-12
    currentUserBudget: number = 0,
): Promise<BudgetSummary> => {
    try {
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

        const budgets = await getBudgetsByDateRange(userId, startDate, endDate);

        const totalIncome = budgets
            .filter((b) => b.type === "income")
            .reduce((sum, b) => sum + b.amount, 0);

        const totalExpense = budgets
            .filter((b) => b.type === "expense")
            .reduce((sum, b) => sum + b.amount, 0);

        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance,
            currentBudget: currentUserBudget,
        };
    } catch (error) {
        console.error("Get monthly summary error:", error);
        return {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            currentBudget: currentUserBudget,
        };
    }
};

/**
 * Get recent budgets (shorthand for getUserBudgets with limit)
 */
export const getRecentBudgets = async (
    userId: string,
    limit: number = 10,
): Promise<Budget[]> => {
    return getUserBudgets(userId, "budget_at", "desc", limit);
};

/**
 * Sync user budget amount to cookie
 */
const syncBudgetToCookie = (newAmount: number): void => {
    const currentSession = getAuthCookie();
    if (currentSession) {
        const updatedSession: UserSession = {
            ...currentSession,
            amount_budget: newAmount,
        };
        setAuthCookie(updatedSession);
    }
};

/**
 * Update user's amount_budget in Firestore and sync to cookie
 */
const updateUserBudgetAmount = async (
    userId: string,
    newAmount: number,
): Promise<void> => {
    await updateDocument("users", userId, {
        amount_budget: newAmount,
        updatedAt: new Date().toISOString(),
    });
    syncBudgetToCookie(newAmount);
};

/**
 * Add income (pemasukan)
 * Automatically increases user's amount_budget
 */
export const addIncome = async (
    userId: string,
    amount: number,
    description: string,
    budgetAt?: string,
): Promise<{
    success: boolean;
    budgetId?: string;
    newBalance?: number;
    error?: string;
}> => {
    try {
        const user = await getDocument<User>("users", userId);
        if (!user) {
            return { success: false, error: "User tidak ditemukan" };
        }

        const budgetId = await addDocument("budgets", {
            userId,
            type: "income",
            budget_at: budgetAt || new Date().toISOString(),
            amount,
            description,
            createdAt: new Date().toISOString(),
        });

        const newBalance = user.amount_budget + amount;
        await updateUserBudgetAmount(userId, newBalance);

        return { success: true, budgetId, newBalance };
    } catch (error) {
        console.error("Add income error:", error);
        return { success: false, error: "Gagal menambah pemasukan" };
    }
};

/**
 * Add expense (pengeluaran)
 * Automatically decreases user's amount_budget
 */
export const addExpense = async (
    userId: string,
    amount: number,
    description: string,
    budgetAt?: string,
): Promise<{
    success: boolean;
    budgetId?: string;
    newBalance?: number;
    error?: string;
}> => {
    try {
        const user = await getDocument<User>("users", userId);
        if (!user) {
            return { success: false, error: "User tidak ditemukan" };
        }

        if (user.amount_budget < amount) {
            return { success: false, error: "Budget tidak cukup" };
        }

        const budgetId = await addDocument("budgets", {
            userId,
            type: "expense",
            budget_at: budgetAt || new Date().toISOString(),
            amount,
            description,
            createdAt: new Date().toISOString(),
        });

        const newBalance = user.amount_budget - amount;
        await updateUserBudgetAmount(userId, newBalance);

        return { success: true, budgetId, newBalance };
    } catch (error) {
        console.error("Add expense error:", error);
        return { success: false, error: "Gagal menambah pengeluaran" };
    }
};

/**
 * Add budget entry (generic - determines income or expense by type)
 */
export const addBudget = async (
    userId: string,
    input: CreateBudgetInput,
): Promise<{
    success: boolean;
    budgetId?: string;
    newBalance?: number;
    error?: string;
}> => {
    if (input.type === "income") {
        return addIncome(
            userId,
            input.amount,
            input.description,
            input.budget_at,
        );
    } else {
        return addExpense(
            userId,
            input.amount,
            input.description,
            input.budget_at,
        );
    }
};

/**
 * Update budget entry
 */
export const updateBudget = async (
    budgetId: string,
    updates: UpdateBudgetInput,
): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    try {
        const oldBudget = await getDocument<Budget>("budgets", budgetId);
        if (!oldBudget) {
            return { success: false, error: "Budget tidak ditemukan" };
        }

        const user = await getDocument<User>("users", oldBudget.userId);
        if (!user) {
            return { success: false, error: "User tidak ditemukan" };
        }

        let newUserBudget = user.amount_budget;
        const newType = updates.type || oldBudget.type;
        const newAmount = updates.amount ?? oldBudget.amount;

        if (updates.amount !== undefined || updates.type !== undefined) {
            // First, reverse the old transaction
            if (oldBudget.type === "income") {
                newUserBudget -= oldBudget.amount;
            } else {
                newUserBudget += oldBudget.amount;
            }

            // Then, apply the new transaction
            if (newType === "income") {
                newUserBudget += newAmount;
            } else {
                if (newUserBudget < newAmount) {
                    return {
                        success: false,
                        error: "Budget tidak cukup",
                    };
                }
                newUserBudget -= newAmount;
            }

            await updateUserBudgetAmount(oldBudget.userId, newUserBudget);
        }

        await updateDocument("budgets", budgetId, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });

        return { success: true, newBalance: newUserBudget };
    } catch (error) {
        console.error("Update budget error:", error);
        return { success: false, error: "Gagal update budget" };
    }
};

/**
 * Delete budget entry
 * Automatically reverses the transaction in user's amount_budget
 */
export const deleteBudget = async (
    budgetId: string,
): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    try {
        const budget = await getDocument<Budget>("budgets", budgetId);
        if (!budget) {
            return { success: false, error: "Budget tidak ditemukan" };
        }

        const user = await getDocument<User>("users", budget.userId);
        if (!user) {
            return { success: false, error: "User tidak ditemukan" };
        }

        const newUserBudget =
            budget.type === "income"
                ? user.amount_budget - budget.amount
                : user.amount_budget + budget.amount;

        await updateUserBudgetAmount(budget.userId, newUserBudget);

        await deleteDocument("budgets", budgetId);

        return { success: true, newBalance: newUserBudget };
    } catch (error) {
        console.error("Delete budget error:", error);
        return { success: false, error: "Gagal hapus budget" };
    }
};

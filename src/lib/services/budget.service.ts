'use client';

import {
    getAuthCookie,
    setAuthCookie,
    type UserSession,
} from '@/lib/cookies';
import {
    addDocument,
    deleteDocument,
    getDocument,
    updateDocument,
} from '@/lib/firebase/firestore';
import type { User } from './auth.service';
import type { Budget } from './server/budget.service';

// Re-export types and read functions from server for convenience
export {
    getBudgetById, getBudgetsByDateRange, getBudgetsByType, getBudgetSummary,
    getMonthlySummary,
    getRecentBudgets, getUserBudgets
} from './server/budget.service';
export type { Budget, BudgetSummary } from './server/budget.service';

export interface CreateBudgetInput {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    budget_at?: string; // ISO date string, defaults to now
}

export interface UpdateBudgetInput {
    type?: 'income' | 'expense';
    amount?: number;
    description?: string;
    budget_at?: string;
}

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
    newAmount: number
): Promise<void> => {
    await updateDocument('users', userId, {
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
    budgetAt?: string
): Promise<{ success: boolean; budgetId?: string; newBalance?: number; error?: string }> => {
    try {
        // Get current user
        const user = await getDocument<User>('users', userId);
        if (!user) {
            return { success: false, error: 'User tidak ditemukan' };
        }

        // Add budget record
        const budgetId = await addDocument('budgets', {
            userId,
            type: 'income',
            budget_at: budgetAt || new Date().toISOString(),
            amount,
            description,
            createdAt: new Date().toISOString(),
        });

        // Update user budget amount
        const newBalance = user.amount_budget + amount;
        await updateUserBudgetAmount(userId, newBalance);

        return { success: true, budgetId, newBalance };
    } catch (error) {
        console.error('Add income error:', error);
        return { success: false, error: 'Gagal menambah pemasukan' };
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
    budgetAt?: string
): Promise<{ success: boolean; budgetId?: string; newBalance?: number; error?: string }> => {
    try {
        // Get current user
        const user = await getDocument<User>('users', userId);
        if (!user) {
            return { success: false, error: 'User tidak ditemukan' };
        }

        // Check if enough budget
        if (user.amount_budget < amount) {
            return { success: false, error: 'Budget tidak cukup' };
        }

        // Add budget record
        const budgetId = await addDocument('budgets', {
            userId,
            type: 'expense',
            budget_at: budgetAt || new Date().toISOString(),
            amount,
            description,
            createdAt: new Date().toISOString(),
        });

        // Update user budget amount
        const newBalance = user.amount_budget - amount;
        await updateUserBudgetAmount(userId, newBalance);

        return { success: true, budgetId, newBalance };
    } catch (error) {
        console.error('Add expense error:', error);
        return { success: false, error: 'Gagal menambah pengeluaran' };
    }
};

/**
 * Add budget entry (generic - determines income or expense by type)
 */
export const addBudget = async (
    userId: string,
    input: CreateBudgetInput
): Promise<{ success: boolean; budgetId?: string; newBalance?: number; error?: string }> => {
    if (input.type === 'income') {
        return addIncome(userId, input.amount, input.description, input.budget_at);
    } else {
        return addExpense(userId, input.amount, input.description, input.budget_at);
    }
};

/**
 * Update budget entry
 */
export const updateBudget = async (
    budgetId: string,
    updates: UpdateBudgetInput
): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    try {
        // Get old budget data
        const oldBudget = await getDocument<Budget>('budgets', budgetId);
        if (!oldBudget) {
            return { success: false, error: 'Budget tidak ditemukan' };
        }

        // Get user
        const user = await getDocument<User>('users', oldBudget.userId);
        if (!user) {
            return { success: false, error: 'User tidak ditemukan' };
        }

        let newUserBudget = user.amount_budget;
        const newType = updates.type || oldBudget.type;
        const newAmount = updates.amount ?? oldBudget.amount;

        // Calculate budget adjustment if amount or type changed
        if (updates.amount !== undefined || updates.type !== undefined) {
            // First, reverse the old transaction
            if (oldBudget.type === 'income') {
                newUserBudget -= oldBudget.amount;
            } else {
                newUserBudget += oldBudget.amount;
            }

            // Then, apply the new transaction
            if (newType === 'income') {
                newUserBudget += newAmount;
            } else {
                // Check if enough budget for expense
                if (newUserBudget < newAmount) {
                    return { success: false, error: 'Budget tidak cukup untuk perubahan ini' };
                }
                newUserBudget -= newAmount;
            }

            await updateUserBudgetAmount(oldBudget.userId, newUserBudget);
        }

        await updateDocument('budgets', budgetId, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });

        return { success: true, newBalance: newUserBudget };
    } catch (error) {
        console.error('Update budget error:', error);
        return { success: false, error: 'Gagal update budget' };
    }
};

/**
 * Delete budget entry
 * Automatically reverses the transaction in user's amount_budget
 */
export const deleteBudget = async (
    budgetId: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    try {
        // Get budget data
        const budget = await getDocument<Budget>('budgets', budgetId);
        if (!budget) {
            return { success: false, error: 'Budget tidak ditemukan' };
        }

        // Get user
        const user = await getDocument<User>('users', budget.userId);
        if (!user) {
            return { success: false, error: 'User tidak ditemukan' };
        }

        // Reverse the transaction
        const newUserBudget =
            budget.type === 'income'
                ? user.amount_budget - budget.amount
                : user.amount_budget + budget.amount;

        await updateUserBudgetAmount(budget.userId, newUserBudget);

        await deleteDocument('budgets', budgetId);

        return { success: true, newBalance: newUserBudget };
    } catch (error) {
        console.error('Delete budget error:', error);
        return { success: false, error: 'Gagal hapus budget' };
    }
};

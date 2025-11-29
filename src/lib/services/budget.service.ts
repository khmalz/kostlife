'use client';

import {
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from '@/lib/firebase/firestore';
import type { User } from './auth.service';

// ==================== TYPES ====================

export interface Budget {
  id: string;
  userId: string; // Relasi ke users
  type: 'income' | 'expense';
  budget_at: string; // ISO date string
  amount: number;
  description: string;
  createdAt: string;
}

export interface BudgetWithUser extends Budget {
  user?: User;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  currentBudget: number;
}

// ==================== BUDGET FUNCTIONS ====================

/**
 * Tambah income (pemasukan)
 * Otomatis menambah amount_budget user
 */
export const addIncome = async (
  userId: string,
  amount: number,
  description: string,
  budgetAt?: string
): Promise<{ success: boolean; budgetId?: string; error?: string }> => {
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
    const newBudget = user.amount_budget + amount;
    await updateUserBudget(userId, newBudget);

    return { success: true, budgetId };
  } catch (error) {
    console.error('Add income error:', error);
    return { success: false, error: 'Gagal menambah pemasukan' };
  }
};

/**
 * Tambah expense (pengeluaran)
 * Otomatis mengurangi amount_budget user
 */
export const addExpense = async (
  userId: string,
  amount: number,
  description: string,
  budgetAt?: string
): Promise<{ success: boolean; budgetId?: string; error?: string }> => {
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
    const newBudget = user.amount_budget - amount;
    await updateUserBudget(userId, newBudget);

    return { success: true, budgetId };
  } catch (error) {
    console.error('Add expense error:', error);
    return { success: false, error: 'Gagal menambah pengeluaran' };
  }
};

/**
 * Get all budgets untuk user tertentu
 */
export const getUserBudgets = async (
  userId: string,
  orderBy: 'budget_at' | 'createdAt' = 'budget_at',
  direction: 'asc' | 'desc' = 'desc',
  limit?: number
): Promise<Budget[]> => {
  try {
    const budgets = await queryDocuments<Budget>(
      'budgets',
      [{ field: 'userId', operator: '==', value: userId }],
      orderBy,
      direction,
      limit
    );

    return budgets;
  } catch (error) {
    console.error('Get budgets error:', error);
    return [];
  }
};

/**
 * Get budgets by type (income/expense)
 */
export const getBudgetsByType = async (
  userId: string,
  type: 'income' | 'expense',
  limit?: number
): Promise<Budget[]> => {
  try {
    const budgets = await queryDocuments<Budget>(
      'budgets',
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'type', operator: '==', value: type },
      ],
      'budget_at',
      'desc',
      limit
    );

    return budgets;
  } catch (error) {
    console.error('Get budgets by type error:', error);
    return [];
  }
};

/**
 * Get budgets dalam range tanggal
 */
export const getBudgetsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<Budget[]> => {
  try {
    const budgets = await queryDocuments<Budget>(
      'budgets',
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'budget_at', operator: '>=', value: startDate },
        { field: 'budget_at', operator: '<=', value: endDate },
      ],
      'budget_at',
      'desc'
    );

    return budgets;
  } catch (error) {
    console.error('Get budgets by date range error:', error);
    return [];
  }
};

/**
 * Get budget summary (total income, expense, balance)
 */
export const getBudgetSummary = async (userId: string): Promise<BudgetSummary> => {
  try {
    const budgets = await getUserBudgets(userId);
    const user = await getDocument<User>('users', userId);

    const totalIncome = budgets
      .filter((b) => b.type === 'income')
      .reduce((sum, b) => sum + b.amount, 0);

    const totalExpense = budgets
      .filter((b) => b.type === 'expense')
      .reduce((sum, b) => sum + b.amount, 0);

    const balance = totalIncome - totalExpense;
    const currentBudget = user?.amount_budget || 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      currentBudget,
    };
  } catch (error) {
    console.error('Get budget summary error:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      currentBudget: 0,
    };
  }
};

/**
 * Update budget entry
 */
export const updateBudget = async (
  budgetId: string,
  updates: Partial<Budget>
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get old budget data
    const oldBudget = await getDocument<Budget>('budgets', budgetId);
    if (!oldBudget) {
      return { success: false, error: 'Budget tidak ditemukan' };
    }

    // If amount changed, update user budget
    if (updates.amount !== undefined && updates.amount !== oldBudget.amount) {
      const user = await getDocument<User>('users', oldBudget.userId);
      if (!user) {
        return { success: false, error: 'User tidak ditemukan' };
      }

      const difference = updates.amount - oldBudget.amount;
      const newUserBudget =
        oldBudget.type === 'income'
          ? user.amount_budget + difference
          : user.amount_budget - difference;

      await updateUserBudget(oldBudget.userId, newUserBudget);
    }

    // Update budget
    await updateDocument('budgets', budgetId, updates);

    return { success: true };
  } catch (error) {
    console.error('Update budget error:', error);
    return { success: false, error: 'Gagal update budget' };
  }
};

/**
 * Delete budget entry
 * Otomatis adjust amount_budget user
 */
export const deleteBudget = async (
  budgetId: string
): Promise<{ success: boolean; error?: string }> => {
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

    // Adjust user budget (reverse the transaction)
    const newUserBudget =
      budget.type === 'income'
        ? user.amount_budget - budget.amount
        : user.amount_budget + budget.amount;

    await updateUserBudget(budget.userId, newUserBudget);

    // Delete budget
    await deleteDocument('budgets', budgetId);

    return { success: true };
  } catch (error) {
    console.error('Delete budget error:', error);
    return { success: false, error: 'Gagal hapus budget' };
  }
};

/**
 * Get monthly summary (per bulan)
 */
export const getMonthlySummary = async (
  userId: string,
  year: number,
  month: number // 1-12
): Promise<BudgetSummary> => {
  try {
    // Get start and end of month
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    const budgets = await getBudgetsByDateRange(userId, startDate, endDate);

    const totalIncome = budgets
      .filter((b) => b.type === 'income')
      .reduce((sum, b) => sum + b.amount, 0);

    const totalExpense = budgets
      .filter((b) => b.type === 'expense')
      .reduce((sum, b) => sum + b.amount, 0);

    const balance = totalIncome - totalExpense;

    const user = await getDocument<User>('users', userId);
    const currentBudget = user?.amount_budget || 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      currentBudget,
    };
  } catch (error) {
    console.error('Get monthly summary error:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      currentBudget: 0,
    };
  }
};

/**
 * Update user budget amount (delegated to auth.service)
 * This is a stub to avoid breaking existing code, but should be imported from auth.service
 */
import { updateUserBudget } from './auth.service';
export { updateUserBudget };
